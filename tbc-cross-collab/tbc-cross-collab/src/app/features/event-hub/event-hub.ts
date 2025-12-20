import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-event-hub',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './event-hub.html',
  styleUrl: './event-hub.scss',
})
export class EventHub {}
