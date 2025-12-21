import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Header } from '../../shared/components/header/header';
import { EventsService, Event } from './services/events.service';

@Component({
  selector: 'app-event-hub',
  standalone: true,
  imports: [CommonModule, ButtonModule, Header],
  templateUrl: './event-hub.html',
  styleUrl: './event-hub.scss',
})
export class EventHub implements OnInit {
  private eventsService = inject(EventsService);

  events = signal<Event[]>([]);
  allEvents = signal<Event[]>([]);
  loading = signal(true);
  userName = signal('Sarah');
  selectedCategory = signal<string | null>(null);

  async ngOnInit() {
    await this.loadEvents();
    this.loadUserName();
  }

  async loadEvents() {
    this.loading.set(true);
    try {
      const events = await this.eventsService.getEventsAsync();
      this.allEvents.set(events);
      this.events.set(events);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      this.loading.set(false);
    }
  }

  loadUserName() {
    try {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        const firstName = userData.firstName || userData.name?.split(' ')[0] || 'Sarah';
        this.userName.set(firstName);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  }

  formatDate(dateString: string): { month: string; day: string } {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate().toString();
    return { month, day };
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getRegistrationInfo(event: Event): string {
    if (event.status === 'Waitlisted') {
      return `Full (${event.waitlistCount} on waitlist)`;
    }
    return `${event.spotsLeft} spots left`;
  }

  getCategories(): Array<{ name: string; count: number; icon: string }> {
    const categoryMap = new Map<string, number>();

    this.allEvents().forEach((event) => {
      const category = event.category;
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const categoryIcons: Record<string, string> = {
      'Team Building': '👥',
      Sports: '🏀',
      Workshops: '💼',
      Workshop: '💼',
      'Happy Friday': '🥂',
      Cultural: '🌍',
      Wellness: '❤️',
    };

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        icon: categoryIcons[name] || '📅',
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  selectCategory(category: string | null) {
    this.selectedCategory.set(category);
    this.filterEvents();
  }

  filterEvents() {
    const category = this.selectedCategory();
    const allEvents = this.allEvents();

    if (!category) {
      this.events.set(allEvents);
    } else {
      const filtered = allEvents.filter((event) => event.category === category);
      this.events.set(filtered);
    }
  }
}
