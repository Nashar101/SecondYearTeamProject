import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DPIAFormComponent } from './dpia-form.component';

describe('DPIAFormComponent', () => {
  let component: DPIAFormComponent;
  let fixture: ComponentFixture<DPIAFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DPIAFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DPIAFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
