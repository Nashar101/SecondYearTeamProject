import { Component, OnInit } from '@angular/core';
import {
  IAntiprocrastinationListTwo,
  NewAntiprocrastinationListTwo,
} from '../entities/antiprocrastination-list-two/antiprocrastination-list-two.model';
import { AntiprocrastinationListTwoService } from '../entities/antiprocrastination-list-two/service/antiprocrastination-list-two.service';
import { ExtensionIDService } from '../entities/extension-id/service/extension-id.service';
import { AccountService } from '../core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';
import { IExtensionID } from '../entities/extension-id/extension-id.model';

export class List {
  id!: number;
  link!: string;
  type!: string;
  days!: number;
  hours!: number;
  minutes!: number;
  seconds!: number;
  empty!: string;
  idk!: string;
  idk1!: string;
  dueDate!: Date;
}

@Component({
  selector: 'jhi-anti-procrastination',
  templateUrl: './anti-procrastination.component.html',
  styleUrls: ['./anti-procrastination.component.scss'],
})
export class AntiProcrastinationComponent implements OnInit {
  constructor(
    protected antiProcrastinationListService2: AntiprocrastinationListTwoService,
    protected extensionIDService: ExtensionIDService,

    private accountService: AccountService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getExtensionID();
    console.log(this.extensionID2);
    this.loadAll();
  }
  // List used to display data on the website
  todos: List[] = [];
  //link extension ID
  exID: number = 0;
  //chrome extensionID
  extensionID: string = '';
  extensionID2: string = '';
  //use these lists below to store the data obtained from the link and Chrome extension ID database
  listItems?: IAntiprocrastinationListTwo[];
  idlist?: IExtensionID[];

  //get data from database
  getExtensionID() {
    this.http.get<any>('/api/account').subscribe(account => {
      const userID = account.id;
      this.extensionIDService.query().subscribe(response => {
        this.idlist = response.body || [];
        this.idlist = this.idlist.filter(id => id.user?.id === userID);
        //@ts-ignore
        this.extensionID2 = this.idlist[0].extensionID;
        console.log(this.extensionID2);
        this.exID = this.idlist[0].id;
      });
    });
  }

  //get data from database
  loadAll(): void {
    this.http.get<any>('/api/account').subscribe(account => {
      const userID = account.id;
      console.log(userID);
      this.antiProcrastinationListService2.query().subscribe(response => {
        const items = response.body || [];
        this.listItems = items;
        this.listItems = this.listItems.filter(list => list.user?.id === userID);
        //@ts-ignore
        this.getExtensionID();

        //this.setExtensionID();
        for (let i = 0; i < items.length; i++) {
          let site = new List();
          //@ts-ignore
          site.id = this.listItems[i].id;
          //@ts-ignore
          site.link = this.listItems[i].link;
          //@ts-ignore
          site.type = this.listItems[i].type;
          //@ts-ignore
          site.dueDate = new Date(this.listItems[i].dueDate);
          if (site.type === 'Timed') {
            const currentDate = new Date().getTime();

            const savedDate = new Date(site.dueDate).getTime();
            const time = (savedDate - currentDate) / 1000;
            if (time <= 0) {
              this.delete(site.id);
            } else {
              site.days = Math.floor(time / 86400);
              site.hours = Math.floor((time - site.days * 24 * 60 * 60) / 3600);
              site.minutes = Math.floor((time - site.days * 24 * 60 * 60 - site.hours * 60 * 60) / 60);
              site.seconds = Math.floor((time - site.days * 24 * 60 * 60 - site.hours * 60 * 60 - site.minutes * 60) / 1);
              //@ts-ignore
              site.idk = this.listItems[i].idk;
              //@ts-ignore
              site.idk1 = this.listItems[i].idk1;
              //@ts-ignore
              site.empty = this.listItems[i].empty;
              this.todos.push(site);
              this.startTimer2(i);
              this.add(site.link, site.dueDate);
            }
          } else {
            //@ts-ignore
            site.idk = this.listItems[i].idk;
            //@ts-ignore
            site.idk1 = this.listItems[i].idk1;
            //@ts-ignore
            site.empty = this.listItems[i].empty;
            console.log(site.link);
            console.log(site.dueDate);
            this.todos.push(site);
            //this.add(site.link, site.dueDate);
            console.log(this.todos.length);
            console.log('this is permanent else');
            this.permaAdd(site.link);
          }
          site = new List();
        }
      });
    });
    if (this.todos.length === 0) {
      this.isEmpty();
    }
  }
  isEmpty() {
    chrome.runtime.sendMessage(this.extensionID2, { empty: 'empty' }, function (response) {
      if (!response.success) console.log('an error occurred');
    });
  }
  //use these to display the List item values in the HTML website
  newTodo: string = '';
  type: string = '';
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  empty: string = '';
  start: number = 0;
  end: number = 0;

