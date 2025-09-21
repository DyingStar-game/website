'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  FALLBACK_TASKS,
  Task,
  TaskContributor,
  TaskDifficulty,
  TaskStatus,
  TaskCategory,
  normalizeTaskCategory,
  normalizeTaskDifficulty,
  normalizeTaskStatus,
  TASK_STATUS_ORDER
} from '@/lib/tasks-data';

const generateLocalId = () =>
  typeof globalThis !== 'undefined' &&
  'crypto' in globalThis &&
  typeof globalThis.crypto?.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

type TaskTableShape = {
  id: 'en' | 'fr' | 'hybrid';
  title: string;
  description: string;
  category: string;
  status: string;
  difficulty: string;
  contributors: string;
  requiredRoles?: string;
  deliverables?: string;
  tags?: string;
  max_contributors?: string;
};

const TABLE_SHAPES: TaskTableShape[] = [
  {
    id: 'en',
    title: 'title',
    description: 'description',
    category: 'category',
    status: 'status',
    difficulty: 'difficulty',
    contributors: 'contributors',
    requiredRoles: 'required_roles',
    deliverables: 'deliverables',
    tags: 'tags',
    max_contributors: 'max_contributors'
  },
  {
    id: 'fr',
    title: 'titre',
    description: 'description',
    category: 'categorie',
    status: 'statut',
    difficulty: 'difficulte',
    contributors: 'contributeurs',
    requiredRoles: 'roles',
    deliverables: 'livrables',
    tags: 'mots_cles',
    max_contributors: 'limite_contributeurs'
  },
  {
    id: 'hybrid',
    title: 'titre',
    description: 'description_longue',
    category: 'categorie',
    status: 'statut',
    difficulty: 'difficulte',
    contributors: 'personnes',
    requiredRoles: 'roles',
    deliverables: 'livrables',
    tags: 'mots_cles',
    max_contributors: 'limite_contributeurs'
  }
];

const statusPriority = (status: TaskStatus) => {
  const index = TASK_STATUS_ORDER.indexOf(status);
  return index === -1 ? TASK_STATUS_ORDER.length : index;
};

const detectShapeFromRow = (row: Record<string, any>): TaskTableShape => {
  let best = TABLE_SHAPES[0];
  let bestScore = -1;
  for (const shape of TABLE_SHAPES) {
    let score = 0;
    if (shape.title in row) score += 3;
    if (shape.category in row) score += 2;
    if (shape.status in row) score += 2;
    if (shape.description in row) score += 1;
    if (shape.contributors in row) score += 1;
    if (score > bestScore) {
      best = shape;
      bestScore = score;
    }
  }
  return best;
};

const normaliseArrayField = (value: unknown): string[] | undefined => {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === 'string' ? entry.trim() : null))
      .filter((entry): entry is string => !!entry && entry.length > 0);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }
  return undefined;
};

