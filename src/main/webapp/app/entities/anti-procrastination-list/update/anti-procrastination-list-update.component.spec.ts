import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AntiProcrastinationListFormService } from './anti-procrastination-list-form.service';
import { AntiProcrastinationListService } from '../service/anti-procrastination-list.service';
import { IAntiProcrastinationList } from '../anti-procrastination-list.model';

import { AntiProcrastinationListUpdateComponent } from './anti-procrastination-list-update.component';

describe('AntiProcrastinationList Management Update Component', () => {
  let comp: AntiProcrastinationListUpdateComponent;
  let fixture: ComponentFixture<AntiProcrastinationListUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let antiProcrastinationListFormService: AntiProcrastinationListFormService;
  let antiProcrastinationListService: AntiProcrastinationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AntiProcrastinationListUpdateComponent],
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
      .overrideTemplate(AntiProcrastinationListUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AntiProcrastinationListUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    antiProcrastinationListFormService = TestBed.inject(AntiProcrastinationListFormService);
    antiProcrastinationListService = TestBed.inject(AntiProcrastinationListService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const antiProcrastinationList: IAntiProcrastinationList = { id: 456 };

      activatedRoute.data = of({ antiProcrastinationList });
      comp.ngOnInit();

      expect(comp.antiProcrastinationList).toEqual(antiProcrastinationList);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAntiProcrastinationList>>();
      const antiProcrastinationList = { id: 123 };
      jest.spyOn(antiProcrastinationListFormService, 'getAntiProcrastinationList').mockReturnValue(antiProcrastinationList);
      jest.spyOn(antiProcrastinationListService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ antiProcrastinationList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: antiProcrastinationList }));
      saveSubject.complete();

      // THEN
      expect(antiProcrastinationListFormService.getAntiProcrastinationList).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(antiProcrastinationListService.update).toHaveBeenCalledWith(expect.objectContaining(antiProcrastinationList));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAntiProcrastinationList>>();
      const antiProcrastinationList = { id: 123 };
      jest.spyOn(antiProcrastinationListFormService, 'getAntiProcrastinationList').mockReturnValue({ id: null });
      jest.spyOn(antiProcrastinationListService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ antiProcrastinationList: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: antiProcrastinationList }));
      saveSubject.complete();

      // THEN
      expect(antiProcrastinationListFormService.getAntiProcrastinationList).toHaveBeenCalled();
      expect(antiProcrastinationListService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAntiProcrastinationList>>();
      const antiProcrastinationList = { id: 123 };
      jest.spyOn(antiProcrastinationListService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ antiProcrastinationList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(antiProcrastinationListService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
