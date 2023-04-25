import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAlarm, NewAlarm } from '../entities/alarm/alarm.model';
import { AccountService } from 'app/core/auth/account.service';
import { UserService } from 'app/entities/user/user.service';
import { AlarmService } from '../entities/alarm/service/alarm.service';

export class alarmsList {
  id!: number;

  alarmName!: string;

  type!: string;

  hours!: number;

  minutes!: number;

  seconds!: number;

  ticking!: Boolean;
}
export class finishedAlarmsList {
  alarmName!: string;
  type!: string;
  hours!: number;
  minutes!: number;
  seconds!: number;
}
@Component({
  selector: 'jhi-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.scss'],
})
export class AlarmComponent implements OnInit {
  constructor(protected alarmService: AlarmService) {}

  ngOnInit(): void {
    this.loadAll();
  }
  alarms: alarmsList[] = [];

  finishedAlarms: any[] = [];

  interval1: number = 0;

  interval: number = 0;

  alarmUpdate(index: number) {
    this.alarmService.update(this.alarms[index]).subscribe();
  }
  alarmEnd(index: number) {
    this.finishedAlarms.push(this.alarms[index]);
    this.alarmService.delete(this.alarms[index].id).subscribe();
    this.alarms.splice(index, 1);
  }

  finishedAlarmDelete(id: number) {
    for (let i = 0; i < this.finishedAlarms.length; i++) {
      if (this.finishedAlarms[i].id == id) {
        this.finishedAlarms.splice(i, 1);
        break;
      }
    }
  }

  timeTick(aId: number, ticking: Boolean) {
    var alarmIndex = -1;

    // @ts-ignore
    this.interval1 = setInterval(() => {
      for (let i = 0; i < this.alarms.length; i++) {
        if (this.alarms[i].id == aId) {
          alarmIndex = i;
          break;
        }
      }
      ticking = this.alarms[alarmIndex].ticking;
      if (ticking == true && this.alarms[alarmIndex].id == aId) {
        if (this.alarms[alarmIndex].type == 'alarm') {
          if (this.alarms[alarmIndex].seconds > -1) {
            this.alarms[alarmIndex].seconds--;
          }
          if (this.alarms[alarmIndex].seconds == -1 && this.alarms[alarmIndex].minutes >= 0) {
            this.alarms[alarmIndex].seconds = 59;
            this.alarms[alarmIndex].minutes--;
          }
          if (this.alarms[alarmIndex].minutes == -1 && this.alarms[alarmIndex].hours >= 0) {
            this.alarms[alarmIndex].minutes = 59;
            this.alarms[alarmIndex].hours--;
          }
          if (this.alarms[alarmIndex].hours <= 0 && this.alarms[alarmIndex].minutes <= 0 && this.alarms[alarmIndex].seconds <= 0) {
            this.alarmEnd(alarmIndex);
            return;
          }
        } else {
          this.alarms[alarmIndex].seconds++;
          if (this.alarms[alarmIndex].seconds == 60) {
            this.alarms[alarmIndex].seconds = 0;
            this.alarms[alarmIndex].minutes++;
          }
          if (this.alarms[alarmIndex].minutes == 60) {
            this.alarms[alarmIndex].minutes = 0;
            this.alarms[alarmIndex].hours++;
          }
        }
      }
      this.alarmUpdate(alarmIndex);
    }, 1000);
  }

