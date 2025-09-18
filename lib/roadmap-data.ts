export interface RoadmapItem {
  id: string;
  phase: string;
  title: string;
  status: 'completed' | 'in-progress' | 'planned' | 'future';
  progress: number;
  quarter: string;
  items: string[];
  created_at?: string;
  updated_at?: string;
}

// Données initiales pour l'initialisation de la base de données
export const initialRoadmapItems: RoadmapItem[] = [
  {
    id: '1',
    phase: 'Phase 1',
    title: 'Foundation & Core Systems',
    status: 'completed',
    progress: 100,
    quarter: 'Q1 2024',
    items: [
      'Basic server architecture',
      'Player authentication system',
      'Core game engine integration',
      'Initial UI/UX framework',
      'Database structure setup'
    ]
  },
  {
    id: '2',
    phase: 'Phase 2',
    title: 'Gameplay Mechanics',
    status: 'in-progress',
    progress: 65,
    quarter: 'Q2 2024',
    items: [
      'Ship movement and controls',
      'Resource management system',
      'Basic combat mechanics',
      'Trading system foundation',
      'Player progression system'
    ]
  },
  {
    id: '3',
    phase: 'Phase 3',
    title: 'Multiplayer & Social Features',
    status: 'planned',
    progress: 0,
    quarter: 'Q3 2024',
    items: [
      'Real-time multiplayer integration',
      'Guild/Alliance system',
      'Chat and communication tools',
      'Player-to-player trading',
      'Cooperative missions'
    ]
  },
  {
    id: '4',
    phase: 'Phase 4',
    title: 'Advanced Systems',
    status: 'planned',
    progress: 0,
    quarter: 'Q4 2024',
    items: [
      'Advanced AI systems',
      'Dynamic event system',
      'Crafting and manufacturing',
      'Territory control mechanics',
      'Advanced graphics optimization'
    ]
  },
  {
    id: '5',
    phase: 'Phase 5',
    title: 'Beta Launch',
    status: 'future',
    progress: 0,
    quarter: 'Q1 2025',
    items: [
      'Closed beta testing',
      'Performance optimization',
      'Bug fixes and balancing',
      'Community feedback integration',
      'Open beta preparation'
    ]
  },
  {
    id: '6',
    phase: 'Phase 6',
    title: 'Full Release',
    status: 'future',
    progress: 0,
    quarter: 'Q2 2025',
    items: [
      'Official game launch',
      'Marketing campaign',
      'Community events',
      'Post-launch content updates',
      'Long-term support plan'
    ]
  }
];