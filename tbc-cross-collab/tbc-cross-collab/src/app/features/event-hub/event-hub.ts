import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-event-hub',
  standalone: true,
  imports: [ButtonModule, Header],
  templateUrl: './event-hub.html',
  styleUrl: './event-hub.scss',
})
export class EventHub {}
