import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  IAntiProcrastinationList,
  NewAntiProcrastinationList,
} from '../entities/anti-procrastination-list/anti-procrastination-list.model';
import { AntiProcrastinationListService } from '../entities/anti-procrastination-list/service/anti-procrastination-list.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayjs from 'dayjs';

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

//trackId = (_index: number, item: IAntiProcrastinationList): number => this.AntiProcrastinationListService.getTodolistItemIdentifier(item);

@Component({
  selector: 'jhi-anti-procrastination',
  templateUrl: './anti-procrastination.component.html',
  styleUrls: ['./anti-procrastination.component.scss'],
})
export class AntiProcrastinationComponent implements OnInit {
  constructor(protected antiProcrastinationListService: AntiProcrastinationListService) {}

  ngOnInit(): void {
    this.loadAll();
  }
  todos: List[] = [];

  loadAll(): void {
    this.antiProcrastinationListService.query().subscribe(response => {
      const items = response.body || [];
      this.listItems = items;
      for (let i = 0; i < items.length; i++) {
        let site = new List();
        //@ts-ignore
        site.id = this.listItems[i].id;
        //@ts-ignore
        site.link = this.listItems[i].link;
        //@ts-ignore
        site.type = this.listItems[i].type;
        //@ts-ignore
        site.days = this.listItems[i].days;
        //@ts-ignore
        site.hours = this.listItems[i].hours;
        //@ts-ignore
        site.minutes = this.listItems[i].minutes;
        //@ts-ignore
        site.seconds = this.listItems[i].seconds;
        //@ts-ignore
        site.idk = this.listItems[i].idk;
        //@ts-ignore
        site.idk1 = this.listItems[i].idk1;
        //@ts-ignore
        site.empty = this.listItems[i].empty;
        //@ts-ignore
        site.dueDate = new Date(this.listItems[i].dueDate);
        console.log(site.link);
        this.todos.push(site);
        console.log(this.todos.length);
        if (site.type == 'Timed') {
          this.refreshTimer(i);
          this.startTimer2(this.todos.length - 1);
        }
        site = new List();
      }
      console.log(this.todos[0].dueDate.toDateString());
      console.log(this.todos[1].link);
    });
  }

  listItems?: IAntiProcrastinationList[];

  newTodo: string = '';
  type: string = '';
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  empty: string = '';
  start: number = 0;
  end: number = 0;
  extensionID: string = '';
  extensionID2: string = '';
  working: string = '';

  newItem: IAntiProcrastinationList | null = null;

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
      this.add(todo.link);
    } else {
      alert('Please enter a List item');
    }
  }
  interval1: number = 0;
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
        this.todos.splice(number1, 1);
        return;
      }
    }, 1000);
  }
  refreshTimer(link: number): void {
    let currentDate = new Date().getTime();
    let savedDate = this.todos[link].dueDate.getTime();
    let timeRemaining = (savedDate - currentDate) / 1000;
    if (timeRemaining <= 0) {
      this.delete(this.todos[link].id);
    } else {
      let Days = Math.floor(timeRemaining / 86400);
      let Hours = Math.floor((timeRemaining - Days * 24 * 60 * 60) / 3600);
      let Minutes = Math.floor((timeRemaining - Days * 24 * 60 * 60 - Hours * 60 * 60) / 60);
      let Seconds = Math.floor((timeRemaining - Days * 24 * 60 * 60 - Hours * 60 * 60 - Minutes * 60) / 1);
      this.todos[link].days = Days;
      this.todos[link].hours = Hours;
      this.todos[link].minutes = Minutes;
      this.todos[link].seconds = Seconds;
    }
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
    const newItem: NewAntiProcrastinationList = {
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
    };
    this.antiProcrastinationListService.create(newItem).subscribe();
    this.antiProcrastinationListService.query().subscribe(response => {
      const items = response.body || [];
      this.listItems = items;
      this.todos[this.listItems.length - 1].id = this.listItems[this.listItems.length - 1].id;
    });
    //this.todos[this.todos.length-1].id =
  }

  delete(id: number) {
    this.antiProcrastinationListService.delete(id).subscribe();
  }
  remove(id: number) {
    const response = confirm('Are you sure you want to do that?');

    if (response) {
      this.delete(this.todos[id].id);
      this.Listdelete(this.todos[id].link);
      this.todos = this.todos.filter((v, i) => i !== id);
      alert('The Block has been removed');
    } else {
      alert('The action was cancelled');
    }
  }

  setExtensionID() {
    if (this.extensionID.length != 32) {
      alert('invalid ID code');
      this.extensionID = '';
      return;
    }
    if (this.extensionID2 == '') {
      this.working = 'Extension ID has been added';
      this.extensionID2 = this.extensionID;
      this.extensionID = '';
      for (let i = 0; i < this.todos.length; i++) {
        this.add(this.todos[i].link);
      }
    } else {
      this.extensionID2 = this.extensionID;
      this.extensionID = '';
      this.working = 'Extension has been changed';
    }
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

  add(URL: string) {
    chrome.runtime.sendMessage(this.extensionID2, { openUrlInEditor: URL }, function (response) {
      if (!response.success) console.log('an error occurred');
      console.log('this should work');
    });
  }
  Listdelete(URL: string) {
    chrome.runtime.sendMessage(this.extensionID2, { delete: URL }, function (response) {
      if (!response.success) console.log('an error occurred');
      console.log('this should work');
    });
  }
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
