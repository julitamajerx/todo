import { Task } from './shared/models/task-model';

export const sample_tasks: Task[] = [
  {
    id: 1,
    name: 'Kup mleko',
    description: 'Kupić mleko w pobliskim sklepie',
    dueDate: new Date('2025-12-05T10:00:00'),
    isCompleted: false,
  },
  {
    id: 2,
    name: 'Zrobić pranie',
    description: 'Wrzucić ubrania do pralki i zrobić pranie',
    dueDate: new Date('2025-12-04T18:00:00'),
    isCompleted: false,
  },
  {
    id: 3,
    name: 'Spotkanie z zespołem',
    description: 'Omówić nowe funkcje projektu',
    dueDate: new Date('2025-12-06T14:00:00'),
    isCompleted: false,
  },
  {
    id: 4,
    name: 'Przeczytać książkę',
    description: "Przeczytać rozdział 5 książki 'TypeScript Basics'",
    dueDate: new Date('2025-12-07T20:00:00'),
    isCompleted: false,
  },
  {
    id: 5,
    name: 'Wyjście na spacer',
    description: 'Wyjść na 30-minutowy spacer po obiedzie',
    dueDate: new Date('2025-12-03T17:00:00'),
    isCompleted: false,
  },
];
