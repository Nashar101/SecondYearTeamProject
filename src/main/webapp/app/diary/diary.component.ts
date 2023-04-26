import { Component, OnInit } from '@angular/core';
import { DiaryPageService } from '../entities/diary-page/service/diary-page.service';
import { IDiaryPage, NewDiaryPage } from '../entities/diary-page/diary-page.model';
@Component({
  selector: 'jhi-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
