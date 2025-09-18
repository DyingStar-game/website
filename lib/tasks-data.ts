export const TASK_CATEGORY_DEFINITIONS = [
  {
    id: 'Dev',
    label: 'Développement',
    summary: 'Gameplay, outils et intégrations techniques',
    gradient: 'from-cyan-400 to-sky-500'
  },
  {
    id: 'Game Design',
    label: 'Game Design',
    summary: 'Systèmes, boucles de jeu et équilibrage',
    gradient: 'from-amber-400 to-orange-500'
  },
  {
    id: 'Narrative',
    label: 'Narration',
    summary: 'Univers, quêtes et dialogues dynamiques',
    gradient: 'from-purple-400 to-fuchsia-500'
  },
  {
    id: 'Tech',
    label: 'Tech',
    summary: 'Infrastructure, pipeline et automatisation',
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'Art',
    label: 'Direction artistique',
    summary: 'Concepts, UI et assets visuels',
    gradient: 'from-rose-400 to-red-500'
  },
  {
    id: 'Audio',
    label: 'Audio',
    summary: 'Sound design, VO et ambiance musicale',
    gradient: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'Community',
    label: 'Communauté',
    summary: 'Communication, évènements et modération',
    gradient: 'from-slate-400 to-slate-600'
  }
] as const;

export type KnownTaskCategory = typeof TASK_CATEGORY_DEFINITIONS[number]['id'];
export type TaskCategory = KnownTaskCategory | 'Autre';

export const TASK_CATEGORY_ORDER: TaskCategory[] = [
  'Dev',
  'Game Design',
  'Narrative',
  'Tech',
  'Art',
  'Audio',
  'Community',
  'Autre'
];

export const TASK_STATUS_DEFINITIONS = {
  open: {
    label: 'Disponible',
    badge: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    accent: 'text-emerald-300'
  },
  'in-progress': {
    label: 'En cours',
    badge: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
    accent: 'text-sky-300'
  },
  'in-review': {
    label: 'En revue',
    badge: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
    accent: 'text-violet-300'
  },
  blocked: {
    label: 'En attente',
    badge: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
    accent: 'text-orange-300'
  },
  completed: {
    label: 'Terminé',
    badge: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200',
    accent: 'text-emerald-200'
  }
} as const;

export type TaskStatus = keyof typeof TASK_STATUS_DEFINITIONS;

export const TASK_STATUS_ORDER: TaskStatus[] = ['open', 'in-progress', 'in-review', 'blocked', 'completed'];

export const TASK_DIFFICULTY_DEFINITIONS = {
  easy: {
    label: 'Accessible',
    description: 'Idéal pour un premier apport sur le projet',
    badge: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
  },
  medium: {
    label: 'Intermédiaire',
    description: 'Demande un peu d\'autonomie et de coordination',
    badge: 'border-amber-500/40 bg-amber-500/10 text-amber-200'
  },
  hard: {
    label: 'Expert',
    description: 'Requiert une expertise spécifique et un suivi serré',
    badge: 'border-rose-500/40 bg-rose-500/10 text-rose-200'
  }
} as const;

export type TaskDifficulty = keyof typeof TASK_DIFFICULTY_DEFINITIONS;

export interface TaskContributor {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string | null;
  role?: string | null;
  claimed_at?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  rawCategory?: string;
  status: TaskStatus;
  difficulty: TaskDifficulty;
  tags?: string[];
  requiredRoles?: string[];
  deliverables?: string[];
  max_contributors?: number | null;
  contributors: TaskContributor[];
  created_at?: string;
  updated_at?: string;
}

const CATEGORY_LOOKUP = new Map(
  TASK_CATEGORY_DEFINITIONS.map((definition) => [definition.id.toLowerCase(), definition.id])
);

export function normalizeTaskCategory(value: string | null | undefined): TaskCategory {
  if (!value) {
    return 'Autre';
  }
  const normalized = value.trim();
  const direct = CATEGORY_LOOKUP.get(normalized.toLowerCase());
  if (direct) {
    return direct;
  }
  return 'Autre';
}

export function normalizeTaskStatus(value: string | null | undefined): TaskStatus {
  if (!value) {
    return 'open';
  }
  const lower = value.toLowerCase();
  const match = TASK_STATUS_ORDER.find((status) => status === lower);
  return match ?? 'open';
}

