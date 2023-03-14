import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TestingFormService } from './testing-form.service';
import { TestingService } from '../service/testing.service';
import { ITesting } from '../testing.model';

import { TestingUpdateComponent } from './testing-update.component';

describe('Testing Management Update Component', () => {
  let comp: TestingUpdateComponent;
  let fixture: ComponentFixture<TestingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let testingFormService: TestingFormService;
  let testingService: TestingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TestingUpdateComponent],
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
      .overrideTemplate(TestingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TestingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    testingFormService = TestBed.inject(TestingFormService);
    testingService = TestBed.inject(TestingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const testing: ITesting = { id: 456 };

      activatedRoute.data = of({ testing });
      comp.ngOnInit();

      expect(comp.testing).toEqual(testing);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITesting>>();
      const testing = { id: 123 };
      jest.spyOn(testingFormService, 'getTesting').mockReturnValue(testing);
      jest.spyOn(testingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ testing });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: testing }));
      saveSubject.complete();

      // THEN
      expect(testingFormService.getTesting).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(testingService.update).toHaveBeenCalledWith(expect.objectContaining(testing));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITesting>>();
      const testing = { id: 123 };
      jest.spyOn(testingFormService, 'getTesting').mockReturnValue({ id: null });
      jest.spyOn(testingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ testing: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: testing }));
      saveSubject.complete();

      // THEN
      expect(testingFormService.getTesting).toHaveBeenCalled();
      expect(testingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITesting>>();
      const testing = { id: 123 };
      jest.spyOn(testingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ testing });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(testingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
