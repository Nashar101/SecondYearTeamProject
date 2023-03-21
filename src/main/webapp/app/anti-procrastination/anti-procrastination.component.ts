import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  IAntiProcrastinationList,
  NewAntiProcrastinationList,
} from '../entities/anti-procrastination-list/anti-procrastination-list.model';
import { AntiProcrastinationListService } from '../entities/anti-procrastination-list/service/anti-procrastination-list.service';
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
        site.link = this.trim(this.listItems[i].link);
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
        this.startTimer2(this.todos.length - 1);
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

  newItem: IAntiProcrastinationList | null = null;

  saveTodo() {
    var element = <HTMLInputElement>document.getElementById('Permanent?');
    var isChecked = element.checked;
    if (this.days == 0 && this.hours == 0 && this.minutes == 0 && this.seconds == 0 && !isChecked) {
      alert('All timer values cannot be zero');
    } else if (!this.isValidURL(this.newTodo)) {
      alert('This is not a valid URL, please try again');
      this.newTodo = '';
    } else if (this.newTodo) {
      let todo = new List();

      /**for(let k = 0; k < this.newTodo.length; k++){
        if(this.newTodo[k] == '/'){
          this.amount++;
          if(this.amount == 2){
            this.start = k+1;
          }
          if(this.amount == 3){
            this.end =k;
            break;
          }
        }
        if (k == this.newTodo.length-1){
          this.end = k;
        }
      }**/
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
      if (this.todos[number1].seconds <= 0) {
        this.delete(this.todos[number1].id);
        this.todos.splice(number1, 1);
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
    const newItem: NewAntiProcrastinationList = {
      link: link,
      days: day,
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

  /**setLink(link: string){
      if(this.selectedItem){
        this.selectedItem.link = link
      }
  }
  setDays(days: number){
    if(this.selectedItem){
        this.selectedItem.days = days
    }
  }

  setHours(hours: number){
    if(this.selectedItem){
        this.selectedItem.hours = hours
    }
  }

  setMinutes(minutes: number){
    if(this.selectedItem){
        this.selectedItem.minutes = minutes
    }
  }

  setSeconds(seconds: number){
    if(this.selectedItem){
      this.selectedItem.seconds = seconds
    }
  }
  setidk(idk: string){
    if(this.selectedItem){
      this.selectedItem.idk = idk
    }
  }

  setidk1(idk1: string){
    if(this.selectedItem){
      this.selectedItem.idk1 = idk1
    }
  }

  setEmpty(empty: string){
    if(this.selectedItem){
      this.selectedItem.empty = empty
    }
  }

  setDate(Date: Date){
    if(this.selectedItem){
      //@ts-ignore
      this.selectedItem.dueDate = dayjs(Date);
    }
  }**/

  add(URL: string) {
    let editorExtensionId = 'hfelemebfjbhhpnfbpngfpgnbfepakbp';
    chrome.runtime.sendMessage(editorExtensionId, { openUrlInEditor: URL }, function (response) {
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
