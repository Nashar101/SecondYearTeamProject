import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AntiProcrastinationComponent } from './anti-procrastination.component';
import { of } from 'rxjs';
import { AntiProcrastinationListDetailComponent } from '../entities/anti-procrastination-list/detail/anti-procrastination-list-detail.component';
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
