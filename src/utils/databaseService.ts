
/**
 * Database service for SQLite integration
 * In a real implementation, this would connect to a SQLite database.
 * For this demo, we're simulating the database with localStorage.
 */

export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // In a real app, this would be hashed
}

export interface WooCommerceSettings {
  user_id: number;
  site_url: string;
  consumer_key: string;
  consumer_secret: string;
}

export interface ImportLog {
  id: number;
  user_id: number;
  import_date: string;
  total_products: number;
  successful_imports: number;
  failed_imports: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errors: string[];
}

// User Methods
export const createUser = (username: string, email: string, password: string): User => {
  // In a real app, password would be hashed here
  const users = getUsers();
  const newUser: User = {
    id: Date.now(),
    username,
    email,
    password
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};

export const getUsers = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  return storedUsers ? JSON.parse(storedUsers) : [];
};

export const getUserByUsername = (username: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.username === username);
};

export const getUserById = (id: number): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

// WooCommerce Settings Methods
export const saveWooCommerceSettings = (settings: WooCommerceSettings): void => {
  const allSettings = getWooCommerceSettings();
  const existingIndex = allSettings.findIndex(s => s.user_id === settings.user_id);
  
  if (existingIndex >= 0) {
    allSettings[existingIndex] = settings;
  } else {
    allSettings.push(settings);
  }
  
  localStorage.setItem('woocommerce_settings', JSON.stringify(allSettings));
};

export const getWooCommerceSettings = (): WooCommerceSettings[] => {
  const storedSettings = localStorage.getItem('woocommerce_settings');
  return storedSettings ? JSON.parse(storedSettings) : [];
};

export const getWooCommerceSettingsByUserId = (userId: number): WooCommerceSettings | undefined => {
  const allSettings = getWooCommerceSettings();
  return allSettings.find(settings => settings.user_id === userId);
};

// Import Logs Methods
export const createImportLog = (log: Omit<ImportLog, 'id'>): ImportLog => {
  const logs = getImportLogs();
  const newLog: ImportLog = {
    ...log,
    id: Date.now()
  };
  
  logs.push(newLog);
  localStorage.setItem('import_logs', JSON.stringify(logs));
  return newLog;
};

export const updateImportLog = (log: ImportLog): void => {
  const logs = getImportLogs();
  const index = logs.findIndex(l => l.id === log.id);
  
  if (index >= 0) {
    logs[index] = log;
    localStorage.setItem('import_logs', JSON.stringify(logs));
  }
};

export const getImportLogs = (): ImportLog[] => {
  const storedLogs = localStorage.getItem('import_logs');
  return storedLogs ? JSON.parse(storedLogs) : [];
};

export const getImportLogsByUserId = (userId: number): ImportLog[] => {
  const logs = getImportLogs();
  return logs.filter(log => log.user_id === userId);
};

export const getImportLogById = (id: number): ImportLog | undefined => {
  const logs = getImportLogs();
  return logs.find(log => log.id === id);
};
