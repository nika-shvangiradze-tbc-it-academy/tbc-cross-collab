import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthMockService, SignInPayload } from '../../services/auth-mock.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.scss'],
})
export class SignInComponent {
  private auth = inject(AuthMockService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: SignInPayload = {
    email: '',
    password: '',
    rememberMe: false,
  };

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  canSubmit = computed(() => !this.loading());

  async onSubmit() {
    this.error.set(null);
    this.success.set(false);
    this.loading.set(true);
    try {
      const res = await this.auth.login(this.form);
      if (!res.success) {
        this.error.set(res.error ?? 'Something went wrong');
      } else {
        this.success.set(true);
        console.log('Logged in with token', res.token);

        if (res.token) {
          localStorage.setItem('auth_token', res.token);
        }

        // Redirect based on user status
        const returnUrl =
          this.route.snapshot.queryParams['returnUrl'] ||
          (res.user?.status === 'organizer' ? '/features/event-management' : '/features/event-hub');
        setTimeout(() => {
          this.router.navigate([returnUrl]);
        }, 500);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
