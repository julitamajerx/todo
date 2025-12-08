export const sample_lists: any[] = [
  { name: "Lista Testowa 2", isPinned: true },
  { name: "Lista Testowa", isPinned: true },
];

export const sample_tags: any[] = [
  { emoji: "🛒", name: "Zakupy" },
  { emoji: "📚", name: "Nauka" },
  { emoji: "💼", name: "Praca" },
  { emoji: "🏃", name: "Zdrowie" },
];

export const sample_tasks: any[] = [
  {
    name: "Kup mleko",
    description: "Kupić mleko w pobliskim sklepie",
    dueDate: new Date("2025-12-08T10:00:00"),
    isCompleted: false,
    isDeleted: false,
    list: 1,
  },
  {
    name: "Zrobić pranie",
    description: "Wrzucić ubrania do pralki i zrobić pranie",
    dueDate: new Date("2025-12-04T18:00:00"),
    isCompleted: false,
    isDeleted: false,
    tags: [3],
    list: 0,
  },
  {
    name: "Spotkanie z zespołem",
    description: "Omówić nowe funkcje projektu",
    dueDate: new Date("2025-12-06T14:00:00"),
    isCompleted: false,
    isDeleted: false,
    tags: [2, 1],
  },
  {
    name: "Przeczytać książkę",
    description: "Przeczytać rozdział 5 książki 'TypeScript Basics'",
    dueDate: new Date("2025-12-10T20:00:00"),
    isCompleted: false,
    isDeleted: false,
    tags: [1, 3],
  },
  {
    name: "Wyjście na spacer",
    description: "Wyjść na 30-minutowy spacer po obiedzie",
    dueDate: new Date("2025-12-03T17:00:00"),
    isCompleted: false,
    isDeleted: false,
    tags: [3, 0],
    list: 0,
  },
  {
    name: "Usunięte zadanie",
    description: "To zadanie zostało usunięte",
    dueDate: new Date("2025-12-02T12:00:00"),
    isCompleted: false,
    isDeleted: true,
    tags: [2],
  },
  {
    name: "Zadanie ukończone",
    description: "To zadanie zostało ukończone",
    dueDate: new Date("2025-12-01T09:00:00"),
    isCompleted: true,
    isDeleted: false,
    tags: [1, 0],
  },
  {
    name: "Week test",
    description: "Wyjść na 30-minutowy spacer po obiedzie",
    dueDate: new Date("2025-12-07T17:00:00"),
    isCompleted: false,
    isDeleted: false,
    tags: [3, 2, 1],
  },
];
