import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntiProcrastinationComponent } from './anti-procrastination.component';

describe('AntiProcrastinationComponent', () => {
  let component: AntiProcrastinationComponent;
  let fixture: ComponentFixture<AntiProcrastinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AntiProcrastinationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AntiProcrastinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
