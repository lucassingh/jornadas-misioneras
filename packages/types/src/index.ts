// Enums
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// Base entity types
export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  id: number;
  name: string;
  createdAt: Date;
}

export interface Province {
  id: number;
  name: string;
  countryId: number;
  country?: Country;
}

export interface Location {
  id: number;
  name: string;
  provinceId: number;
  province?: Province;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  locationId: number;
  location?: Location;
  countryId: number;
  country?: Country;
  provinceId: number;
  province?: Province;
  createdBy: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

// DTO types for API requests/responses
export interface CreateEventDTO {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  locationId: number;
  countryId: number;
  provinceId: number;
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {}

export interface CreateCountryDTO {
  name: string;
}

export interface CreateProvinceDTO {
  name: string;
  countryId: number;
}

export interface CreateLocationDTO {
  name: string;
  provinceId: number;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth types
export interface AuthUser {
  clerkId: string;
  email: string;
  role: Role;
}
