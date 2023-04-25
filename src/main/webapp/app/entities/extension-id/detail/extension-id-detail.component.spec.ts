import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExtensionIDDetailComponent } from './extension-id-detail.component';

describe('ExtensionID Management Detail Component', () => {
  let comp: ExtensionIDDetailComponent;
  let fixture: ComponentFixture<ExtensionIDDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtensionIDDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ extensionID: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExtensionIDDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExtensionIDDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load extensionID on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.extensionID).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
