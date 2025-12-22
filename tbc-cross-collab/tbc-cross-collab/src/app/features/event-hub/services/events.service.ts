import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface BackendEvent {
  id: number;
  title: string;
  description: string;
  eventTypeName: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  capacity: number;
  confirmedCount: number;
  waitlistedCount: number;
  isFull: boolean;
  tags: string[];
  createdBy: string;
}

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

  private mapBackendToEvent(event: BackendEvent): Event {
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);

    const formattedStartTime = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    const formattedEndTime = endDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    const totalSpots = event.capacity;
    const registeredCount = event.confirmedCount;
    const spotsLeft = Math.max(totalSpots - registeredCount, 0);

    let status: Event['status'] = 'Available';
    if (event.isFull && event.waitlistedCount > 0) {
      status = 'Waitlisted';
    } else if (event.isFull) {
      status = 'Registered';
    }

    return {
      id: event.id.toString(),
      date: event.startDateTime,
      title: event.title,
      status,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      location: event.location,
      category: event.eventTypeName,
      description: event.description,
      registeredCount,
      spotsLeft,
      totalSpots,
      waitlistCount: event.waitlistedCount,
    };
  }

  getEvents(): Observable<Event[]> {
    return this.http
      .get<BackendEvent[]>(`${this.apiUrl}/events`)
      .pipe(map((events) => events.map((e) => this.mapBackendToEvent(e))));
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
    return this.http
      .get<BackendEvent>(`${this.apiUrl}/events/${id}`)
      .pipe(map((event) => this.mapBackendToEvent(event)));
  }
}
