import { User, StudyFile, CalendarEvent } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: '0933', // As requested
    role: 'admin',
    fullName: 'System Administrator'
  },
  {
    id: '2',
    username: 'student1',
    password: 'password',
    role: 'student',
    fullName: 'Jane Doe'
  }
];

export const INITIAL_FILES: StudyFile[] = [
  {
    id: '101',
    name: 'Calculus_Syllabus.pdf',
    category: 'Reference',
    uploadDate: new Date().toISOString(),
    size: '245 KB',
    url: '#',
    type: 'application/pdf'
  },
  {
    id: '102',
    name: 'Physics_Lab_Report_1.docx',
    category: 'Assignment',
    uploadDate: new Date(Date.now() - 86400000).toISOString(),
    size: '1.2 MB',
    url: '#',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '201',
    title: 'Linear Algebra Exam',
    date: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
    type: 'exam',
    description: 'Final exam for Math 202',
    completed: false
  },
  {
    id: '202',
    title: 'Computer Science 101',
    date: new Date(),
    type: 'class',
    description: 'Lecture Hall B',
    completed: false
  }
];