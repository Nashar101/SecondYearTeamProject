import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmailDetailComponent } from './email-detail.component';

describe('Email Management Detail Component', () => {
  let comp: EmailDetailComponent;
  let fixture: ComponentFixture<EmailDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ email: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EmailDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EmailDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load email on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.email).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
