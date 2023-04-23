import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExtensionIDFormService } from './extension-id-form.service';
import { ExtensionIDService } from '../service/extension-id.service';
import { IExtensionID } from '../extension-id.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ExtensionIDUpdateComponent } from './extension-id-update.component';

describe('ExtensionID Management Update Component', () => {
  let comp: ExtensionIDUpdateComponent;
  let fixture: ComponentFixture<ExtensionIDUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let extensionIDFormService: ExtensionIDFormService;
  let extensionIDService: ExtensionIDService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExtensionIDUpdateComponent],
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
      .overrideTemplate(ExtensionIDUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExtensionIDUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    extensionIDFormService = TestBed.inject(ExtensionIDFormService);
    extensionIDService = TestBed.inject(ExtensionIDService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const extensionID: IExtensionID = { id: 456 };
      const user: IUser = { id: 25568 };
      extensionID.user = user;

      const userCollection: IUser[] = [{ id: 88712 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ extensionID });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const extensionID: IExtensionID = { id: 456 };
      const user: IUser = { id: 19026 };
      extensionID.user = user;

      activatedRoute.data = of({ extensionID });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.extensionID).toEqual(extensionID);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExtensionID>>();
      const extensionID = { id: 123 };
      jest.spyOn(extensionIDFormService, 'getExtensionID').mockReturnValue(extensionID);
      jest.spyOn(extensionIDService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ extensionID });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: extensionID }));
      saveSubject.complete();

      // THEN
      expect(extensionIDFormService.getExtensionID).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(extensionIDService.update).toHaveBeenCalledWith(expect.objectContaining(extensionID));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExtensionID>>();
      const extensionID = { id: 123 };
      jest.spyOn(extensionIDFormService, 'getExtensionID').mockReturnValue({ id: null });
      jest.spyOn(extensionIDService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ extensionID: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: extensionID }));
      saveSubject.complete();

      // THEN
      expect(extensionIDFormService.getExtensionID).toHaveBeenCalled();
      expect(extensionIDService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExtensionID>>();
      const extensionID = { id: 123 };
      jest.spyOn(extensionIDService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ extensionID });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(extensionIDService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
