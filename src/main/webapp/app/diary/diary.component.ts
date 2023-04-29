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
          let title = '';
          //@ts-ignore
          title = this.diaryitems[i].pageDescription;
          const splitedcontent = title.split(' : ', 2);
          site.name = splitedcontent[0];
          //@ts-ignore
          site.content = title.substring(site.name.length + 3, title.length);
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
    if (this.name === '' || this.content === '') {
      alert('please fill in the required fields');
      return;
    }
    let tempstorage = new dList();
    tempstorage.name = this.name;
    tempstorage.content = this.content;
    this.store.push(tempstorage);
    tempstorage.name = this.name + ' : ' + this.content;
    this.name = '';
    this.content = '';
    this.add(this.store.length - 1);
  }

  add(number: number) {
    this.takeid = 0;

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
          this.http.get<any>('/api/account').subscribe(account => {
            const userID = account.id;
            this.diaryPage.query().subscribe(response => {
              const items = response.body || [];
              this.diaryitems = items;
              this.store[this.store.length - 1].id = this.diaryitems[this.diaryitems.length - 1].id;
            });
          });
        });
      }
    });
  }

  //when you click on a list item, display its contents
  display(clicked: number) {
    //let title = this.store[clicked].name;
    //const splitedcontent = title.split(" : ", 2)
    this.name = this.store[clicked].name;

    this.content = this.store[clicked].content;
    this.takeid = this.store[clicked].id;
    console.log(this.takeid);
  }

  takeid: number = 0;

  delete() {
    this.diaryPage.delete(this.takeid).subscribe();
    this.store = [];
    this.init();
    console.log('this is the takeid i deleted' + this.takeid);
    this.name = '';
    this.content = '';
    this.takeid = 0;
  }

  modify() {
    if (this.name === '' || this.content === '') {
      alert('please fill in the required fields');
      return;
    }
    //this function takes the user specific diary items from the database, we will need this to edit Diary item.
    this.http.get<any>('/api/account').subscribe(account => {
      const userID = account.id;
      console.log(userID);
      this.diaryPage.query().subscribe(response => {
        const items = response.body || [];
        console.log(userID);
        this.diaryitems = items;
        this.diaryitems = this.diaryitems.filter(list => list.user?.id === userID);
        this.diaryitems = this.diaryitems.filter(list => list.id === this.takeid);
        console.log('hello this is takeid' + this.takeid);
        console.log('THIS IS THE TEXT WE WANT TO MODIFY' + this.diaryitems[0].pageDescription);
        this.takeid = 0;
        this.diaryitems[0].pageDescription = this.name + ' : ' + this.content;
        //@ts-ignore
        this.diaryitems[0].lastEditTime = new Date();

        this.diaryPage.update(this.diaryitems[0]).subscribe();
        this.store = [];
        this.init();

        this.name = '';
        this.content = '';
      });
    });
    /*
    this.diaryPage.update(this.content).subscribe(() => {
    });
    *
     */
  }
}
