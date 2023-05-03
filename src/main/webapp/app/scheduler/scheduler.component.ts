import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ScheduleEventService } from '../entities/schedule-event/service/schedule-event.service';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { IScheduleEvent, NewScheduleEvent } from '../entities/schedule-event/schedule-event.model';
import moment from 'moment';
import { AccountService } from '../core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs/esm';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class DateService {
  getCurrentTime(): Date {
    return new Date();
  }
}
interface Interface {
  title: string;
  description: string;
  time: string;
}
@NgModule({
  imports: [FormsModule],
})
export class List {
  title!: string;
  description!: string;
  time!: string;
}

@Component({
  selector: 'jhi-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
export class SchedulerComponent implements OnInit {
  /**
   addScheduleBtn.addEventListener("click", () => {
  scheduleForm.style.display = "block";
});
   **/
  day: string = '';
  // Create an object with properties for each day of the week
  Arrayforschedules: { [day: string]: Interface[] } = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };
  // Create a new schedule object
  newschedule = {
    title: '',
    description: '',
    time: '',
  };

  Arrayforliveschedules: Interface[] = [];

  updateLiveSchedules() {
    // Get the current time
    const currentTime = moment();

    // Loop through each day in the Arrayforschedules object
    for (const day in this.Arrayforschedules) {
      if (this.Arrayforschedules.hasOwnProperty(day)) {
        // Loop through each schedule in the current day's array
        for (const schedule of this.Arrayforschedules[day]) {
          // Parse the start and end times for the current schedule
          const [startTime, endTime] = schedule.time.split(' - ');
          const startMoment = moment(`${day} ${startTime}`, 'DD-MM-YYYY HH:mm:ss');
          const endMoment = moment(`${day} ${endTime}`, 'HH:mm:ss');
          // Check if the current time is within the start and end times for the current schedule
          if (currentTime.isBetween(startMoment, endMoment, null, '[]')) {
            // Check if the current schedule is already in the Arrayforliveschedules array
            if (!this.Arrayforliveschedules.includes(schedule)) {
              // Add the current schedule to the Arrayforliveschedules array
              this.Arrayforliveschedules.push(schedule);
            }
          } else {
            // Remove the current schedule from the Arrayforliveschedules array (if it is there)
            const index = this.Arrayforliveschedules.indexOf(schedule);
            if (index !== -1) {
              this.Arrayforliveschedules.splice(index, 1);
            }
          }
        }
      }
    }
  }

  ngOnInit(): void {
    // Retrieve the schedule events from the backend
    this.scheduleEventService.query().subscribe(res => {
      if (res.body) {
        // Populate the scheduleList array with the retrieved data
        this.scheduleList = res.body;
        // Loop through the scheduleList array and populate the Arrayforschedules array
        this.scheduleList.forEach(schedule => {
          const selectedDate = schedule.date?.toDate();
          const selectedDay = selectedDate?.toLocaleDateString('en-GB', { weekday: 'long' });
          const startTime = schedule.startTime?.toDate();
          const endTime = schedule.endTime?.toDate();
          if (selectedDay && startTime && endTime && schedule.heading && schedule.details) {
            this.Arrayforschedules[selectedDay].push({
              title: schedule.heading,
              description: schedule.details,
              time: `${moment(startTime).format('DD-MM-YYYY HH:mm:ss')} - ${moment(endTime).format('HH:mm:ss')}`,
            });
          }
        });
      }
    });
    //  this.init();
    setInterval(() => {
      this.updateLiveSchedules();
    }, 1000);
    document.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        // Perform action on enter key press
        // For example, you can add code to perform the add function when enter key is pressed on the Add Schedule button
        const addButton = document.getElementById('add-schedule-btn');
        if (document.activeElement === addButton) {
          this.open();
        }
      }
      if (event.key === 'Escape') {
        // Perform action on escape key press
        // For example, you can add code to close the add schedule form when escape key is pressed
        this.close();
      }
    });
  }

  open() {
    const scheduleForm = document.getElementById('schedule-form') as HTMLDivElement;
    scheduleForm.style.display = 'block';
  }

  close() {
    const scheduleForm = document.getElementById('schedule-form') as HTMLDivElement;
    scheduleForm.style.display = 'none';
    const focus = document.getElementById('add-schedule-btn');
    if (focus) {
      focus.focus();
    }
  }

  scheduleList: IScheduleEvent[] = [];

  add() {
    if (!this.newschedule.title || !this.newschedule.description || !this.newschedule.time || !this.day) {
      alert('Please fill in all of the input fields.');
      return;
    }

    const selectedDate = moment(this.newschedule.time, 'DD-MM-YYYY').toDate();
    const selectedDay = selectedDate.toLocaleDateString('en-GB', { weekday: 'long' });
    if (selectedDay !== this.day) {
      alert('The date you entered does not match that day of the week.');
      return;
    }
    const startTime = moment(this.newschedule.time, 'DD-MM-YYYY HH:mm:ss').toDate();
    const endTime = moment(`${this.newschedule.time.slice(0, 10)} ${this.newschedule.time.slice(20)}`, 'DD-MM-YYYY HH:mm:ss').toDate();
    const newSchedule: NewScheduleEvent = {
      heading: this.newschedule.title,
      details: this.newschedule.description,
      startTime: dayjs(startTime),
      endTime: dayjs(endTime),
      date: dayjs(selectedDate),
      id: null,
    };

    this.scheduleEventService.create(newSchedule).subscribe(response => {
      const newScheduleEvent = response.body;
      if (newScheduleEvent) {
        this.scheduleList.push(newScheduleEvent);
        console.log(this.scheduleList);
      }
    });
    this.Arrayforschedules[this.day].push({
      title: this.newschedule.title,
      description: this.newschedule.description,
      time: this.newschedule.time,
    });

    this.newschedule.title = '';
    this.newschedule.description = '';
    this.newschedule.time = '';
    this.day = '';
    this.close();

    const focus = document.getElementById('add-schedule-btn');
    if (focus) {
      focus.focus();
    }
  }

  delete(day: string, index: number) {
    if (confirm('Do you want to delete this schedule?')) {
      this.Arrayforschedules[day].splice(index, 1);
    }
    const focus = document.getElementById('add-schedule-btn');
    if (focus) {
      focus.focus();
    }
  }

  edit(day: string, index: number) {
    const schedule = this.Arrayforschedules[day][index];
    const updatedTitle = prompt('Enter new title:', schedule.title);
    const updatedDescription = prompt('Enter new description:', schedule.description);
    if (updatedTitle) {
      this.Arrayforschedules[day][index].title = updatedTitle;
    }
    if (updatedDescription) {
      this.Arrayforschedules[day][index].description = updatedDescription;
    }
  }

  selectedFontSize: string = '16';

  onFontSizeChange() {
    const fontSizeInput = document.querySelector('#font-size-input') as HTMLSelectElement;
    this.selectedFontSize = fontSizeInput.value;
    const scheduleCells = document.querySelectorAll('.schedule-cell');
    for (let i = 0; i < scheduleCells.length; i++) {
      (scheduleCells[i] as HTMLElement).style.fontSize = this.selectedFontSize + 'px';
    }
  }

  decreasesize() {
    const scheduleForm = document.querySelector('.schedule-form-font') as HTMLElement;
    const currentSize = parseInt(getComputedStyle(scheduleForm).fontSize);
    if (scheduleForm.style.fontSize !== '14px') {
      scheduleForm.style.fontSize = currentSize - 1 + 'px';
    }
  }

  increasesize() {
    const scheduleForm = document.querySelector('.schedule-form-font') as HTMLElement;
    const currentSize = parseInt(getComputedStyle(scheduleForm).fontSize);
    if (scheduleForm.style.fontSize !== '21px') {
      scheduleForm.style.fontSize = currentSize + 1 + 'px';
    }
  }

  titlefocus() {
    const focus = document.getElementById('title-input');
    if (focus) {
      focus.focus();
    }
  }

  constructor(protected scheduleEventService: ScheduleEventService, private accountService: AccountService, private http: HttpClient) {}
}
