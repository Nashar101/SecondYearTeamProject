import { Component, Input, OnInit } from '@angular/core';
//import { UserService } from '../entities/user/user.service';
//import { AccountService } from '../core/auth/account.service';
//import { Subject } from 'rxjs';

export class List {
  link!: string;
  type!: string;
  days!: number;
  hours!: number;
  minutes!: number;
  seconds!: number;
  empty!: string;
  idk!: string;
  idk1!: string;
}

export interface Timespan {
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'jhi-anti-procrastination',
  templateUrl: './anti-procrastination.component.html',
  styleUrls: ['./anti-procrastination.component.scss'],
})
export class AntiProcrastinationComponent implements OnInit {
  constructor() {}

  todos: List[] = [];
  newTodo: string = '';
  type: string = '';
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  empty: string = '';

  saveTodo() {
    var element = <HTMLInputElement>document.getElementById('Permanent?');
    var isChecked = element.checked;
    if (this.days == 0 && this.hours == 0 && this.minutes == 0 && this.seconds == 0 && !isChecked) {
      alert('all timer values cannot be zero');
    } else if (this.newTodo) {
      let todo = new List();
      todo.link = this.newTodo;
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
      this.todos.push(todo);
      this.newTodo = '';
      this.startTimer2(this.todos.length - 1);
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
        this.todos[number1].days == 0 &&
        this.todos[number1].hours == 0 &&
        this.todos[number1].minutes == 0 &&
        this.todos[number1].seconds == -1
      ) {
        this.todos.splice(number1, 1);
      }
    }, 1000);
  }
  ngOnInit(): void {}
}