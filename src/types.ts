export type AppView = 'lab' | 'command' | 'users' | 'entities' | 'workshops' | 'analytics' | 'settings' | 'help';

export interface StrategicQuestion {
  id: string;
  section: 'vision' | 'mission' | 'values';
  category: string;
  categoryEn?: string;
  text: string;
  textEn?: string;
  answer?: string;
  rating?: number;
  hasAudio?: boolean;
  hasAttachment?: boolean;
}

export interface SectionProgress {
  category: string;
  answeredCount: number;
  totalCount: number;
  percentage: number;
}

export interface WorkshopParticipant {
  id: string;
  name: string;
  nameEn?: string;
  avatar: string;
  role: string;
  roleEn?: string;
  active: boolean;
  isCurrentUser?: boolean;
}

export interface ValuesStrategy {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  alignment: string;
  alignmentEn?: string;
  priority: 'عالية جداً' | 'عالية' | 'متوسطة';
  priorityEn?: 'Critical' | 'High' | 'Medium';
}

export interface CopilotDraft {
  vision: string;
  mission: string;
  values: string[];
}

export interface ScenarioComparison {
  id: string;
  title: string;
  text: string;
  created_at: string;
}