  working: string = '';
  //add new Anti Procrastination list item
  saveTodo() {
    var element = <HTMLInputElement>document.getElementById('Permanent?');
    var isChecked = element.checked;
    if (this.extensionID2 == '') {
      alert('you are currently not connected to the extension');
      return;
    }
    if (this.days == 0 && this.hours == 0 && this.minutes == 0 && this.seconds == 0 && !isChecked) {
      alert('All timer values cannot be zero');
    } else if (!this.isValidURL(this.newTodo)) {
      alert('This is not a valid URL, please try again');
      this.newTodo = '';
    } else if (this.newTodo) {
      let todo = new List();
      todo.link = this.trim3(this.newTodo);
      if (isChecked) {
        todo.type = 'Permanent';
        todo.empty = '--';
        todo.idk = '';
        todo.idk1 = ':';
      } else {
        todo.type = 'Timed';
        todo.idk = ':';
        todo.idk1 = '';
        todo.days = this.days;
        todo.hours = this.hours;
        todo.minutes = this.minutes;
        todo.seconds = this.seconds;
      }
      let dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + todo.days);
      dueDate.setHours(dueDate.getHours() + todo.hours);
      dueDate.setMinutes(dueDate.getMinutes() + todo.minutes);
      dueDate.setSeconds(dueDate.getSeconds() + todo.seconds);
      todo.dueDate = dueDate;
      this.todos.push(todo);
      this.setAll(todo.link, todo.type, todo.days, todo.hours, todo.minutes, todo.seconds, todo.idk, todo.idk1, todo.empty, todo.dueDate);
      //this.SaveNewItem();
      this.newTodo = '';
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.startTimer2(this.todos.length - 1);
      if (todo.type === 'Timed') {
        this.add(todo.link, todo.dueDate);
      } else {
        this.permaAdd(todo.link);
      }
    } else {
      alert('Please enter a List item');
    }
  }

  interval1: number = 0;
  //timer used to decrease the time left values of each item
  startTimer2(number1: number) {
    this.interval1 = setInterval(() => {
      if (this.todos[number1].seconds > -1) {
        this.todos[number1].seconds--;
      }
      if (this.todos[number1].seconds == -1 && this.todos[number1].minutes >= 0) {
        this.todos[number1].seconds = 59;
        this.todos[number1].minutes--;
      }
      if (this.todos[number1].minutes == -1 && this.todos[number1].hours >= 0) {
        this.todos[number1].minutes = 59;
        this.todos[number1].hours--;
      }
      if (this.todos[number1].hours == -1 && this.todos[number1].days >= 0) {
        this.todos[number1].hours = 24;
        this.todos[number1].days--;
      }
      if (
        this.todos[number1].days <= 0 &&
        this.todos[number1].hours <= 0 &&
        this.todos[number1].minutes <= 0 &&
        this.todos[number1].seconds <= 0
      ) {
        this.delete(this.todos[number1].id);
        chrome.runtime.sendMessage(this.extensionID2, { delete: this.todos[number1].link, remove: number1 }, function (response) {
          if (!response.success) console.log('an error occurred');
          console.log('this should work');
        });
        //this.Listdelete(this.todos[number1].link, number1);
        this.todos.splice(number1, 1);
        if (this.todos.length === 0) {
          this.isEmpty();
        }
        return;
      }
    }, 1000);
  }

  setAll(
    link: string,
    type: string,
    day: number,
    hours: number,
    minutes: number,
    seconds: number,
    idk: string,
    idk1: string,
    empty: string,
    dueDate: Date
  ): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        console.log(account.login);
        this.http.get<any>('/api/account').subscribe(account => {
          const userId = account.id;
          const newItem: NewAntiprocrastinationListTwo = {
            link: link,
            days: day,
            type: type,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            idk: idk,
            idk1: idk1,
            empty: empty,
            //@ts-ignore
            dueDate: dayjs(dueDate),
            user: { id: userId, login: account.login },
          };
          this.antiProcrastinationListService2.create(newItem).subscribe();
          this.antiProcrastinationListService2.query().subscribe(response => {
            const items = response.body || [];
            this.listItems = items;
            this.todos[this.todos.length - 1].id = this.listItems[this.listItems.length - 1].id;
          });
        });
      }
    });
  }
  //remove link from database after timer hits 0
  delete(id: number) {
    this.antiProcrastinationListService2.delete(id).subscribe();
  }
  //remove data from database on request
  remove(id: number) {
    const response = confirm('Are you sure you want to do that?');

    if (response) {
      this.delete(this.todos[id].id);
      if (this.todos[id].type == 'Timed') {
        chrome.runtime.sendMessage(this.extensionID2, { delete: this.todos[id].link, remove: id }, function (answer) {
          if (!answer.success) console.log('an error occurred');
          console.log('this should work');
        });
      } else {
        chrome.runtime.sendMessage(this.extensionID2, { Permdelete: this.todos[id].link, remove: id }, function (answer) {
          if (!answer.success) console.log('an error occurred');
          console.log('this should work');
        });
      }
      //this.Listdelete(this.todos[id].link, id);
      this.todos = this.todos.filter((v, i) => i !== id);
      alert('The Block has been removed');
    } else {
      alert('The action was cancelled');
    }
  }
  //set Chrome extension ID on startup
  setExtensionID() {
    let previous = this.extensionID2;
    if (this.extensionID.length != 32) {
      alert('invalid ID code');
      this.extensionID = '';
      return;
    }
    if (this.extensionID2 == '') {
      this.working = 'Extension ID has been added';
      this.extensionID2 = this.extensionID;
      this.extensionID = '';
    } else {
      this.extensionID2 = this.extensionID;
      this.extensionID = '';
      this.working = 'Extension has been changed';
    }
    this.extensionIDService.query().subscribe(response => {
      this.idlist = response.body || [];
      this.idlist = this.idlist.filter(list => list.extensionID === previous);

      console.log('this is current exID' + previous);
      this.idlist[0].extensionID = this.extensionID2;
      //items.filter(item => item.extensionID === previous)[0].extensionID = this.extensionID2;
      //items[0].extensionID = this.extensionID2;
      //pohlkppdmfbfiikihamgkahfingcilld
      console.log('this is new exID' + this.idlist[0].extensionID);
      this.extensionIDService.update(this.idlist[0]).subscribe();
    });
    this.clear10();
  }

  clear10() {
    let j = 3;
    setInterval(() => {
      j--;
      if (j == 0) {
        this.working = '';
        return;
      }
    }, 1000);
  }

  add(URL: string, Time: Date) {
    chrome.runtime.sendMessage(this.extensionID2, { openUrlInEditor: URL, displayTimeRemaining: Time }, function (response) {
      if (!response.success) console.log('an error occurred');
      console.log('this should work');
    });
  }

  permaAdd(URL: string) {
    chrome.runtime.sendMessage(this.extensionID2, { addPermanent: URL }, function (response) {
      if (!response.success) console.log('an error occurred');
      console.log('this should work');
    });
  }

  /**Listdelete(URL: string, position: number) {
    chrome.runtime.sendMessage(this.extensionID2, { delete: URL, remove: position }, function (response) {
      if (!response.success) console.log('an error occurred');
      console.log('this should work');
    });
  }**/

  isValidURL(URL: string) {
    var inputElement = document.createElement('input');
    inputElement.type = 'url';
    inputElement.value = URL;
    return inputElement.checkValidity();
  }

  trim3(URL: string) {
    let amount = 0;
    let start = 0;
    let end = 0;
    let string = URL;
    console.log(string);
    for (let k = 0; k < string.length; k++) {
      if (string[k] == '/') {
        amount++;
        if (amount == 2) {
          start = k + 1;
        }
        if (amount == 3) {
          end = k;
          break;
        }
      }
      if (k == string.length - 1) {
        end = k;
      }
    }
    console.log(string.substring(start, end));
    return string.substring(start, end);
  }
}
