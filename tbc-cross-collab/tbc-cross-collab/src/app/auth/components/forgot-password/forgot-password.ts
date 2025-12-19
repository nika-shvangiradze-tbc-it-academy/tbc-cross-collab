import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthMockService, ForgotPasswordPayload } from '../../services/auth-mock.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPasswordComponent {
  private auth = inject(AuthMockService);

  form: ForgotPasswordPayload = {
    email: '',
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
      const res = await this.auth.forgotPassword(this.form);
      if (!res.success) {
        this.error.set(res.error ?? 'Something went wrong');
      } else {
        this.success.set(true);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
