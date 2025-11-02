// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Auth Related Types
export interface Role {
  id: string;
  name: string;
  displayName: string;
}

export interface Employee {
  firstName: string;
  lastName: string;
  department: string;
  jobTitle: string;
}

export interface User {
  id: string;
  email: string;
  employeeId: string;
  employee: Employee;
  roles: Role[];
  permissions: string[];
  isActive: boolean;
  mfaEnabled: boolean;
  mustChangePassword: boolean;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthData {
  user: User;
  tokens: Tokens;
}

export interface LoginResponse extends ApiResponse<AuthData> {}

// Auth State Types
export interface AuthUser {
  id: string;
  email: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  department: string;
  jobTitle: string;
  isActive: boolean;
  mfaEnabled: boolean;
  mustChangePassword: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: Role[];
  permissions: string[];
}

// Redux Store Types (imported from store/index.ts)
// export interface RootState {
//   auth: AuthState;
// }

// Login/Register Form Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
