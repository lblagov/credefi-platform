import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { WalletXRPLProvider } from '../../providers/wallet/WalletXRPLProvider';

Chart.register(...registerables)

@Component({
  selector: 'app-income-chart',
  templateUrl: './index.xrpl.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, MatButtonModule, DecimalPipe, DatePipe, MatRippleModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class IncomeChartComponent implements OnInit {

  dates = [
    { month: 'Sep', count: 0 },
    { month: 'Oct', count: 0 },
    { month: 'Nov', count: 0 },
    { month: 'Dec', count: 0 },
    { month: 'Jan', count: 0 },
    { month: 'Feb', count: 0 },
    { month: 'Mar', count: 0 },
    { month: 'Apr', count: 0 },
    { month: 'May', count: 0 },
    { month: 'Jun', count: 0 },
    { month: 'Jul', count: 0 },
    { month: 'Aug', count: 0 },
  ];

  startDate: bigint = 0n;
  decimals = 18;

  start = signal<Date | null>(null);
  end = signal<Date | null>(null);
  amount = signal<number>(4);

  chart: Chart;
  @ViewChild('barChar', { static: true }) barchar: ElementRef<HTMLCanvasElement>;
  chartAmount = 0;

  constructor(private walletProvider: WalletXRPLProvider) { }

  ngOnInit(): void {
    this.renderChart();
  }

  ngOnDestroy() {
    this.chart.destroy();
  }

  renderChart() {

    if (this.chart) {
      this.chart.destroy()
    }

    this.chart = new Chart(this.barchar.nativeElement, {
      type: 'bar',
      data: {
        labels: this.dates.map(row => row.month),
        datasets: [
          {
            backgroundColor: ['rgba(92, 104, 255, 1)'],
            pointStyle: 'circle',
            borderColor: "white",
            borderWidth: 1,
            borderRadius: {
              topLeft: 10,
              topRight: 10,
              bottomLeft: 10,
              bottomRight: 10
            },
            borderSkipped: false,
            barThickness: 6,
            barPercentage: 0.5,
            label: 'Portfolio lend',
            data: this.dates.map(row => row.count)
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },

          },
          y: {
            stacked: true,
            beginAtZero: true,
            border: {
              display: false
            },
          }
        }
      }
    });
  }

}