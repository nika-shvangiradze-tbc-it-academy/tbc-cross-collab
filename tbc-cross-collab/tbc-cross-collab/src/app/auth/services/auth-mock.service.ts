import { Injectable, inject, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export const API_CONFIG = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl,
});

export interface SignInPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
  status?: 'employee' | 'organizer';
}

@Injectable({
  providedIn: 'root',
})
export class AuthMockService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_CONFIG);
  private readonly TOKEN_KEY = 'auth_token';

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  async login(
    payload: SignInPayload
  ): Promise<{ success: boolean; token?: string; error?: string; user?: User }> {
    try {
      const users = await firstValueFrom(
        this.http.get<User[]>(`${this.apiUrl}/users?email=${encodeURIComponent(payload.email)}`)
      );

      if (users.length === 0) {
        return { success: false, error: 'Invalid email or password' };
      }

      const user = users[0];

      if (user.password !== payload.password) {
        return { success: false, error: 'Invalid email or password' };
      }

      const token = `token_${user.id}_${Date.now()}`;

      this.setToken(token);

      // Store user data in localStorage for easy access
      localStorage.setItem('user_data', JSON.stringify(user));

      return { success: true, token, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Connection error. Please check if json-server is running.' };
    }
  }

  async register(
    payload: SignUpPayload
  ): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      if (payload.password !== payload.confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      const existingUsers = await firstValueFrom(
        this.http.get<User[]>(`${this.apiUrl}/users?email=${encodeURIComponent(payload.email)}`)
      );

      if (existingUsers.length > 0) {
        return { success: false, error: 'User with this email already exists' };
      }

      const newUser: Omit<User, 'id'> = {
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        department: payload.department,
        name: `${payload.firstName} ${payload.lastName}`,
        status: 'employee',
      };

      const createdUser = await firstValueFrom(
        this.http.post<User>(`${this.apiUrl}/users`, newUser)
      );

      return { success: true, userId: createdUser.id.toString() };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Connection error. Please check if json-server is running.' };
    }
  }

  async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!payload.email) {
        return { success: false, error: 'Email is required' };
      }

      const users = await firstValueFrom(
        this.http.get<User[]>(`${this.apiUrl}/users?email=${encodeURIComponent(payload.email)}`)
      );

      if (users.length === 0) {
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'Connection error. Please check if json-server is running.' };
    }
  }
}