const mapRowToTask = (row: Record<string, any>): Task => {
  const shape = detectShapeFromRow(row);
  const titleValue = row[shape.title];
  const descriptionValue = row[shape.description];
  const rawCategoryValue = row[shape.category];
  const statusValue = row[shape.status];
  const difficultyValue = row[shape.difficulty];
  const rawContributors = row[shape.contributors];

  const contributors: TaskContributor[] = Array.isArray(rawContributors)
    ? rawContributors
        .filter(Boolean)
        .map((entry: any) => {
          const contributorId =
            entry?.id || entry?.user_id || entry?.username || entry?.pseudo || generateLocalId();
          return {
            id: String(contributorId),
            user_id: String(entry?.user_id || entry?.id || contributorId || generateLocalId()),
            username: String(entry?.username || entry?.display_name || entry?.name || entry?.pseudo || 'Contributeur'),
            avatar_url: entry?.avatar_url || entry?.avatar || entry?.image || null,
            role: entry?.role || entry?.fonction || entry?.titre || null,
            claimed_at: entry?.claimed_at || entry?.joined_at || entry?.date || null
          } satisfies TaskContributor;
        })
    : [];

  const tags = shape.tags ? normaliseArrayField(row[shape.tags]) : undefined;
  const requiredRoles = shape.requiredRoles ? normaliseArrayField(row[shape.requiredRoles]) : undefined;
  const deliverables = shape.deliverables ? normaliseArrayField(row[shape.deliverables]) : undefined;
  const maxContributorsRaw = shape.max_contributors ? row[shape.max_contributors] : null;
  const maxContributorsNumber =
    typeof maxContributorsRaw === 'number'
      ? maxContributorsRaw
      : typeof maxContributorsRaw === 'string'
      ? Number.parseInt(maxContributorsRaw, 10)
      : null;

  return {
    id: row.id ? String(row.id) : generateLocalId(),
    title:
      typeof titleValue === 'string' && titleValue.trim().length > 0
        ? titleValue
        : 'Tâche sans titre',
    description:
      typeof descriptionValue === 'string' && descriptionValue.trim().length > 0
        ? descriptionValue
        : 'Description à compléter',
    category: normalizeTaskCategory(typeof rawCategoryValue === 'string' ? rawCategoryValue : null),
    rawCategory: typeof rawCategoryValue === 'string' ? rawCategoryValue : undefined,
    status: normalizeTaskStatus(typeof statusValue === 'string' ? statusValue : null),
    difficulty: normalizeTaskDifficulty(typeof difficultyValue === 'string' ? difficultyValue : null),
    tags,
    requiredRoles,
    deliverables,
    max_contributors: Number.isFinite(maxContributorsNumber || undefined) ? (maxContributorsNumber as number) : null,
    contributors,
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined
  } satisfies Task;
};

const getShapesToTry = (preferred: TaskTableShape) => {
  const remaining = TABLE_SHAPES.filter((shape) => shape.id !== preferred.id);
  return [preferred, ...remaining];
};

const buildArrayValue = (values?: string[]) => (values ? values.filter((item) => item.trim().length > 0) : []);

const buildInsertPayload = (
  shape: TaskTableShape,
  task: CreateTaskInput,
  contributors: TaskContributor[]
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    [shape.title]: task.title,
    [shape.description]: task.description,
    [shape.category]:
      task.category === 'Autre'
        ? task.customCategory?.trim()?.length
          ? task.customCategory.trim()
          : 'Autre'
        : task.category,
    [shape.status]: task.status,
    [shape.difficulty]: task.difficulty,
    [shape.contributors]: contributors
  };

  if (shape.tags) {
    payload[shape.tags] = buildArrayValue(task.tags);
  }
  if (shape.requiredRoles) {
    payload[shape.requiredRoles] = buildArrayValue(task.requiredRoles);
  }
  if (shape.deliverables) {
    payload[shape.deliverables] = buildArrayValue(task.deliverables);
  }
  if (shape.max_contributors) {
    payload[shape.max_contributors] = task.max_contributors ?? null;
  }
  return payload;
};

const buildUpdatePayload = (
  shape: TaskTableShape,
  patch: UpdateTaskInput
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};
  if (typeof patch.title === 'string') {
    payload[shape.title] = patch.title;
  }
  if (typeof patch.description === 'string') {
    payload[shape.description] = patch.description;
  }
  if (patch.category) {
    payload[shape.category] = patch.category === 'Autre'
      ? patch.customCategory?.trim()?.length
        ? patch.customCategory.trim()
        : 'Autre'
      : patch.category;
  }
  if (patch.status) {
    payload[shape.status] = patch.status;
  }
  if (patch.difficulty) {
    payload[shape.difficulty] = patch.difficulty;
  }
  if (patch.tags) {
    if (shape.tags) {
      payload[shape.tags] = buildArrayValue(patch.tags);
    }
  }
  if (patch.requiredRoles) {
    if (shape.requiredRoles) {
      payload[shape.requiredRoles] = buildArrayValue(patch.requiredRoles);
    }
  }
  if (patch.deliverables) {
    if (shape.deliverables) {
      payload[shape.deliverables] = buildArrayValue(patch.deliverables);
    }
  }
  if (typeof patch.max_contributors !== 'undefined') {
    if (shape.max_contributors) {
      payload[shape.max_contributors] = patch.max_contributors;
    }
  }
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });
  return payload;
};

