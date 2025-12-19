import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventHub } from './event-hub';

describe('EventHub', () => {
  let component: EventHub;
  let fixture: ComponentFixture<EventHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventHub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