export function normalizeTaskDifficulty(value: string | null | undefined): TaskDifficulty {
  if (!value) {
    return 'medium';
  }
  const lower = value.toLowerCase();
  if (lower === 'easy' || lower === 'medium' || lower === 'hard') {
    return lower;
  }
  return 'medium';
}

export function getCategoryDefinition(category: TaskCategory) {
  if (category === 'Autre') {
    return {
      id: 'Autre',
      label: 'Autres missions',
      summary: 'Tâches transverses ou à définir',
      gradient: 'from-slate-500 to-slate-700'
    } as const;
  }
  return TASK_CATEGORY_DEFINITIONS.find((definition) => definition.id === category)!;
}

export function getStatusDefinition(status: TaskStatus) {
  return TASK_STATUS_DEFINITIONS[status];
}

export function getDifficultyDefinition(difficulty: TaskDifficulty) {
  return TASK_DIFFICULTY_DEFINITIONS[difficulty];
}

export const FALLBACK_TASKS: Task[] = [
  {
    id: 'fallback-dev-001',
    title: 'Prototype du système de vol',
    description:
      'Mettre en place un modèle de déplacement 0G pour les navettes légères, avec gestion de l\'inertie et synchronisation réseau.',
    category: 'Dev',
    rawCategory: 'Dev',
    status: 'in-progress',
    difficulty: 'hard',
    tags: ['Unity', 'Netcode', 'Gameplay'],
    requiredRoles: ['Gameplay Engineer'],
    deliverables: ['Prototype jouable', 'Document de tests'],
    contributors: [
      {
        id: 'cfa56c88-crew',
        user_id: 'cfa56c88-crew',
        username: 'Nova',
        role: 'Lead Gameplay',
        claimed_at: '2025-01-04T12:35:00Z'
      }
    ],
    created_at: '2024-12-28T09:00:00Z'
  },
  {
    id: 'fallback-gd-002',
    title: 'Boucle de mission de sauvetage',
    description:
      'Formaliser une boucle courte de mission où l\'équipage récupère des survivants dans la ceinture des Exilés. Décrire les enjeux et les variations possibles.',
    category: 'Game Design',
    rawCategory: 'Game Design',
    status: 'open',
    difficulty: 'medium',
    tags: ['Narrative systems', 'Mission design'],
    requiredRoles: ['Game Designer', 'UX Writer'],
    contributors: [],
    created_at: '2025-01-02T17:15:00Z'
  },
  {
    id: 'fallback-narrative-003',
    title: 'Bible des factions - Synthèse',
    description:
      'Consolider les axes narratifs des trois principales factions présentes sur le Dying Star et produire une fiche synthétique par faction.',
    category: 'Narrative',
    rawCategory: 'Narrative',
    status: 'in-progress',
    difficulty: 'medium',
    tags: ['Worldbuilding', 'Lore'],
    contributors: [
      {
        id: 'aurora',
        user_id: 'aurora',
        username: 'Aurora',
        role: 'Narrative Lead',
        claimed_at: '2025-01-05T10:12:00Z'
      },
      {
        id: 'selene',
        user_id: 'selene',
        username: 'Selene',
        role: 'Storyteller',
        claimed_at: '2025-01-06T18:45:00Z'
      }
    ],
    deliverables: ['Document synthèse 6 pages'],
    created_at: '2024-12-26T14:22:00Z'
  },
  {
    id: 'fallback-art-004',
    title: 'Moodboard du hub communautaire',
    description:
      'Créer un moodboard rassemblant références et intentions visuelles pour le hub central accessible aux joueurs au démarrage.',
    category: 'Art',
    rawCategory: 'Art',
    status: 'open',
    difficulty: 'easy',
    tags: ['Concept Art', 'Moodboard'],
    contributors: [],
    created_at: '2025-01-03T11:00:00Z'
  },
  {
    id: 'fallback-tech-005',
    title: 'Pipeline d\'intégration audio',
    description:
      'Documenter et automatiser l\'import des assets audio (ambiances, SFX) dans le projet avec validation des métadonnées.',
    category: 'Tech',
    rawCategory: 'Tech',
    status: 'open',
    difficulty: 'medium',
    tags: ['Automation', 'CI/CD'],
    requiredRoles: ['Tools Programmer'],
    contributors: [],
    created_at: '2025-01-04T08:42:00Z'
  }
];
