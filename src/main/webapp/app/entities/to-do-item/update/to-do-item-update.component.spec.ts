import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ToDoItemFormService } from './to-do-item-form.service';
import { ToDoItemService } from '../service/to-do-item.service';
import { IToDoItem } from '../to-do-item.model';
import { IDiaryPage } from 'app/entities/diary-page/diary-page.model';
import { DiaryPageService } from 'app/entities/diary-page/service/diary-page.service';

import { ToDoItemUpdateComponent } from './to-do-item-update.component';

describe('ToDoItem Management Update Component', () => {
  let comp: ToDoItemUpdateComponent;
  let fixture: ComponentFixture<ToDoItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let toDoItemFormService: ToDoItemFormService;
  let toDoItemService: ToDoItemService;
  let diaryPageService: DiaryPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ToDoItemUpdateComponent],
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
      .overrideTemplate(ToDoItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ToDoItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    toDoItemFormService = TestBed.inject(ToDoItemFormService);
    toDoItemService = TestBed.inject(ToDoItemService);
    diaryPageService = TestBed.inject(DiaryPageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call DiaryPage query and add missing value', () => {
      const toDoItem: IToDoItem = { id: 456 };
      const diaryPage: IDiaryPage = { id: 27292 };
      toDoItem.diaryPage = diaryPage;

      const diaryPageCollection: IDiaryPage[] = [{ id: 45166 }];
      jest.spyOn(diaryPageService, 'query').mockReturnValue(of(new HttpResponse({ body: diaryPageCollection })));
      const additionalDiaryPages = [diaryPage];
      const expectedCollection: IDiaryPage[] = [...additionalDiaryPages, ...diaryPageCollection];
      jest.spyOn(diaryPageService, 'addDiaryPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      expect(diaryPageService.query).toHaveBeenCalled();
      expect(diaryPageService.addDiaryPageToCollectionIfMissing).toHaveBeenCalledWith(
        diaryPageCollection,
        ...additionalDiaryPages.map(expect.objectContaining)
      );
      expect(comp.diaryPagesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const toDoItem: IToDoItem = { id: 456 };
      const diaryPage: IDiaryPage = { id: 75271 };
      toDoItem.diaryPage = diaryPage;

      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      expect(comp.diaryPagesSharedCollection).toContain(diaryPage);
      expect(comp.toDoItem).toEqual(toDoItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IToDoItem>>();
      const toDoItem = { id: 123 };
      jest.spyOn(toDoItemFormService, 'getToDoItem').mockReturnValue(toDoItem);
      jest.spyOn(toDoItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: toDoItem }));
      saveSubject.complete();

      // THEN
      expect(toDoItemFormService.getToDoItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(toDoItemService.update).toHaveBeenCalledWith(expect.objectContaining(toDoItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IToDoItem>>();
      const toDoItem = { id: 123 };
      jest.spyOn(toDoItemFormService, 'getToDoItem').mockReturnValue({ id: null });
      jest.spyOn(toDoItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ toDoItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: toDoItem }));
      saveSubject.complete();

      // THEN
      expect(toDoItemFormService.getToDoItem).toHaveBeenCalled();
      expect(toDoItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IToDoItem>>();
      const toDoItem = { id: 123 };
      jest.spyOn(toDoItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(toDoItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDiaryPage', () => {
      it('Should forward to diaryPageService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(diaryPageService, 'compareDiaryPage');
        comp.compareDiaryPage(entity, entity2);
        expect(diaryPageService.compareDiaryPage).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