export interface CreateTaskInput {
  title: string;
  description: string;
  category: TaskCategory;
  customCategory?: string;
  status: TaskStatus;
  difficulty: TaskDifficulty;
  tags?: string[];
  requiredRoles?: string[];
  deliverables?: string[];
  max_contributors?: number | null;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

interface UseTasksResult {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  isUsingFallback: boolean;
  createTask: (task: CreateTaskInput) => Promise<{ error?: unknown }>;
  updateTask: (id: string, patch: UpdateTaskInput) => Promise<{ error?: unknown }>;
  deleteTask: (id: string) => Promise<{ error?: unknown }>;
  claimTask: (taskId: string, contributor: TaskContributor) => Promise<{ error?: unknown }>;
  releaseTask: (taskId: string, contributorId: string) => Promise<{ error?: unknown }>;
  refreshTasks: () => Promise<void>;
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(!supabase);
  const [preferredShape, setPreferredShape] = useState<TaskTableShape>(TABLE_SHAPES[0]);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const statusDiff = statusPriority(a.status) - statusPriority(b.status);
      if (statusDiff !== 0) {
        return statusDiff;
      }
      const dateA = a.created_at ?? '';
      const dateB = b.created_at ?? '';
      if (dateA !== dateB) {
        return dateA > dateB ? -1 : 1;
      }
      return a.title.localeCompare(b.title);
    });
  }, [tasks]);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!supabase) {
      setTasks(FALLBACK_TASKS);
      setIsUsingFallback(true);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('taches')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('Erreur Supabase lors du chargement des tâches', supabaseError);
        setError('Impossible de récupérer les tâches. Données locales affichées.');
        setTasks(FALLBACK_TASKS);
        setIsUsingFallback(true);
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        const detected = detectShapeFromRow(data[0] as Record<string, any>);
        setPreferredShape(detected);
      }

      const mapped = Array.isArray(data) ? data.map((row) => mapRowToTask(row as Record<string, any>)) : [];
      setTasks(mapped.length ? mapped : []);
      setIsUsingFallback(false);
    } catch (err) {
      console.error('Erreur inattendue lors du chargement des tâches', err);
      setError('Erreur de connexion aux tâches. Données locales affichées.');
      setTasks(FALLBACK_TASKS);
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (!supabase) {
      return;
    }
    const channel = supabase
      .channel('dyingstar-taches')
      .on('postgres_changes', { event: '*', schema: 'dyingstar', table: 'taches' }, () => {
        void loadTasks();
      })
      .subscribe();

    return () => {
      try {
        supabase?.removeChannel?.(channel as any);
      } catch (e) {
        console.warn('Cleanup channel supabase échoué (ignoré)', e);
      }
    };
  }, [loadTasks]);

  const createTask = useCallback(
    async (task: CreateTaskInput) => {
      if (!supabase) {
        const newTask: Task = {
          id: generateLocalId(),
          title: task.title,
          description: task.description,
          category: task.category,
          rawCategory:
            task.category === 'Autre'
              ? task.customCategory?.trim() || 'Autre'
              : task.category,
          status: task.status,
          difficulty: task.difficulty,
          tags: task.tags?.filter((tag) => tag.trim().length > 0),
          requiredRoles: task.requiredRoles?.filter((role) => role.trim().length > 0),
          deliverables: task.deliverables?.filter((item) => item.trim().length > 0),
          max_contributors: task.max_contributors ?? null,
          contributors: [],
          created_at: new Date().toISOString()
        };
        setTasks((previous) => [newTask, ...previous]);
        return {};
      }

      let lastError: unknown = null;
      for (const shape of getShapesToTry(preferredShape)) {
        const payload = buildInsertPayload(shape, task, []);
        const { error: supabaseError } = await supabase.from('taches').insert([payload]);
        if (!supabaseError) {
          setPreferredShape(shape);
          await loadTasks();
          return {};
        }
        lastError = supabaseError;
      }
      setError('Erreur lors de la création de la tâche');
      return { error: lastError };
    },
    [loadTasks, preferredShape]
  );

  const updateTask = useCallback(
    async (id: string, patch: UpdateTaskInput) => {
      if (!supabase) {
        setTasks((previous) =>
          previous.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...patch,
                  category: patch.category ?? task.category,
                  rawCategory:
                    patch.category === 'Autre'
                      ? patch.customCategory?.trim() || task.rawCategory || 'Autre'
                      : patch.category ?? task.rawCategory
                }
              : task
          )
        );
        return {};
      }

      let lastError: unknown = null;
      for (const shape of getShapesToTry(preferredShape)) {
        const payload = buildUpdatePayload(shape, patch);
        if (Object.keys(payload).length === 0) {
          return {};
        }
        const { error: supabaseError } = await supabase.from('taches').update(payload).eq('id', id);
        if (!supabaseError) {
          setPreferredShape(shape);
          await loadTasks();
          return {};
        }
        lastError = supabaseError;
      }
      setError('Erreur lors de la mise à jour de la tâche');
      return { error: lastError };
    },
    [loadTasks, preferredShape]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!supabase) {
        setTasks((previous) => previous.filter((task) => task.id !== id));
        return {};
      }

      let lastError: unknown = null;
      for (const shape of getShapesToTry(preferredShape)) {
        const { error: supabaseError } = await supabase.from('taches').delete().eq('id', id);
        if (!supabaseError) {
          setPreferredShape(shape);
          await loadTasks();
          return {};
        }
        lastError = supabaseError;
      }
      setError('Erreur lors de la suppression de la tâche');
      return { error: lastError };
    },
    [loadTasks, preferredShape]
  );

  const claimTask = useCallback(
    async (taskId: string, contributor: TaskContributor) => {
      const contributorWithMeta: TaskContributor = {
        ...contributor,
        claimed_at: contributor.claimed_at ?? new Date().toISOString()
      };
      if (!supabase) {
        setTasks((previous) =>
          previous.map((task) => {
            if (task.id !== taskId) return task;
            const exists = task.contributors.some((entry) => entry.user_id === contributor.user_id);
            if (exists) {
              return task;
            }
            return {
              ...task,
              contributors: [...task.contributors, contributorWithMeta]
            };
          })
        );
        return {};
      }

      const targetedTask = tasks.find((task) => task.id === taskId);
      const updatedContributors = targetedTask
        ? [
            ...targetedTask.contributors.filter((entry) => entry.user_id !== contributor.user_id),
            contributorWithMeta
          ]
        : [contributorWithMeta];

      let lastError: unknown = null;
      for (const shape of getShapesToTry(preferredShape)) {
        const { error: supabaseError } = await supabase
          .from('taches')
          .update({ [shape.contributors]: updatedContributors })
          .eq('id', taskId);
        if (!supabaseError) {
          setPreferredShape(shape);
          await loadTasks();
          return {};
        }
        lastError = supabaseError;
      }
      setError("Erreur lors de l'attribution de la tâche");
      return { error: lastError };
    },
    [loadTasks, preferredShape, tasks]
  );

  const releaseTask = useCallback(
    async (taskId: string, contributorId: string) => {
      if (!supabase) {
        setTasks((previous) =>
          previous.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  contributors: task.contributors.filter((entry) => entry.user_id !== contributorId)
                }
              : task
          )
        );
        return {};
      }

      const targetedTask = tasks.find((task) => task.id === taskId);
      const updatedContributors = targetedTask
        ? targetedTask.contributors.filter((entry) => entry.user_id !== contributorId)
        : [];

      let lastError: unknown = null;
      for (const shape of getShapesToTry(preferredShape)) {
        const { error: supabaseError } = await supabase
          .from('taches')
          .update({ [shape.contributors]: updatedContributors })
          .eq('id', taskId);
        if (!supabaseError) {
          setPreferredShape(shape);
          await loadTasks();
          return {};
        }
        lastError = supabaseError;
      }
      setError("Erreur lors de la libération de la tâche");
      return { error: lastError };
    },
    [loadTasks, preferredShape, tasks]
  );

  return {
    tasks: sortedTasks,
    isLoading,
    error,
    isUsingFallback,
    createTask,
    updateTask,
    deleteTask,
    claimTask,
    releaseTask,
    refreshTasks: loadTasks
  } satisfies UseTasksResult;
}
