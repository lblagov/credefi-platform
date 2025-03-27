import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild, effect, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { WalletXRPLProvider } from 'src/app/components/main/providers/wallet/WalletXRPLProvider';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe, NgFor, NgIf, NgStyle, SlicePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BannerAutonomousEarningComponent } from '../../shared/banner-autonomous-earning';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyTypes, WalletTypes } from 'src/globals';
import { ConnectXRPLDialog } from 'src/app/helpers/connectXRPLDialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { XummDialog } from '../../shared/xumm-dialog';
import { CREDI_ADDESS, EXPLORER, XRPL_TOKENS } from 'src/environments/environment.xrpl';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { AddressPipe } from 'src/app/pipes/address';
import { HexToDecPipe } from 'src/app/pipes/hextodec';
import { CopyDirective } from 'src/app/directives/copy';
import { XummProvider } from '../../providers/wallet/XummProvider';
import { RouterLink } from '@angular/router';
import { rippleTimeToISOTime, xrpToDrops } from 'xrpl';
import { firstValueFrom } from 'rxjs';
import { GeckoProvider } from '../../providers';

Chart.register(...registerables)

enum Views {
  tvl,
  apy,
  rate
}

@Component({
  selector: 'app-autonomous-earning',
  templateUrl: './index.xrpl.html',
  styleUrls: ['./style.scss'],
  imports: [
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    BannerAutonomousEarningComponent,
    MatButtonModule,
    MatSelectModule,
    RouterLink,
    AddressPipe,
    HexToDecPipe,
    MatDialogModule,
    CopyDirective,
    DecimalPipe,
    NgIf,
    NgFor,
    NgStyle,
    SlicePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})

export class AutonomousEarningComponent extends ConnectXRPLDialog implements OnDestroy, OnInit {

  views = Views;
  explorer = EXPLORER;

  form = new FormGroup({
    period: new FormControl(0, [
      Validators.required
    ]),
    amount: new FormControl<number | null>(null, [
      Validators.required
    ]),
    token: new FormControl<string | null>(null, [
      Validators.required
    ]),
    name: new FormControl<string | null>(null, []),
  });

  periods = signal<any>([
    {
      index: 0,
      period: 90
    },
    {
      index: 1,
      period: 180
    },
    {
      index: 2,
      period: 270
    },
    {
      index: 3,
      period: 360
    }
  ])

  tokens = signal<any>(XRPL_TOKENS);

  amount = signal<bigint>(4n);
  totalusd = signal(0);
  totaleur = signal(0);

  apy = signal(0);
  earn = signal(0);
  active = signal(false);
  recenttxs = signal([]);
  deposittxs = signal({
    EUR: 0,
    USD: 0
  });

  rewardstxs = signal({
    EUR: 0,
    USD: 0
  })

  infoActive = signal(Views.tvl);
  info = signal(Views.tvl);
  buttonActive = signal(Views.tvl);
  load = signal(false);

  chart: Chart;

  @ViewChild('barchart', { static: true }) barchart: ElementRef<HTMLCanvasElement>;

  tvldata = [
    { month: 'Sep', count: 0 },
    { month: 'Oct', count: 0 },
    { month: 'Nov', count: 0 },
    { month: 'Des', count: 0 },
    { month: 'Jan', count: 0 },
    { month: 'Feb', count: 0 },
    { month: 'Mar', count: 0 },
    { month: 'Apr', count: 0 },
    { month: 'May', count: 0 },
    { month: 'Jun', count: 0 },
    { month: 'Jul', count: 0 },
    { month: 'Aug', count: 0 },
  ];

  apydata = [
    { month: 'Sep', count: 12 },
    { month: 'Oct', count: 0 },
    { month: 'Nov', count: 0 },
    { month: 'Des', count: 0 },
    { month: 'Jan', count: 0 },
    { month: 'Feb', count: 0 },
    { month: 'Mar', count: 0 },
    { month: 'Apr', count: 0 },
    { month: 'May', count: 0 },
    { month: 'Jun', count: 0 },
    { month: 'Jul', count: 0 },
    { month: 'Aug', count: 0 },
  ];

  uratedata = [
    { month: 'Sep', count: 100 },
    { month: 'Oct', count: 0 },
    { month: 'Nov', count: 0 },
    { month: 'Des', count: 0 },
    { month: 'Jan', count: 0 },
    { month: 'Feb', count: 0 },
    { month: 'Mar', count: 0 },
    { month: 'Apr', count: 0 },
    { month: 'May', count: 0 },
    { month: 'Jun', count: 0 },
    { month: 'Jul', count: 0 },
    { month: 'Aug', count: 0 },
  ];


  constructor(
    private xummWallet: XummProvider,
    private walletProvider: WalletXRPLProvider,
    private matDialog: MatDialog,
    private gecko: GeckoProvider
  ) {
    super();
  }


  ngOnInit(): void {
    try {
      this.loadTotal();
      this.renderChart(this.tvldata);
    } catch (e) {
      console.log(e)
    }
  }

  private loggingEffect = effect(() => {
    if (this.walletProvider.address()) {
      untracked(() => {
        this.loadTotal();
      })
    }
  });

  ngOnDestroy() {
    this.cleanChart();
  }

  cleanChart() {
    if (this.chart) {
      this.chart.destroy()
    }
  }

  renderChart(data: IObjectKeys[]) {
    this.cleanChart();
    this.chart = new Chart(this.barchart.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(row => row.month),
        datasets: [
          {
            backgroundColor: ['rgba(79, 166, 119, 1)'],
            pointStyle: 'circle',
            borderColor: "white",
            borderWidth: 1,
            borderRadius: {
              topLeft: 20,
              topRight: 20,
              bottomLeft: 20,
              bottomRight: 20
            },
            borderSkipped: false,
            barThickness: 10,
            barPercentage: 0.5,
            data: data.map(row => row.count)
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            border: {
              display: false
            },
          }
        }
      }
    });
  }

  async onSubmit() {
    if (this.form.valid) {

      if (!this.walletProvider.wallet()) {
        return await this.connect();
      }

      switch (this.walletProvider.wallet().type) {
        case (WalletTypes.gemwallet): {
          this.gumWalletSubmit();
          break;
        }
        case (WalletTypes.xumm): {
          this.xummWalletSubmit();
          break;
        }
        case (WalletTypes.crosswallet): {
          this.crossWalletSubmit();
          break;
        }
      }

    }
  }

  async gumWalletSubmit() {
    if (this.form.valid) {
      try {
        const value = this.form.value;

        this.load.set(true);
        const memo: any = {
          period: this.periods()[value.period].period,
          lease: value.amount.toString(),
          name: value.name
        };

        switch (value.token) {
          case (CurrencyTypes.xrpl): {
            const price = await this.getPrice()
            memo.xrpPrice = price;

            const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.xrpl);
            const currency = XRPL_TOKENS[index];
            await this.walletProvider.transactionTokenGemWallet({
              currency: {
                currency: currency.address,
                issuer: currency.issuer,
                value: value.amount.toString()
              },
              destination: CREDI_ADDESS,
              memo: memo
            })
            break;
          }
          case (CurrencyTypes.usd): {
            const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.usd);
            const currency = XRPL_TOKENS[index];
            await this.walletProvider.transactionTokenGemWallet({
              currency: {
                currency: currency.address,
                issuer: currency.issuer,
                value: value.amount.toString()
              },
              destination: CREDI_ADDESS,
              memo: memo
            })
            break;
          }
          case (CurrencyTypes.eur): {
            const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.eur);
            const currency = XRPL_TOKENS[index];
            await this.walletProvider.transactionTokenGemWallet({
              currency: {
                currency: currency.address,
                issuer: currency.issuer,
                value: value.amount.toString()
              },
              destination: CREDI_ADDESS,
              memo: memo
            })
            break;
          }
        }

        this.form.reset();
        this.loadTotal();


      } catch (e) {
        console.error(e)
      } finally {
        this.load.set(false);
      }

    }
  }


  async crossWalletSubmit() {
    if (this.form.valid) {
      try {
        const value = this.form.value;
        this.load.set(true);

        const memo: any = {
          period: this.periods()[value.period].period,
          lease: value.amount.toString(),
          name: value.name,
          crossmark: true
        }

        switch (value.token) {
          case (CurrencyTypes.xrpl): {
            const price = await this.getPrice()
            memo.xrpPrice = price;

            const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.xrpl);
            const currency = XRPL_TOKENS[index];

            await this.walletProvider.transactionTokenCrossWallet({
              currency: {
                currency: currency.address,
                issuer: currency.issuer,
                value: value.amount.toString()
              },
              destination: CREDI_ADDESS,
              memo: memo
            })
            break;
          }
          case (CurrencyTypes.usd): {
            const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.usd);
            const currency = XRPL_TOKENS[index];
            memo.crossmark = true;

            await this.walletProvider.transactionTokenCrossWallet({
              currency: {
                currency: currency.address,
                issuer: currency.issuer,
                value: value.amount.toString()
              },
              destination: CREDI_ADDESS,
              memo: memo
            })
            break;
          }
          case (CurrencyTypes.eur): {
            const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.eur);
            const currency = XRPL_TOKENS[index];

            await this.walletProvider.transactionTokenCrossWallet({
              currency: {
                currency: currency.address,
                issuer: currency.issuer,
                value: value.amount.toString()
              },
              destination: CREDI_ADDESS,
              memo: memo
            })
            break;
          }
        }

        this.form.reset();
        this.loadTotal();


      } catch (e) {
        console.error(e)
      } finally {
        this.load.set(false);
      }

    }
  }

  async getPrice(){
    return firstValueFrom(this.gecko.get()).then((item: IObjectKeys) => {
      const { ripple } = item;
      const xrplPrice = (ripple?.usd ?? 0);
      return xrplPrice
    }).catch((e) => {
      return 0;
    });
  }

  async xummWalletSubmit() {
    if (this.form.valid) {
      const value = this.form.value;

      switch (value.token) {
        case (CurrencyTypes.xrpl): {
          const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.xrpl);
          const currency = XRPL_TOKENS[index];
          const price = await this.getPrice()

          const data = {
            currency: currency.address,
            issuer: currency.issuer,
            value: value.amount.toString(),
          };

          this.xummWallet.request({
            "TransactionType": "Payment",
            "Destination": CREDI_ADDESS,
            "Amount": data.currency == 'XRP' ? xrpToDrops(data.value)  : currency,
            "Memos": [
              {
                Memo: {
                  MemoData: Buffer.from(JSON.stringify({
                    period: this.periods()[value.period].period,
                    lease: value.amount.toString(),
                    name: value.name,
                    xrpPrice: price

                  })).toString('hex')
                }
              }
            ]
          }).subscribe(({ result }) => {
            if (result) {
              this.matDialog.open(XummDialog, {
                scrollStrategy: new NoopScrollStrategy(),
                autoFocus: false,
                panelClass: 'wallet-dialog',
                backdropClass: 'back-drop-class',
                data: result
              }).afterClosed().subscribe((data) => {
                this.form.reset();
                this.loadTotal();
              })
            }
          })
          break;
        }
        case (CurrencyTypes.usd): {
          const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.usd);
          const currency = XRPL_TOKENS[index];
          const data = {
            currency: currency.address,
            issuer: currency.issuer,
            value: value.amount.toString()
          };

          this.xummWallet.request({
            "TransactionType": "Payment",
            "Destination": CREDI_ADDESS,
            "Amount": data,
            "Memos": [
              {
                Memo: {
                  MemoData: Buffer.from(JSON.stringify({
                    period: this.periods()[value.period].period,
                    lease: value.amount.toString(),
                    name: value.name
                  })).toString('hex')
                }
              }
            ]
          }).subscribe(({ result }) => {
            if (result) {
              this.matDialog.open(XummDialog, {
                scrollStrategy: new NoopScrollStrategy(),
                autoFocus: false,
                panelClass: 'wallet-dialog',
                backdropClass: 'back-drop-class',
                data: result
              }).afterClosed().subscribe((data) => {
                this.form.reset();
                this.loadTotal();
              })
            }
          })
          break;
        }
        case (CurrencyTypes.eur): {
          const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.eur);
          const currency = XRPL_TOKENS[index];
          const data = {
            currency: currency.address,
            issuer: currency.issuer,
            value: value.amount.toString()
          };

          this.xummWallet.request({
            "TransactionType": "Payment",
            "Destination": CREDI_ADDESS,
            "Amount": data,
            "Memos": [
              {
                Memo: {
                  MemoData: Buffer.from(JSON.stringify({
                    period: this.periods()[value.period].period,
                    lease: value.amount.toString(),
                    name: value.name
                  })).toString('hex')
                }
              }
            ]
          }).subscribe(({ result }) => {
            if (result) {
              this.matDialog.open(XummDialog, {
                scrollStrategy: new NoopScrollStrategy(),
                autoFocus: false,
                panelClass: 'wallet-dialog',
                backdropClass: 'back-drop-class',
                data: result
              }).afterClosed().subscribe((data) => {
                this.form.reset();
                this.loadTotal();

              })
            }
          })
          break;
        }
      }
    }
  }

  async loadTotal() {
    const tokens = await this.walletProvider.getTokenBalances(CREDI_ADDESS);
    for (const currency of tokens.result?.lines) {
      const index = XRPL_TOKENS.findIndex((item) => item.address == currency.currency && item.issuer == currency.account);
      const item = XRPL_TOKENS[index];
      if (item) {
        this[`total${item.address.toLocaleLowerCase()}`].set(Number(currency.balance));
      }
    }

    if (this.walletProvider.address()) {
      const deposits = await this.walletProvider.depositHistory(CREDI_ADDESS);
      const deposit = {
        EUR: 0,
        USD: 0
      }
      const rewards = {
        EUR: 0,
        USD: 0
      }
      const percent = 12/100/365;

      const items = deposits.transactions.filter((i) => {
        if (i.tx?.Account == this.walletProvider.address()) {
          return true;
        }
        return false;
      });
      for (const item of items as any[]) {

        if (item.tx?.Amount?.currency) {
          const amount = Number(item.tx?.Amount?.value);
          deposit[item.tx?.Amount?.currency] += amount;
          const createdAt = new Date((rippleTimeToISOTime(item.tx.date))).getTime();
          const current = new Date().getTime();
          const reward = percent * ((current - createdAt) / (24 * 60 * 60 * 1000));
          rewards[item.tx?.Amount?.currency] += reward;
        }
      }
      this.deposittxs.set(deposit);
      this.rewardstxs.set(rewards);

    }

  }

  showTVL() {
    this.buttonActive.set(Views.tvl);
    this.renderChart(this.tvldata);
  }

  showAPY() {
    this.buttonActive.set(Views.apy);
    this.renderChart(this.apydata);
  }

  showURate() {
    this.buttonActive.set(Views.rate);
    this.renderChart(this.uratedata);
  }

  loadDeal() {
    this.infoActive.set(Views.tvl);
    this.info.set(Views.tvl);
  }

  loadParams() {
    this.infoActive.set(Views.apy);
    this.info.set(Views.apy);
  }

  async loadRecent() {
    this.infoActive.set(Views.rate);
    this.info.set(Views.rate);
    const txs = await this.walletProvider.txHistory(CREDI_ADDESS);
    this.recenttxs.update((value) => [...value, ...txs.transactions]);
  }

  track(i: number, item: IObjectKeys) {
    return item.tx.hash;
  };


}
