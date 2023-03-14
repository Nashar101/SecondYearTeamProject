import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AntiProcrastinationFormService } from './anti-procrastination-form.service';
import { AntiProcrastinationService } from '../service/anti-procrastination.service';
import { IAntiProcrastination } from '../anti-procrastination.model';

import { AntiProcrastinationUpdateComponent } from './anti-procrastination-update.component';

describe('AntiProcrastination Management Update Component', () => {
  let comp: AntiProcrastinationUpdateComponent;
  let fixture: ComponentFixture<AntiProcrastinationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let antiProcrastinationFormService: AntiProcrastinationFormService;
  let antiProcrastinationService: AntiProcrastinationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AntiProcrastinationUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AntiProcrastinationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AntiProcrastinationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    antiProcrastinationFormService = TestBed.inject(AntiProcrastinationFormService);
    antiProcrastinationService = TestBed.inject(AntiProcrastinationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const antiProcrastination: IAntiProcrastination = { id: 456 };

      activatedRoute.data = of({ antiProcrastination });
      comp.ngOnInit();

      expect(comp.antiProcrastination).toEqual(antiProcrastination);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAntiProcrastination>>();
      const antiProcrastination = { id: 123 };
      jest.spyOn(antiProcrastinationFormService, 'getAntiProcrastination').mockReturnValue(antiProcrastination);
      jest.spyOn(antiProcrastinationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ antiProcrastination });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: antiProcrastination }));
      saveSubject.complete();

      // THEN
      expect(antiProcrastinationFormService.getAntiProcrastination).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(antiProcrastinationService.update).toHaveBeenCalledWith(expect.objectContaining(antiProcrastination));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAntiProcrastination>>();
      const antiProcrastination = { id: 123 };
      jest.spyOn(antiProcrastinationFormService, 'getAntiProcrastination').mockReturnValue({ id: null });
      jest.spyOn(antiProcrastinationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ antiProcrastination: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: antiProcrastination }));
      saveSubject.complete();

      // THEN
      expect(antiProcrastinationFormService.getAntiProcrastination).toHaveBeenCalled();
      expect(antiProcrastinationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAntiProcrastination>>();
      const antiProcrastination = { id: 123 };
      jest.spyOn(antiProcrastinationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ antiProcrastination });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(antiProcrastinationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
