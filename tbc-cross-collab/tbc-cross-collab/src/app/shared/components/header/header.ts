import { Component, computed, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthMockService } from '../../../auth/services/auth-mock.service';

export interface User {
  name: string;
  role: string;
  avatar?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  private auth = inject(AuthMockService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  user = signal<User>(this.getUserFromStorage());

  private getUserFromStorage(): User {
    try {
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        return {
          name:
            userData.name ||
            `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
            'User',
          role: userData.status === 'organizer' ? 'Organizer' : 'Employee',
          avatar: userData.avatar,
        };
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }

    return {
      name: 'User',
      role: 'Employee',
    };
  }

  notificationCount = signal(3);

  hasNotifications = computed(() => this.notificationCount() > 0);
  notificationDisplay = computed(() => {
    const count = this.notificationCount();
    return count > 9 ? '9+' : count.toString();
  });

  showProfileDropdown = signal(false);

  navItems = [
    { label: 'Home', route: '/home' },
    { label: 'Browse Events', route: '/browse-events' },
  ];

  onNotificationClick() {
    console.log('Notifications clicked');
  }

  onProfileClick() {
    this.showProfileDropdown.update((value) => !value);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showProfileDropdown.set(false);
    }
  }
}