  startTimer(aName: string, ticking: Boolean) {
    var alarmIndex = this.alarms.length - 1;

    // @ts-ignore
    this.interval = setInterval(() => {
      for (let i = 0; i < this.alarms.length; i++) {
        if (this.alarms[i].alarmName == aName) {
          alarmIndex = i;
          break;
        }
      }
      ticking = this.alarms[alarmIndex].ticking;
      if (ticking == true) {
        if (this.alarms[alarmIndex].type == 'alarm') {
          if (this.alarms[alarmIndex].seconds > -1) {
            this.alarms[alarmIndex].seconds--;
          }
          if (this.alarms[alarmIndex].seconds == -1 && this.alarms[alarmIndex].minutes >= 0) {
            this.alarms[alarmIndex].seconds = 59;
            this.alarms[alarmIndex].minutes--;
          }
          if (this.alarms[alarmIndex].minutes == -1 && this.alarms[alarmIndex].hours >= 0) {
            this.alarms[alarmIndex].minutes = 59;
            this.alarms[alarmIndex].hours--;
          }
          if (this.alarms[alarmIndex].hours <= 0 && this.alarms[alarmIndex].minutes <= 0 && this.alarms[alarmIndex].seconds <= 0) {
            this.alarmEnd(alarmIndex);
            return;
          }
        } else {
          this.alarms[alarmIndex].seconds++;
          if (this.alarms[alarmIndex].seconds == 60) {
            this.alarms[alarmIndex].seconds = 0;
            this.alarms[alarmIndex].minutes++;
          }
          if (this.alarms[alarmIndex].minutes == 60) {
            this.alarms[alarmIndex].minutes = 0;
            this.alarms[alarmIndex].hours++;
          }
        }
      }
      this.alarmUpdate(alarmIndex);
    }, 1000);
  }

  loadAll(): void {
    this.alarms = [];
    this.finishedAlarms = [];
    this.alarmService.query().subscribe(response => {
      const items = response.body || [];
      this.listItems = items;
      for (let i = 0; i < items.length; i++) {
        let alarm = new alarmsList();
        //@ts-ignore
        alarm.id = this.listItems[i].id;
        //@ts-ignore
        alarm.alarmName = this.listItems[i].alarmName;
        //@ts-ignore
        alarm.type = this.listItems[i].type;
        //@ts-ignore
        alarm.hours = this.listItems[i].hours;
        //@ts-ignore
        alarm.minutes = this.listItems[i].minutes;
        //@ts-ignore
        alarm.seconds = this.listItems[i].seconds;
        // @ts-ignore
        alarm.ticking = false;
        this.alarms.push(alarm);
        this.timeTick(alarm.id, alarm.ticking);
      }
    });
  }

  listItems?: IAlarm[];

  alarmName: string = '';

  type: string = 'alarm';

  hours: number = 0;

  minutes: number = 0;

  seconds: number = 0;

  isUnique(aName: string) {
    var check = true;
    for (let i = 0; i < this.alarms.length; i++) {
      if (this.alarms[i].alarmName == aName) {
        check = false;
      }
    }
    return check;
  }

  saveAlarm() {
    if (this.alarmName == '') {
      alert('The alarm needs a name');
    } else if (this.isUnique(this.alarmName)) {
      if (this.hours == 0 && this.minutes == 0 && this.seconds == 0 && this.type == 'alarm') {
        alert('There has to be some time assigned to an alarm');
      } else {
        let alarm = new alarmsList();
        alarm.alarmName = this.alarmName;
        alarm.type = this.type;
        alarm.hours = this.hours;
        alarm.minutes = this.minutes;
        alarm.seconds = this.seconds;
        alarm.ticking = false;

        this.setAll(alarm.alarmName, alarm.type, alarm.hours, alarm.minutes, alarm.seconds);
        this.alarmService.query().subscribe();
        this.alarmService.query().subscribe(response => {
          const items = response.body || [];
          this.listItems = items;
          alarm.id = this.listItems[items.length - 1].id;
        });
        this.alarms.push(alarm);
        this.startTimer(alarm.alarmName, alarm.ticking);
      }
    } else {
      alert('Pick a unique alarm name');
    }
  }

  setAll(aName: string, aType: string, aHours: number, aMins: number, aSecs: number): void {
    // @ts-ignore
    const newAlarm: NewAlarm = { alarmName: aName, type: aType, hours: aHours, minutes: aMins, seconds: aSecs };
    this.alarmService.create(newAlarm).subscribe();
  }

  clearAlarms() {
    for (let i = 0; i < this.alarms.length; i++) {
      this.alarmService.delete(this.alarms[i].id).subscribe();
    }
    this.alarms = [];
  }

  deleteAlarm(id: number) {
    for (let i = 0; i < this.alarms.length; i++) {
      if (this.alarms[i].id == id) {
        this.alarmService.delete(this.alarms[i].id).subscribe();
        this.alarms.splice(i, 1);
        break;
      }
    }
  }

  togglePlay(ticking: Boolean, id: number) {
    if (ticking == false) {
      ticking = true;
    } else {
      ticking = false;
    }
    return ticking;
  }
}
