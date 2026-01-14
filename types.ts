export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  username: string;
  password?: string; // In a real app, never store plain text
  role: UserRole;
  fullName: string;
}

export type FileCategory = 'Assignment' | 'Lecture Notes' | 'Reference' | 'Exam Paper';

export interface StudyFile {
  id: string;
  name: string;
  category: FileCategory;
  uploadDate: string;
  size: string;
  url: string; // Blob URL
  type: string;
}

export type EventType = 'class' | 'exam' | 'study';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date; // Keep as date object for easier calendar math
  type: EventType;
  description?: string;
  completed: boolean;
}

export type ViewState = 'login' | 'dashboard' | 'calendar' | 'admin';