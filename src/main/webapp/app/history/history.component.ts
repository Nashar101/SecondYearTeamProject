import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'jhi-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  constructor() {}

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
