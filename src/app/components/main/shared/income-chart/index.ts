import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { WalletProvider } from '../../providers/wallet/WalletProvider';
import { CHAIN } from 'src/environments/environment';
import { CopyDirective } from 'src/app/directives/copy';
import { AddressPipe } from 'src/app/pipes/address';
import { HexToDecPipe } from 'src/app/pipes/hextodec';
import { MatExpansionModule } from '@angular/material/expansion';

Chart.register(...registerables);

@Component({
  selector: 'app-income-chart',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    DecimalPipe,
    DatePipe,
    MatRippleModule,
    RouterLink,
    NgIf,
    CopyDirective,
    AddressPipe,
    HexToDecPipe,
    MatExpansionModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class IncomeChartComponent implements OnInit {
  dates = [
    { month: 'Mar', count: 1 },
    { month: 'Apr', count: 1.2 },
    { month: 'May', count: 1.4 },
    { month: 'Jun', count: 1.6 },
    { month: 'Jul', count: 1.65 },
    { month: 'Aug', count: 1.8 },
    { month: 'Sep', count: 0 },
    { month: 'Oct', count: 0 },
    { month: 'Nov', count: 0 },
    { month: 'Dec', count: 0 },
    { month: 'Jan', count: 0 },
    { month: 'Feb', count: 0 }
  ];

  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  startDate: bigint = 0n;
  decimals = 18;

  start = signal<Date | null>(null);
  end = signal<Date | null>(null);
  amount = signal<number>(4);

  chart: Chart;
  @ViewChild('barChar', { static: true })
  barchar: ElementRef<HTMLCanvasElement>;
  chartAmount = 0;

  views = {
    catalogue: 0,
    myBonds: 1,
  };

  infoActive = signal(this.views.catalogue);
  balance = signal(0n);
  active = signal(false);
  bondAddress = signal(CHAIN[this.walletProvider.chain()].bonds.one.swap);
  explorer = CHAIN[this.walletProvider.chain()].EXPLORER;
  tx = '0x27e894420a8a614b5c67384a1f74755729b58946da042bf3b5ed6992ac551f9c';

  constructor(public walletProvider: WalletProvider) { }

  ngOnInit(): void {
    this.renderChart();
  }

  ngOnDestroy() {
    // this.chart.destroy();
  }

  private loggingEffect = effect(() => {
    if (this.walletProvider.address()) {
      untracked(() => {
        this.init();
        this.erc1155Balance();
      });
    }
  });

  async init() {
    const [params, percent, _periods, decimals] =
      await this.walletProvider.getEarnContractParams();
    this.amount.set(Number(percent.amount / 10n));
    this.decimals = Number(decimals);
    this.startDate = params[2] * 1000n;
    this.setLends();
  }

  async setLends() {
    const k = await this.walletProvider.getLends();
    let start = null;
    let end = null;
    let amount = 0;
    let apy = 0;
    const percent = 4;

    for (const i of k) {
      if (i.status == 0n) {
        if (i.rewards[1] > 0) {
          apy += Number(i.rewards[0]) / Number(i.rewards[1]);
        }
        amount += Number(i.amount);
        if (start == null || start < i.startDay) {
          start = i.startDay;
        }
        if (end == null || end > i.endDay) {
          end = i.endDay;
        }
      }
    }

    const mreturn = ((apy / 1000) * (amount / 10 ** this.decimals)) / 12;

    // this.dates[0].count = mreturn;

    if (start != null) {
      this.start.set(
        new Date(Number(this.startDate) + Number(start) * 24 * 60 * 60 * 1000)
      );
    }

    if (start != null) {
      this.end.set(
        new Date(Number(this.startDate) + Number(end) * 24 * 60 * 60 * 1000)
      );
    }

    // let month = this.start().getMonth();
    // const maxMonths = Math.round((this.end().getTime() - this.start().getTime()) / 24 / 60 / 60 / 1000);

    // const dates = [];

    // while(month < 0){




    //   month--;

    // }

    // console.log(this.start(), this.end(), amount);

    this.renderChart();
  }

  async erc1155Balance() {
    const balance = await this.walletProvider.erc1155Balance();
    this.balance.set(balance);
    if (balance > 0) {
      this.active.set(true);
    } else {
      this.active.set(false);
    }
  }

  setInfo(view) {
    this.infoActive.set(view);
  }

  renderChart() {
  //   if (this.chart) {
  //     this.chart.destroy();
  //   }

  //   this.chart = new Chart(this.barchar.nativeElement, {
  //     type: 'bar',
  //     data: {
  //       labels: this.dates.map((row) => row.month),
  //       datasets: [
  //         {
  //           backgroundColor: ['rgba(92, 104, 255, 1)'],
  //           pointStyle: 'circle',
  //           borderColor: 'white',
  //           borderWidth: 1,
  //           borderRadius: {
  //             topLeft: 10,
  //             topRight: 10,
  //             bottomLeft: 10,
  //             bottomRight: 10,
  //           },
  //           borderSkipped: false,
  //           barThickness: 6,
  //           barPercentage: 0.5,
  //           label: 'Autonoumos earning',
  //           data: this.dates.map((row) => row.count),
  //         },
  //         {
  //           backgroundColor: ['rgba(112, 207, 152, 1)'],
  //           pointStyle: 'circle',
  //           borderColor: 'white',
  //           borderWidth: 1,
  //           borderRadius: {
  //             topLeft: 10,
  //             topRight: 10,
  //             bottomLeft: 10,
  //             bottomRight: 10,
  //           },
  //           borderSkipped: false,
  //           barThickness: 6,
  //           barPercentage: 0.5,
  //           label: 'Corporate bonds',
  //           data: this.dates.map((row) => row.count),
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: true,
  //       plugins: {
  //         legend: {
  //           labels: {
  //             usePointStyle: true,
  //           },
  //         },
  //       },
  //       scales: {
  //         x: {
  //           stacked: true,
  //           grid: {
  //             display: false,
  //           },
  //         },
  //         y: {
  //           stacked: true,
  //           beginAtZero: true,
  //           border: {
  //             display: false,
  //           },
  //         },
  //       },
  //     },
  //   });
  }
}
