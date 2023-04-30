import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import { HistoryService } from '../entities/history/service/history.service';
import { IHistory, NewHistory } from '../entities/history/history.model';

import { AccountService } from '../core/auth/account.service';
import { HttpClient } from '@angular/common/http';
export class list {
  ID!: number;
  subject!: string;
  subjectScore!: number;
  subjectTarget!: string;
  upcomingTest!: string;
  upcomingTestTarget!: string;
}
@Component({
  selector: 'jhi-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  historyItems?: IHistory[];
  newList: list[] = [];

  init(): void {
    this.http.get<any>('/api/account').subscribe(account => {
      const userID = account.id;
      this.historyListService.query().subscribe(response => {
        this.historyItems = response.body || [];
        this.historyItems = this.historyItems.filter(list => list.user?.id === userID);

        for (let i = 0; i < this.historyItems.length; i++) {
          let historyList = new list();
          historyList.ID = this.historyItems[i].id;
          //@ts-ignore
          historyList.subject = this.historyItems[i].subject;
          //@ts-ignore
          historyList.subjectScore = this.historyItems[i].subjectScore;
          //@ts-ignore
          historyList.subjectTarget = this.historyItems[i].subjectTarget;
          //@ts-ignore
          historyList.upcomingTest = this.historyItems[i].upcomingTest;
          //@ts-ignore
          historyList.upcomingTestTarget = this.historyItems[i].upcomingTestTarget;
          this.newList.push(historyList);
          historyList = new list();
        }
      });
    });
  }

  constructor(private accountService: AccountService, private http: HttpClient, protected historyListService: HistoryService) {}

  ngOnInit(): void {
    let labels: string[] = ['Maths Test 1', 'English Test 1', 'Biology Test 1', 'Maths Test 2', 'Maths Test 3'];
    let itemData: number[] = [80, 70, 85, 90, 87];

    var myChart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Test Grades',
            data: itemData,
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
}
