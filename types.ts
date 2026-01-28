
export type UserRole = 'admin' | 'staff' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export enum RegistrationStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  REJECTED = 'Rejected'
}

export enum Season {
  SUMMER_2024 = 'Summer 2024',
  WINTER_2024 = 'Winter 2024',
  SUMMER_2026 = 'Summer 2026',
  WINTER_2026 = 'Winter 2026'
}

export interface Registration {
  id: string;
  childName: string;
  email: string;
  date: string;
  season: Season;
  paymentAmount: number;
  status: RegistrationStatus;
  avatar?: string;
  phone?: string;
}

export interface Camper {
  id: string;
  name: string;
  age: number;
  lastSeason: Season;
  parentName: string;
  parentPhone: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
  healthAlert?: boolean;
}

export interface DashboardStats {
  totalRegistrations: number;
  pendingApprovals: number;
  totalRevenue: number;
  cancellations: number;
}
