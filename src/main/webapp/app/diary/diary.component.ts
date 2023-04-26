import { Component, OnInit } from '@angular/core';
import { DiaryPageService } from '../entities/diary-page/service/diary-page.service';
import { IDiaryPage, NewDiaryPage } from '../entities/diary-page/diary-page.model';
import dayjs from 'dayjs';
import { AccountService } from '../core/auth/account.service';
import { HttpClient } from '@angular/common/http';

export class dList {
  //@ts-ignore
  id: number;
  //@ts-ignore
  name: string;
  //@ts-ignore
  content: string;
  //@ts-ignore
  created: Date;
  //@ts-ignore
  edited: Date;
}

@Component({
  selector: 'jhi-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent implements OnInit {
  constructor(protected diaryPage: DiaryPageService, private http: HttpClient, private accountService: AccountService) {}

  //@ts-ignore
  name: string = '';
  //@ts-ignore
  content: string = '';
  diaryitems?: IDiaryPage[];
  init() {
    this.http.get<any>('/api/account').subscribe(account => {
      const userID = account.id;
      console.log(userID);
      this.diaryPage.query().subscribe(response => {
        const items = response.body || [];
        console.log(userID);
        this.diaryitems = items;
        //this.diaryitems = items
        this.diaryitems = this.diaryitems.filter(list => list.user?.id === userID);
        //@ts-ignore

        //this.setExtensionID();
        for (let i = 0; i < items.length; i++) {
          let site = new dList();
          //@ts-ignore
          site.id = this.diaryitems[i].id;
          console.log(site.id);
          //@ts-ignore
          site.name = this.diaryitems[i].pageDescription;
          //@ts-ignore
          site.content = this.diaryitems[i].pageDescription;
          //@ts-ignore
          site.created = new Date(this.diaryitems[i].creationTime);
          //@ts-ignore
          site.edited = new Date(this.diaryitems[i].lastEditTime);

          this.store.push(site);

          site = new dList();
        }
      });
    });
  }
  //this stores all diary items
  store: dList[] = [];

  ngOnInit(): void {
    this.init();
  }
  diaryAdd() {
    let tempstorage = new dList();
    tempstorage.name = this.name;
    tempstorage.content = this.content;
    this.store.push(tempstorage);

    this.name = '';
    this.content = '';
    this.add(this.store.length - 1);
  }

  add(number: number) {
    this.accountService.identity().subscribe(account => {
      if (account) {
        console.log(account.login);
        this.http.get<any>('/api/account').subscribe(account => {
          const userId = account.id;
          const newItem: NewDiaryPage = {
            //@ts-ignore
            pageDate: new Date(),
            pageDescription: this.store[number].name,
            //@ts-ignore
            creationTime: new Date(),
            //@ts-ignore
            lastEditTime: dayjs(new Date()),
            user: { id: userId, login: account.login },
          };
          this.diaryPage.create(newItem).subscribe();
          this.diaryPage.query().subscribe(response => {
            const items = response.body || [];
            this.diaryitems = items.filter(v => v.user?.id === userId);
            this.store[this.store.length - 1].id = this.diaryitems[this.diaryitems.length - 1].id;
          });
        });
      }
    });
  }
  //when you click on a list item, display its contents
  display(clicked: number) {
    this.name = this.store[clicked].name;
    this.content = this.store[clicked].content;
  }
}
