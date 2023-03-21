import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDiaryPage } from '../diary-page.model';
import { DiaryPageService } from '../service/diary-page.service';

@Injectable({ providedIn: 'root' })
export class DiaryPageRoutingResolveService implements Resolve<IDiaryPage | null> {
  constructor(protected service: DiaryPageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDiaryPage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((diaryPage: HttpResponse<IDiaryPage>) => {
          if (diaryPage.body) {
            return of(diaryPage.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
