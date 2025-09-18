'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BookmarkCheck,
  BookmarkPlus,
  Filter,
  Loader2,
  Plus,
  Sparkles,
  Tag,
  Users
} from 'lucide-react';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useSimpleAuth } from '@/hooks/use-auth';
import {
  CreateTaskInput,
  useTasks
} from '@/hooks/use-tasks';
import {
  Task,
  TaskCategory,
  TaskDifficulty,
  TaskStatus,
  TASK_CATEGORY_DEFINITIONS,
  getCategoryDefinition,
  getDifficultyDefinition,
  getStatusDefinition
} from '@/lib/tasks-data';

const FILTER_CATEGORIES: { id: 'all' | TaskCategory; label: string }[] = [
  { id: 'all', label: 'Toutes les catégories' },
  ...TASK_CATEGORY_DEFINITIONS.map((definition) => ({
    id: definition.id as TaskCategory,
    label: definition.label
  })),
  { id: 'Autre', label: 'Autres missions' }
];

const STATUS_OPTIONS: TaskStatus[] = ['open', 'in-progress', 'in-review', 'blocked', 'completed'];
const DIFFICULTY_OPTIONS: TaskDifficulty[] = ['easy', 'medium', 'hard'];

const buildCsv = (value: string) =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

const formatContributorInitials = (name: string) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part.charAt(0)?.toUpperCase() ?? '').join('');
  return initials || name.charAt(0)?.toUpperCase() || '?';
};

