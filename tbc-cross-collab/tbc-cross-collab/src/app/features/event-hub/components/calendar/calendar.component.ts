import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../services/events.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  @Input() events: Event[] = [];

  currentMonth = signal<Date>(new Date());
  selectedDate: Date = new Date();

  constructor() {}

  ngOnInit() {
    this.selectedDate = new Date(this.currentMonth());
  }

  getEventsForDate(date: Date): Event[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.events.filter((event) => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  goToToday() {
    const today = new Date();
    this.currentMonth.set(today);
    this.selectedDate = today;
  }

  goToPreviousMonth() {
    const current = new Date(this.currentMonth());
    current.setMonth(current.getMonth() - 1);
    this.currentMonth.set(current);
    this.selectedDate = new Date(current);
  }

  goToNextMonth() {
    const current = new Date(this.currentMonth());
    current.setMonth(current.getMonth() + 1);
    this.currentMonth.set(current);
    this.selectedDate = new Date(current);
  }

  getMonthYearString(): string {
    return this.currentMonth().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  getEventColor(event: Event): string {
    const colors: Record<string, string> = {
      'Team Building': 'dark',
      Workshop: 'dark',
      Workshops: 'dark',
      'Tech Talk': 'dark',
      'Game Night': 'light',
      Sports: 'light',
      Cultural: 'light',
      Wellness: 'light',
      'Happy Friday': 'light',
    };
    return colors[event.category] || 'dark';
  }

  getCalendarWeeks(): Date[][] {
    const month = this.currentMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(year, monthIndex, 1);

    const lastDay = new Date(year, monthIndex + 1, 0);

    const firstDayOfWeek = firstDay.getDay();

    const daysInMonth = lastDay.getDate();

    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      currentWeek.push(new Date(year, monthIndex - 1, prevMonthLastDay - i));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(new Date(year, monthIndex, day));
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }

    let nextMonthDay = 1;
    while (currentWeek.length < 7) {
      currentWeek.push(new Date(year, monthIndex + 1, nextMonthDay));
      nextMonthDay++;
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }

  openFullCalendar() {
    const calendarElement = document.querySelector('.calendar-section');
    if (calendarElement) {
      calendarElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
