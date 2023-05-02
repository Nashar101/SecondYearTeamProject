import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import { HistoryTwoService } from '../entities/history-two/service/history-two.service';
import { IHistoryTwo, NewHistoryTwo } from '../entities/history-two/history-two.model';
import { AccountService } from '../core/auth/account.service';
import { HttpClient } from '@angular/common/http';

export class list {
  ID!: number;
  subjectScore: number[] = [];
  subjectTarget: number[] = [];
  upcomingTest: string[] = [];
  upcomingTestTarget: number[] = [];
  subject: string[] = [];
}
@Component({
  selector: 'jhi-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  historyItems?: IHistoryTwo[];
  //@ts-ignore
  newList: list;
  //@ts-ignore
  myChart: Chart;
  init(): void {
    this.http.get<any>('/api/account').subscribe(account => {
      const userID = account.id;
      console.log('this is admin id' + userID);
      this.historyListService.query().subscribe(response => {
        this.historyItems = response.body || [];
        this.historyItems = this.historyItems.filter(list => list.user?.id === userID);
        let historyList = new list();
        for (let i = 0; i < this.historyItems.length; i++) {
          //@ts-ignore
          historyList.subject[i] = this.historyItems[i].subject;
          //@ts-ignore
          historyList.subjectScore[i] = this.historyItems[i].subjectScore;
          //@ts-ignore
          historyList.subjectTarget[i] = this.historyItems[i].subjectTarget;
          //@ts-ignore
          historyList.upcomingTest[i] = this.historyItems[i].upcomingTest;
          //@ts-ignore
          historyList.upcomingTestTarget[i] = this.historyItems[i].upcomingTestTarget;
        }
        this.newList = historyList;
        console.log('this is list length' + this.newList.subject.length);
        if (this.newList.subject.length !== 0) {
          console.log('list not empty, printing chart');
          this.myChart = new Chart('myChart', {
            type: 'line',
            data: {
              labels: this.newList.subject,
              datasets: [
                {
                  label: 'Test Grades',
                  data: this.newList.subjectScore,
                  borderWidth: 4,
                  borderColor: '#C20505',
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  border: {
                    color: '#F5F5F5',
                  },
                  grid: {
                    color: '#FAF8F8',
                  },
                  ticks: {
                    color: '#A8A8A8',
                  },
                },
                x: {
                  border: {
                    color: '#FAF8F8',
                  },
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: '#A8A8A8',
                  },
                },
              },
            },
          });
        }
      });
    });
  }

  upcomingFunc(): void {}

  newSubject: string = '';
  //@ts-ignore
  score: number;

  //@ts-ignore
  target: number;
  constructor(private accountService: AccountService, private http: HttpClient, protected historyListService: HistoryTwoService) {}
  add(): void {
    if (this.newSubject === '') {
      return;
    } else if (this.target === 0 || this.target == null) {
      this.accountService.identity().subscribe(account => {
        if (account) {
          console.log(account.login);
          this.http.get<any>('/api/account').subscribe(account => {
            const userId = account.id;
            //@ts-ignore
            const newItem: NewHistoryTwo = {
              subject: this.newSubject,
              subjectScore: this.score,
              subjectTarget: 0,
              upcomingTest: '',
              upcomingTestTarget: 0,
              user: { id: userId, login: account.login },
            };
            this.historyListService.create(newItem).subscribe();
            //this.newList.subject.push(this.newSubject);
            //this.newList.subjectScore.push(this.score);
            this.newSubject = '';
            this.score = 0;
            if (this.newList.subject.length !== 0) {
              this.myChart.destroy();
            }
            this.init();
          });
        }
      });
    } else if (this.score === 0 || this.score == null) {
      this.accountService.identity().subscribe(account => {
        if (account) {
          console.log(account.login);
          this.http.get<any>('/api/account').subscribe(account => {
            const userId = account.id;
            //@ts-ignore
            const newItem: NewHistoryTwo = {
              subject: '',
              subjectScore: 0,
              subjectTarget: this.target,
              upcomingTest: this.newSubject,
              upcomingTestTarget: this.target,
              user: { id: userId, login: account.login },
            };
            this.historyListService.create(newItem).subscribe();
            //this.newList.subject.push(this.newSubject);
            //this.newList.subjectScore.push(this.score);
            this.newSubject = '';
            this.score = 0;
            if (this.newList.subject.length !== 0) {
              this.myChart.destroy();
            }
            this.init();
          });
        }
      });
    }
  }
  ngOnInit(): void {
    let labels: string[] = ['Maths Test 1', 'English Test 1', 'Biology Test 1', 'Maths Test 2', 'Maths Test 3'];
    let itemData: number[] = [80, 70, 85, 90, 87];
    this.init();
  }
}
