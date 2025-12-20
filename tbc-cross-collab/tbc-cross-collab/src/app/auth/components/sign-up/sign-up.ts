import { Component, computed, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthMockService, SignUpPayload } from '../../services/auth-mock.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss'],
})
export class SignUp implements OnDestroy {
  private auth = inject(AuthMockService);
  private router = inject(Router);

  form: SignUpPayload = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    password: '',
    confirmPassword: '',
  };

  agreeToTerms = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  showOtpSection = signal(false);
  otpCode = signal<string[]>(['', '', '', '', '', '']);
  otpTimer = signal(300);
  otpTimerInterval: any = null;

  departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'Support'];

  canSubmit = computed(() => !this.loading() && this.agreeToTerms() && !this.error());

  sendOtp() {
    if (!this.form.phone || this.form.phone.trim() === '') {
      this.error.set('Please enter a phone number first.');
      return;
    }

    this.showOtpSection.set(true);
    this.otpCode.set(['', '', '', '', '', '']);
    this.otpTimer.set(300);

    if (this.otpTimerInterval) {
      clearInterval(this.otpTimerInterval);
    }
    this.otpTimerInterval = setInterval(() => {
      const current = this.otpTimer();
      if (current > 0) {
        this.otpTimer.set(current - 1);
      } else {
        if (this.otpTimerInterval) {
          clearInterval(this.otpTimerInterval);
        }
      }
    }, 1000);
  }

  generateOtp() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeArray = code.split('');
    this.otpCode.set(codeArray);
  }

  onOtpInputClick() {
    this.generateOtp();
  }

  formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  resendOtp() {
    this.sendOtp();
  }

  ngOnDestroy() {
    if (this.otpTimerInterval) {
      clearInterval(this.otpTimerInterval);
    }
  }

  async onSubmit() {
    if (!this.agreeToTerms()) {
      this.error.set('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    this.error.set(null);
    this.success.set(false);
    this.loading.set(true);
    try {
      const res = await this.auth.register(this.form);
      if (!res.success) {
        this.error.set(res.error ?? 'Something went wrong');
      } else {
        this.success.set(true);
        console.log('Registered user', res.userId);

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
