import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TodolistItemDetailComponent } from './todolist-item-detail.component';

describe('TodolistItem Management Detail Component', () => {
  let comp: TodolistItemDetailComponent;
  let fixture: ComponentFixture<TodolistItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodolistItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ todolistItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TodolistItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TodolistItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load todolistItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.todolistItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
