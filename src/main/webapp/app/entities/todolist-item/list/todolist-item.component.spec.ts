import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TodolistItemService } from '../service/todolist-item.service';

import { TodolistItemComponent } from './todolist-item.component';

describe('TodolistItem Management Component', () => {
  let comp: TodolistItemComponent;
  let fixture: ComponentFixture<TodolistItemComponent>;
  let service: TodolistItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'todolist-item', component: TodolistItemComponent }]), HttpClientTestingModule],
      declarations: [TodolistItemComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(TodolistItemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TodolistItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TodolistItemService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.todolistItems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to todolistItemService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTodolistItemIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTodolistItemIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
