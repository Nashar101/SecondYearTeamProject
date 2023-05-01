import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import { HistoryService } from '../entities/history/service/history.service';
import { IHistory, NewHistory } from '../entities/history/history.model';

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
  historyItems?: IHistory[];
  //@ts-ignore
  newList: list;

  init(): void {
    this.http.get<any>('/api/account').subscribe(account => {
      const userID = account.id;
      console.log('this is admin id' + userID);
      this.historyListService.query().subscribe(response => {
        this.historyItems = response.body || [];
        this.historyItems = this.historyItems.filter(list => list.user?.id === userID);
        let historyList = new list();
        console.log('TESTING' + this.historyItems[0].subject);
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
        let labels: string[] = ['Maths Test 1', 'English Test 1', 'Biology Test 1', 'Maths Test 2', 'Maths Test 3'];
        let itemData: number[] = [80, 70, 85, 90, 87];
        var myChart = new Chart('myChart', {
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
      });
    });
  }
  constructor(private accountService: AccountService, private http: HttpClient, protected historyListService: HistoryService) {}

  /**add(): void{
    this.accountService.identity().subscribe(account => {
      if (account) {
        console.log(account.login);
        this.http.get<any>('/api/account').subscribe(response => {
          const userId = response.id;
          //@ts-ignore
          const newItem: NewHistory = {
            subject: this.newList[0].subject,
            subjectScore:  this.newList[0].subjectScore,
            subjectTarget: this.newList[0].subjectTarget,
            upcomingTest: this.newList[0].upcomingTest,
            upcomingTestTarget : this.newList[0].upcomingTestTarget,
            user: { id: userId, login: account.login },
          };
          this.historyListService.create(newItem).subscribe();
          this.init();
        });
      }
    });

  }**/
  ngOnInit(): void {
    let labels: string[] = ['Maths Test 1', 'English Test 1', 'Biology Test 1', 'Maths Test 2', 'Maths Test 3'];
    let itemData: number[] = [80, 70, 85, 90, 87];
    this.init();
  }
}
