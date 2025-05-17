import { User } from '@/lib/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { openDB } from 'idb';

const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Alice Wonderland',
    email: 'alice@example.com',
    role: 'Manager',
    metrics: {
      tasksCompleted: 25,
      avgCompletionTime: '1h 45m',
      productivityScore: 88,
      activeProjects: 3,
      overdueTasks: 1,
    },
  },
  {
    id: '2',
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'Manager',
    metrics: {
      tasksCompleted: 30,
      avgCompletionTime: '1h 30m',
      productivityScore: 95,
      activeProjects: 4,
      overdueTasks: 0,
    },
  },
  {
    id: '3',
    name: 'Bob The Builder',
    email: 'bob@example.com',
    role: 'Contributor',
    metrics: {
      tasksCompleted: 42,
      avgCompletionTime: '2h 10m',
      productivityScore: 92,
      activeProjects: 5,
      overdueTasks: 0,
    },
  },
  {
    id: '4',
    name: 'Edward Scissorhands',
    email: 'edward@example.com',
    role: 'Contributor',
    metrics: {
      tasksCompleted: 35,
      avgCompletionTime: '2h 00m',
      productivityScore: 85,
      activeProjects: 3,
      overdueTasks: 2,
    },
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'Analyst',
    metrics: {
      tasksCompleted: 15,
      avgCompletionTime: '3h 00m',
      productivityScore: 75,
      activeProjects: 2,
      overdueTasks: 3,
    },
  },
];

const DB_NAME = 'userPerformanceDB';
const STORE_NAME = 'users';

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

async function loadUsersFromDB(): Promise<User[]> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const allUsers = await store.getAll();
  await tx.done;
  return allUsers.length ? allUsers : INITIAL_USERS;
}

async function saveUsersToDB(users: User[]) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.clear();
  for (const user of users) {
    await store.put(user);
  }
  await tx.done;
}

interface UserStore {
  users: User[];
  load: () => Promise<void>;
  addUser: (user: User) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      load: async () => {
        const users = await loadUsersFromDB();
        set({ users });
        if (users === INITIAL_USERS) {
          await saveUsersToDB(INITIAL_USERS);
        }
      },
      addUser: async (user) => {
        const users = [...get().users, user];
        set({ users });
        await saveUsersToDB(users);
      },
      updateUser: async (user) => {
        const users = get().users.map((u) => (u.id === user.id ? user : u));
        set({ users });
        await saveUsersToDB(users);
      },
      deleteUser: async (id) => {
        const users = get().users.filter((u) => u.id !== id);
        set({ users });
        await saveUsersToDB(users);
      },
    }),
    {
      name: 'user-store',
    }
  )
); 