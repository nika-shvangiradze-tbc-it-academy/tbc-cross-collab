import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Event {
  id: string;
  date: string;
  title: string;
  status: 'Registered' | 'Waitlisted' | 'Available';
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  description: string;
  registeredCount: number;
  spotsLeft: number;
  totalSpots: number;
  waitlistCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events`);
  }

  async getEventsAsync(): Promise<Event[]> {
    try {
      return await firstValueFrom(this.getEvents());
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/events/${id}`);
  }
}