function TaskCard({ task, onOpen }: { task: Task; onOpen: (task: Task) => void }) {
  const statusMeta = getStatusDefinition(task.status);
  const difficultyMeta = getDifficultyDefinition(task.difficulty);
  const categoryMeta = getCategoryDefinition(task.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="group relative h-full border border-brand-primary/25 bg-brand-dark/70 px-6 pb-6 pt-5 shadow-[0_18px_35px_rgba(var(--brand-dark-rgb),0.35)] transition-all duration-300 hover:border-brand-primary/60 hover:shadow-[0_30px_55px_rgba(var(--brand-dark-rgb),0.5)]">
        <CardHeader className="space-y-4 p-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge className={`border text-[0.55rem] uppercase tracking-[0.35em] ${statusMeta.badge}`}>
              {statusMeta.label}
            </Badge>
            <Badge className={`border text-[0.55rem] uppercase tracking-[0.35em] ${difficultyMeta.badge}`}>
              {difficultyMeta.label}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-brand-primary/40 bg-brand-primary/10 px-3 py-1 text-[0.55rem] uppercase tracking-[0.35em] text-brand-primary">
              {categoryMeta.label}
            </span>
            {task.max_contributors ? (
              <span className="text-[0.55rem] uppercase tracking-[0.35em] text-white/60">
                {task.contributors.length}/{task.max_contributors} places
              </span>
            ) : null}
          </div>
          <CardTitle className="text-2xl font-semibold text-white">
            {task.title}
          </CardTitle>
          <p className="text-sm leading-relaxed text-white/75 line-clamp-4">
            {task.description}
          </p>
        </CardHeader>
        <CardContent className="mt-6 flex flex-col gap-6 p-0">
          {task.tags && task.tags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-[0.55rem] uppercase tracking-[0.35em] text-brand-primary"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {task.contributors.slice(0, 3).map((contributor) => (
                  <div
                    key={`${task.id}-${contributor.user_id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-primary/40 bg-brand-primary/15 text-[0.65rem] font-semibold text-brand-dark"
                    title={contributor.username}
                  >
                    {formatContributorInitials(contributor.username)}
                  </div>
                ))}
                {task.contributors.length === 0 ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-white/30 text-[0.65rem] uppercase tracking-[0.35em] text-white/60">
                    +
                  </div>
                ) : null}
              </div>
              <span className="text-[0.65rem] uppercase tracking-[0.35em] text-white/60">
                {task.contributors.length}{' '}
                {task.contributors.length > 1 ? 'contributeurs' : 'contributeur'}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="group border border-brand-primary/60 bg-transparent px-6 text-[0.6rem] uppercase tracking-[0.35em] text-brand-primary transition-colors hover:bg-brand-primary hover:text-brand-dark"
              onClick={() => onOpen(task)}
            >
              Détails
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TasksGrid({ tasks, onOpen }: { tasks: Task[]; onOpen: (task: Task) => void }) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-black/40 px-10 py-16 text-center text-white/70">
        <Sparkles className="mb-4 h-8 w-8 text-brand-primary" />
        <p className="max-w-md text-sm leading-relaxed">
          Aucune mission ne correspond à vos filtres pour le moment. Essayez une autre catégorie ou revenez plus tard : de nouvelles tâches arrivent chaque semaine.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onOpen={onOpen} />
      ))}
    </div>
  );
}

export default function ContributePage() {
  const { user, isAuthenticated } = useSimpleAuth();
  const {
    tasks,
    isLoading,
    error,
    isUsingFallback,
    createTask,
    claimTask,
    releaseTask
  } = useTasks();

  const [selectedCategory, setSelectedCategory] = useState<'all' | TaskCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClaimActionLoading, setIsClaimActionLoading] = useState(false);
  const isAdmin = Boolean(user?.isAdmin);

  const [formState, setFormState] = useState({
    title: '',
    description: '',
    category: 'Dev' as TaskCategory,
    customCategory: '',
    status: 'open' as TaskStatus,
    difficulty: 'medium' as TaskDifficulty,
    tags: '',
    requiredRoles: '',
    deliverables: '',
    maxContributors: ''
  });

  const resetForm = () => {
    setFormState({
      title: '',
      description: '',
      category: 'Dev',
      customCategory: '',
      status: 'open',
      difficulty: 'medium',
      tags: '',
      requiredRoles: '',
      deliverables: '',
      maxContributors: ''
    });
  };

  const categoryCount = useMemo(() => {
    const base: Record<TaskCategory, number> = {
      Dev: 0,
      'Game Design': 0,
      Narrative: 0,
      Tech: 0,
      Art: 0,
      Audio: 0,
      Community: 0,
      Autre: 0
    };
    tasks.forEach((task) => {
      base[task.category] = (base[task.category] ?? 0) + 1;
    });
    return base;
  }, [tasks]);

  const openTasksCount = useMemo(
    () => tasks.filter((task) => task.status === 'open').length,
    [tasks]
  );

  const contributorsCount = useMemo(() => {
    const ids = new Set<string>();
    tasks.forEach((task) => {
      task.contributors.forEach((contributor) => {
        if (contributor.user_id) {
          ids.add(contributor.user_id);
        }
      });
    });
    return ids.size;
  }, [tasks]);

  const categoriesInUse = useMemo(
    () => Object.values(categoryCount).filter((count) => count > 0).length,
    [categoryCount]
  );

  const filteredTasks = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesCategory =
        selectedCategory === 'all' ? true : task.category === selectedCategory;
      if (!matchesCategory) {
        return false;
      }
      if (!lowerSearch) {
        return true;
      }
      const inTitle = task.title.toLowerCase().includes(lowerSearch);
      const inDescription = task.description.toLowerCase().includes(lowerSearch);
      const inTags = task.tags?.some((tag) => tag.toLowerCase().includes(lowerSearch));
      return inTitle || inDescription || inTags;
    });
  }, [tasks, selectedCategory, searchTerm]);

  const metrics = useMemo(
    () => [
      { label: 'Tâches disponibles', value: openTasksCount },
      { label: 'Contributeurs actifs', value: contributorsCount },
      { label: 'Domaines couverts', value: categoriesInUse }
    ],
    [categoriesInUse, contributorsCount, openTasksCount]
  );

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.title.trim() || !formState.description.trim()) {
      return;
    }

    const payload: CreateTaskInput = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      category: formState.category,
      customCategory:
        formState.category === 'Autre'
          ? formState.customCategory.trim() || 'Autre'
          : undefined,
      status: formState.status,
      difficulty: formState.difficulty,
      tags: formState.tags ? buildCsv(formState.tags) : undefined,
      requiredRoles: formState.requiredRoles ? buildCsv(formState.requiredRoles) : undefined,
      deliverables: formState.deliverables ? buildCsv(formState.deliverables) : undefined,
      max_contributors:
        formState.maxContributors.trim().length > 0
          ? Number.parseInt(formState.maxContributors, 10) || null
          : null
    };

    setIsSubmitting(true);
    const result = await createTask(payload);
    setIsSubmitting(false);

    if (!result.error) {
      resetForm();
      setIsCreateOpen(false);
    }
  };

  const handleClaimTask = async () => {
    if (!selectedTask || !user) {
      return;
    }
    setIsClaimActionLoading(true);
    const result = await claimTask(selectedTask.id, {
      id: user.id,
      user_id: user.id,
      username: user.username,
      avatar_url: user.avatar,
      role: user.role,
      claimed_at: new Date().toISOString()
    });
    setIsClaimActionLoading(false);
    if (!result.error) {
      setIsDetailOpen(false);
    }
  };

  const handleReleaseTask = async () => {
    if (!selectedTask || !user) {
      return;
    }
    setIsClaimActionLoading(true);
    const result = await releaseTask(selectedTask.id, user.id);
    setIsClaimActionLoading(false);
    if (!result.error) {
      setIsDetailOpen(false);
    }
  };

  const hasUserClaimed = selectedTask?.contributors.some(
    (contributor) => contributor.user_id === user?.id
  );

  return (
    <main className="min-h-screen bg-brand-night text-white">
      <Navigation />
      <section className="relative overflow-hidden bg-brand-dark pt-32 pb-20">
        <div className="absolute inset-0 bg-brand-dark" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 15%, rgba(var(--brand-primary-rgb),0.35), transparent 55%)'
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 78% 35%, rgba(var(--brand-dark-rgb),0.5), transparent 60%)'
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6">
          <motion.h1
            className="font-poppins text-4xl font-semibold uppercase tracking-[0.32em] text-white sm:text-5xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Contribuer au projet Dying Star
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Rejoignez l&apos;équipage et choisissez les missions qui correspondent à vos compétences. Chaque tâche renforce l&apos;univers du MMO narratif et rapproche la communauté de la prochaine étape du voyage.
          </motion.p>
          {isUsingFallback ? (
            <motion.div
              className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-full border border-brand-primary/40 bg-brand-primary/10 px-5 py-3 text-sm text-brand-primary"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
            >
              <AlertTriangle className="h-5 w-5" />
              Mode démonstration : les données affichées proviennent d&apos;un jeu d&apos;exemple.
            </motion.div>
          ) : null}
          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
          >
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-3xl border border-brand-primary/25 bg-white/5 px-6 py-6 text-left backdrop-blur-xl"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-brand-primary/80">
                  {metric.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative border-t border-brand-primary/20 bg-brand-night/95 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {FILTER_CATEGORIES.map((option) => {
                  const count =
                    option.id === 'all' ? tasks.length : categoryCount[option.id];
                  const isActive = selectedCategory === option.id;
                  return (
                    <Button
                      key={option.id}
                      type="button"
                      variant={isActive ? 'default' : 'outline'}
                      className={`h-11 rounded-full border px-6 text-[0.6rem] uppercase tracking-[0.35em] transition-colors ${
                        isActive
                          ? 'border-brand-primary bg-brand-primary text-brand-dark'
                          : 'border-brand-primary/40 text-brand-primary hover:bg-brand-primary/10'
                      }`}
                      onClick={() => setSelectedCategory(option.id)}
                    >
                      {option.label}
                      <span className="ml-2 text-xs text-inherit opacity-80">({count})</span>
                    </Button>
                  );
                })}
              </div>
              <div className="relative max-w-xl">
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Rechercher une mission par mot-clé"
                  className="h-12 rounded-full border-brand-primary/40 bg-brand-dark/80 pl-12 text-sm text-white placeholder:text-white/40"
                />
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-primary/70" />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Card className="w-full rounded-3xl border border-brand-primary/20 bg-brand-dark/70 px-5 py-4 text-sm text-white/80 sm:w-64">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-brand-primary" />
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-[0.35em] text-brand-primary/70">
                      Missions ouvertes
                    </p>
                    <p className="text-lg font-semibold text-white">{openTasksCount}</p>
                  </div>
                </div>
              </Card>

              {isAdmin ? (
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="h-12 rounded-full border border-brand-primary bg-brand-primary px-6 text-[0.6rem] uppercase tracking-[0.35em] text-brand-dark shadow-[0_15px_35px_rgba(var(--brand-primary-rgb),0.35)] hover:scale-[1.02]"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Nouvelle tâche
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl border border-brand-primary/30 bg-brand-dark text-white">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-semibold text-brand-primary">
                        Créer une nouvelle mission
                      </DialogTitle>
                    </DialogHeader>
                    <form className="mt-6 space-y-6" onSubmit={handleCreateTask}>
                      <div className="grid gap-2">
                        <Label htmlFor="task-title" className="text-sm text-white/70">
                          Titre de la mission
                        </Label>
                        <Input
                          id="task-title"
                          value={formState.title}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, title: event.target.value }))
                          }
                          placeholder="Ex : Cartographier les nébuleuses du secteur 7"
                          className="border-brand-primary/30 bg-black/40 text-white"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="task-description" className="text-sm text-white/70">
                          Description
                        </Label>
                        <Textarea
                          id="task-description"
                          value={formState.description}
                          onChange={(event) =>
                            setFormState((prev) => ({ ...prev, description: event.target.value }))
                          }
                          placeholder="Décrivez le contexte, l'objectif et les livrables attendus."
                          className="border-brand-primary/30 bg-black/40 text-sm text-white"
                          required
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label className="text-sm text-white/70">Catégorie</Label>
                          <Select
                            value={formState.category}
                            onValueChange={(value) =>
                              setFormState((prev) => ({
                                ...prev,
                                category: value as TaskCategory,
                                customCategory: value === 'Autre' ? prev.customCategory : ''
                              }))
                            }
                          >
                            <SelectTrigger className="h-12 border-brand-primary/30 bg-black/40 text-white">
                              <SelectValue placeholder="Choisir une catégorie" />
                            </SelectTrigger>
                            <SelectContent className="border border-brand-primary/20 bg-brand-dark text-white">
                              {FILTER_CATEGORIES.filter((option) => option.id !== 'all').map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formState.category === 'Autre' ? (
                            <Input
                              value={formState.customCategory}
                              onChange={(event) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  customCategory: event.target.value
                                }))
                              }
                              placeholder="Précisez la catégorie"
                              className="border-brand-primary/30 bg-black/40 text-white"
                              required
                            />
                          ) : null}
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-sm text-white/70">Statut</Label>
                          <Select
                            value={formState.status}
                            onValueChange={(value) =>
                              setFormState((prev) => ({
                                ...prev,
                                status: value as TaskStatus
                              }))
                            }
                          >
                            <SelectTrigger className="h-12 border-brand-primary/30 bg-black/40 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border border-brand-primary/20 bg-brand-dark text-white">
                              {STATUS_OPTIONS.map((option) => {
                                const meta = getStatusDefinition(option);
                                return (
                                  <SelectItem key={option} value={option}>
                                    {meta.label}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-sm text-white/70">Difficulté</Label>
                          <Select
                            value={formState.difficulty}
                            onValueChange={(value) =>
                              setFormState((prev) => ({
                                ...prev,
                                difficulty: value as TaskDifficulty
                              }))
                            }
                          >
                            <SelectTrigger className="h-12 border-brand-primary/30 bg-black/40 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border border-brand-primary/20 bg-brand-dark text-white">
                              {DIFFICULTY_OPTIONS.map((option) => {
                                const meta = getDifficultyDefinition(option);
                                return (
                                  <SelectItem key={option} value={option}>
                                    {meta.label}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="task-max" className="text-sm text-white/70">
                            Nombre maximum de contributeurs (optionnel)
                          </Label>
                          <Input
                            id="task-max"
                            value={formState.maxContributors}
                            onChange={(event) =>
                              setFormState((prev) => ({
                                ...prev,
                                maxContributors: event.target.value.replace(/[^0-9]/g, '')
                              }))
                            }
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Ex : 3"
                            className="border-brand-primary/30 bg-black/40 text-white"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm text-white/70">Compétences ou rôles recherchés</Label>
                        <Input
                          value={formState.requiredRoles}
                          onChange={(event) =>
                            setFormState((prev) => ({
                              ...prev,
                              requiredRoles: event.target.value
                            }))
                          }
                          placeholder="Séparez par des virgules (ex : Gameplay Engineer, Level Designer)"
                          className="border-brand-primary/30 bg-black/40 text-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm text-white/70">Livrables attendus</Label>
                        <Input
                          value={formState.deliverables}
                          onChange={(event) =>
                            setFormState((prev) => ({
                              ...prev,
                              deliverables: event.target.value
                            }))
                          }
                          placeholder="Ex : Document de synthèse, maquette UI"
                          className="border-brand-primary/30 bg-black/40 text-white"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm text-white/70">Mots-clés</Label>
                        <Input
                          value={formState.tags}
                          onChange={(event) =>
                            setFormState((prev) => ({
                              ...prev,
                              tags: event.target.value
                            }))
                          }
                          placeholder="Ex : Netcode, Lore, Concept art"
                          className="border-brand-primary/30 bg-black/40 text-white"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="border border-white/20 bg-transparent px-6 text-[0.6rem] uppercase tracking-[0.35em] text-white hover:bg-white/10"
                          onClick={() => {
                            resetForm();
                            setIsCreateOpen(false);
                          }}
                        >
                          Annuler
                        </Button>
                        <Button
                          type="submit"
                          className="border border-brand-primary bg-brand-primary px-6 text-[0.6rem] uppercase tracking-[0.35em] text-brand-dark hover:scale-[1.02]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <BookmarkPlus className="mr-2 h-4 w-4" />
                          )}
                          Publier la tâche
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : null}
            </div>
          </div>

          {error ? (
            <div className="mt-10 rounded-3xl border border-brand-primary/30 bg-brand-primary/10 px-6 py-4 text-sm text-brand-primary">
              {error}
            </div>
          ) : null}

          <div className="mt-12">
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
              </div>
            ) : (
              <TasksGrid tasks={filteredTasks} onOpen={handleOpenTask} />
            )}
          </div>
        </div>
      </section>

      <Footer />

      <Dialog
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) {
            setSelectedTask(null);
            setIsClaimActionLoading(false);
          }
        }}
      >
        <DialogContent className="max-w-3xl border border-brand-primary/30 bg-brand-dark text-white">
          {selectedTask ? (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-3xl font-semibold text-brand-primary">
                  {selectedTask.title}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={`border text-[0.6rem] uppercase tracking-[0.35em] ${getStatusDefinition(selectedTask.status).badge}`}>
                  {getStatusDefinition(selectedTask.status).label}
                </Badge>
                <Badge className={`border text-[0.6rem] uppercase tracking-[0.35em] ${getDifficultyDefinition(selectedTask.difficulty).badge}`}>
                  {getDifficultyDefinition(selectedTask.difficulty).label}
                </Badge>
                <span className="rounded-full border border-brand-primary/40 bg-brand-primary/10 px-4 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-brand-primary">
                  {getCategoryDefinition(selectedTask.category).label}
                </span>
              </div>
              <div className="space-y-3 text-sm leading-relaxed text-white/80">
                {selectedTask.description.split('\n').map((paragraph, index) => (
                  <p key={`${selectedTask.id}-paragraph-${index}`}>{paragraph}</p>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {selectedTask.requiredRoles && selectedTask.requiredRoles.length > 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <p className="text-[0.6rem] uppercase tracking-[0.35em] text-brand-primary/70">
                      Rôles recherchés
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-white/80">
                      {selectedTask.requiredRoles.map((role) => (
                        <li key={`${selectedTask.id}-${role}`}>• {role}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {selectedTask.deliverables && selectedTask.deliverables.length > 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <p className="text-[0.6rem] uppercase tracking-[0.35em] text-brand-primary/70">
                      Livrables
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-white/80">
                      {selectedTask.deliverables.map((deliverable) => (
                        <li key={`${selectedTask.id}-${deliverable}`}>• {deliverable}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-brand-primary/70">
                  Contributeurs
                </p>
                {selectedTask.contributors.length > 0 ? (
                  <ul className="mt-3 space-y-3 text-sm text-white/80">
                    {selectedTask.contributors.map((contributor) => (
                      <li key={`${selectedTask.id}-${contributor.user_id}`} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/40 bg-brand-primary/10 text-sm font-semibold text-brand-primary">
                            {formatContributorInitials(contributor.username)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{contributor.username}</p>
                            <p className="text-xs text-white/60">
                              {contributor.role ?? 'Contributeur'}
                              {contributor.claimed_at
                                ? ` · depuis ${new Date(contributor.claimed_at).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short'
                                  })}`
                                : ''}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-white/60">
                    Aucun membre n&apos;a encore revendiqué cette mission. Soyez le premier à l&apos;embarquer !
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-white/60">
                  {selectedTask.max_contributors
                    ? `${selectedTask.max_contributors} places disponibles`
                    : 'Contributeurs multiples autorisés'}
                </div>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    {hasUserClaimed ? (
                      <Button
                        type="button"
                        className="border border-brand-primary/40 bg-transparent px-6 text-[0.6rem] uppercase tracking-[0.35em] text-brand-primary transition-transform hover:scale-[1.02] hover:bg-brand-primary hover:text-brand-dark"
                        disabled={isClaimActionLoading}
                        onClick={handleReleaseTask}
                      >
                        {isClaimActionLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <BookmarkCheck className="mr-2 h-4 w-4" />
                        )}
                        Je me retire de la mission
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="border border-brand-primary bg-brand-primary px-6 text-[0.6rem] uppercase tracking-[0.35em] text-brand-dark transition-transform hover:scale-[1.02]"
                        disabled={isClaimActionLoading}
                        onClick={handleClaimTask}
                      >
                        {isClaimActionLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <BookmarkPlus className="mr-2 h-4 w-4" />
                        )}
                        Rejoindre cette mission
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white/70">
                    Connectez-vous pour revendiquer cette mission.
                    <Link href="/login" className="ml-2 text-brand-primary underline">
                      Se connecter
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
