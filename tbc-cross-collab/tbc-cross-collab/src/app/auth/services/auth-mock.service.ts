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

export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
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

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  async login(
    payload: SignInPayload
  ): Promise<{ success: boolean; token?: string; error?: string }> {
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

      return { success: true, token };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Connection error. Please check if json-server is running.' };
    }
  }
}
