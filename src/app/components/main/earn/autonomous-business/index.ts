import { ChangeDetectionStrategy, Component, signal, OnDestroy, ViewChild, ElementRef, OnInit, effect, untracked, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LoaderProvider } from 'src/app/providers';
import { DecimalPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { track } from 'src/app/helpers/track';
import { AddressPipe } from 'src/app/pipes/address';
import { HexToDecPipe } from 'src/app/pipes/hextodec';
import { ABI as USDT_ABI } from 'src/globals/abi-usdt';
import { SignDialog } from '../../shared/sign';

import { BannerAutonomousEarningComponent } from '../../shared/banner-autonomous-earning';
import { MatButtonModule } from '@angular/material/button';
import { AlertDialog } from '../../shared/alert';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ConnectDialog } from 'src/app/helpers/connectDialog';
import { WalletTypes } from 'src/globals';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { CopyDirective } from 'src/app/directives/copy';
import { WalletProvider } from '../../providers/wallet/WalletProvider';
import { MapProvider } from 'src/app/providers';
import { AutonomusProvider, KycProvider } from '../../providers';
import { CHAIN } from 'src/environments/environment';
import { BusinessDialog } from '../../shared/business-form';

Chart.register(...registerables);

enum Views {
  tvl,
  apy,
  rate
}

@Component({
  selector: 'app-autonomous-earning',
  templateUrl: './index.html',
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
    NgStyle
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})

export class AutonomousEarningComponent extends ConnectDialog implements OnDestroy, OnInit {

  views = Views;
  explorer = CHAIN[this.walletProvider.chain()].EXPLORER;
  form = new FormGroup({
    period: new FormControl(0, [
      Validators.required
    ]),
    amount: new FormControl<number | null>(null, [
      Validators.required
    ]),
  });

  user: string;
  userData =  signal<any>([]);

  infoActive = signal(Views.tvl);
  info = signal(Views.tvl);
  buttonActive = signal(Views.tvl);
  load = signal(false);
  periods = signal<any>([]);
  amount = signal<bigint>(4n);
  total = signal(0);
  apy = signal(0);
  earn = signal(0);

  balance = signal(0);
  tvl = signal(0);
  active = signal(false);
  totalDays = signal(0);
  recenttxs = signal([]);
  autonomus = inject(AutonomusProvider);

  tierLevel = signal(0);

  TierLevels = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3
  }

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
    private walletProvider: WalletProvider,
    private loaderProvider: LoaderProvider,
    private matDialog: MatDialog,
    private mapProvider: MapProvider,
    private kyc: KycProvider,

  ) {
    super();
    this.user = this.mapProvider.get(MapProvider.USER);
    this.userData.set(this.mapProvider.get(MapProvider.USER));
  }

  ngOnInit(): void {
    this.init();
    try {
      this.renderChart(this.tvldata);
    } catch (e) {
      console.log(e)
    }
  }

  ngOnDestroy() {
    this.cleanChart();
  }

  private loggingEffect = effect(() => {
    if (this.walletProvider.address()) {
      untracked(() => {
        this.setLends();
        this.setTier();
        this.init();
      })
    }
  });

  async setTier() {
    const tierLevel = await this.walletProvider.getTierLevel();
    this.tierLevel.set(tierLevel);
  }

  async init() {

    this.loaderProvider.show();

    const [[params, percent, periods, decimals], isWhitelisted] = await Promise.all([
      this.walletProvider.getEarnBusinessContractParams(),
      this.walletProvider.isBusinessWhitelisted()
    ]);

    if(!isWhitelisted){
      this.openBusinessDialog();
    }

    const tvl = Number(params[3]) / (10 ** Number(decimals))
    this.tvl.set(tvl);

    const p = periods.sort((a, b) => {
      return a.period < b.period ? -1 : 0;
    }).map((p: IObjectKeys) => {
      p.period = Math.round(Number(p.period) / 30);
      return p;
    })

    this.periods.set(p)
    this.amount.set(percent.amount / 10n);

    this.balance.set(await this.walletProvider.getContractBalance({
      ABI: USDT_ABI,
      address: CHAIN[this.walletProvider.chain()].USDT_ADDRESS
    }));

    this.tvldata[0].count = this.tvl();
    this.renderChart(this.tvldata);
    this.loaderProvider.hide();
  }

  async setLends() {
    const k = await this.walletProvider.getLendsBusiness();
    let total = 0n;
    let apy = 0;

    if (k.length > 0) {
      this.active.set(true);
    }

    for (const i of k) {
      if (i.status == 0n) {
        total += i.amount;
        if (i.rewards[1] > 0n) {
          apy += (Number(i.rewards[0]) / Number(i.rewards[1]))
        }
      }
      this.totalDays.set(Number(i.endDay));
    }
    this.apy.set(Number(apy) / 10);
    this.total.set(Number(total) / (10 ** 18));
    this.earn.set(this.total() * this.apy() / 100);

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

    if (this.form.invalid) {
      return false;
    }

    if(this.walletProvider.address() == null){
      return this.connect();
    }

    try {
      switch (this.walletProvider.wallet().type) {
        case (WalletTypes.metamask): {
          await this.onSubmitMetamask();
          break
        }
        case (WalletTypes.credi): {
          await this.submitCrediWallet();
          break
        }
        case (WalletTypes.walletconnect): {
          await this.onSubmitWalletConnect();
          break
        }
      }
    } catch (e) {
      console.error(e)
    }

  }

  async submitCrediWallet() {
    try {

      this.load.set(true);

      const value = this.form.value;
      const allowance = await this.walletProvider.getUsdtAllowance();

      if (allowance > 0n) {
        const rawData = await this.walletProvider.approveTx({
          from: this.walletProvider.address(),
          spender: CHAIN[this.walletProvider.chain()].EARN_BUSINESS_ADDRESS,
          amount: 0
        });

        const tx: IObjectKeys = await this.openDialog(rawData);

        const transaction = await this.checkTransaction(tx.transactionHash);
        if (!transaction?.status) {
          await this.checkTransactionListener(tx.transactionHash);
        }
      }


      const rawData = await this.walletProvider.approveTx({
        from: this.walletProvider.address(),
        spender: CHAIN[this.walletProvider.chain()].EARN_BUSINESS_ADDRESS,
        amount: value.amount
      });

      const tx: IObjectKeys = await this.openDialog(rawData);

      const transaction = await this.checkTransaction(tx.transactionHash);
      if (!transaction?.status) {
        await this.checkTransactionListener(tx.transactionHash);
      }

      const r = await this.walletProvider.earnBusinessTx({ from: this.walletProvider.address(), amount: value.amount, index: value.period });

      const tx2: IObjectKeys = await this.openDialog(r);

      window.open(`${CHAIN[this.walletProvider.chain()].EXPLORER}/${tx2.transactionHash}`);
      this.postAutonomus(tx2.transactionHash);
      this.setLends();
      this.form.reset()

    } catch (e) {
      console.error(e)
      this.alertDialog(e.message)
    } finally {
      this.load.set(false);
      this.loaderProvider.hide();
      this.setLends();
    }
  }

  openDialog(rawTx: IObjectKeys) {
    return new Promise((resolve) => {
      this.matDialog.open(SignDialog, {
        scrollStrategy: new NoopScrollStrategy(),
        autoFocus: false,
        panelClass: 'wallet-dialog',
        backdropClass: 'back-drop-class',
        data: rawTx
      }).afterClosed().subscribe((data) => {
        resolve(data)
      });
    })

  }

  openBusinessDialog(){
    this.matDialog.open(BusinessDialog, {
      scrollStrategy: new NoopScrollStrategy(),
      autoFocus: false,
      disableClose: true,
      backdropClass: 'back-drop-class',
    })
  }

  async onSubmitWalletConnect() {
    try {

      this.load.set(true);
      this.loaderProvider.show();

      const value = this.form.value;
      const provider = await this.walletProvider.wagmiConfig.connector.getProvider();
      const allowance = await this.walletProvider.getUsdtAllowance();

      if (allowance > 0n) {
        const rawData = await this.walletProvider.approveTx({
          from: this.walletProvider.address(),
          spender: CHAIN[this.walletProvider.chain()].EARN_BUSINESS_ADDRESS,
          amount: 0
        });

        const data = await provider
          .request({
            method: 'eth_sendTransaction',
            params: [rawData],
          });

        const transaction = await this.checkTransaction(data);

        if (!transaction?.status) {
          await this.checkTransactionListener(data);
        }
      }

      const rawData = await this.walletProvider.approveTx({
        from: this.walletProvider.address(),
        spender: CHAIN[this.walletProvider.chain()].EARN_BUSINESS_ADDRESS,
        amount: value.amount
      });

      const data = await provider.request({
        method: 'eth_sendTransaction',
        params: [rawData],
      });

      const transaction = await this.checkTransaction(data);

      if (!transaction?.status) {
        await this.checkTransactionListener(data);
      }

      const r = await this.walletProvider.earnBusinessTx({ from: this.walletProvider.address(), amount: value.amount, index: value.period });

      const tx = await provider.request({
        method: 'eth_sendTransaction',
        params: [r],
      });


      window.open(`${CHAIN[this.walletProvider.chain()].EXPLORER}/${tx}`);
      this.postAutonomus(transaction.transactionHash.toString());

      this.setLends();
      this.form.reset()

    } catch (e) {
      console.error(e)
      this.alertDialog(e.message)
    } finally {
      this.load.set(false);
      this.loaderProvider.hide();
      this.setLends();
    }
  }

  async onSubmitMetamask() {
    try {

      this.load.set(true);
      this.loaderProvider.show();

      const allowance = await this.walletProvider.getUsdtAllowance();

      if (allowance > 0n) {
        const rawData = await this.walletProvider.approveTx({
          from: this.walletProvider.address(),
          spender: CHAIN[this.walletProvider.chain()].EARN_BUSINESS_ADDRESS,
          amount: 0
        });

        delete rawData.nonce;

        const data = await  this.walletProvider.getWallet()
          .request({
            method: 'eth_sendTransaction',
            params: [rawData],
          });

        const transaction = await this.checkTransaction(data);

        if (!transaction?.status) {
          await this.checkTransactionListener(data);
        }
      }

      const value = this.form.value;
      const rawData = await this.walletProvider.approveTx({
        from: this.walletProvider.address(),
        spender: CHAIN[this.walletProvider.chain()].EARN_BUSINESS_ADDRESS,
        amount: value.amount
      });

      delete rawData.nonce;

      const data = await  this.walletProvider.getWallet()
        .request({
          method: 'eth_sendTransaction',
          params: [rawData],
        });

      const transaction = await this.checkTransaction(data);

      if (!transaction?.status) {
        await this.checkTransactionListener(data);
      }

      const r = await this.walletProvider.earnBusinessTx({ from: this.walletProvider.address(), amount: value.amount, index: value.period });
      delete r.nonce;

      const tx = await  this.walletProvider.getWallet()
        .request({
          method: 'eth_sendTransaction',
          params: [r],
        });


      window.open(`${CHAIN[this.walletProvider.chain()].EXPLORER}/${tx}`);
      this.postAutonomus(tx);

      this.setLends();
      this.form.reset()


    } catch (e) {
      console.error(e)
      this.alertDialog(e.message)
    } finally {
      this.load.set(false);
      this.loaderProvider.hide();
      this.setLends();
    }
  }

  async checkTransaction(hash: string) {
    try {
      return await this.walletProvider.web3.eth.getTransactionReceipt(hash);
    } catch (e) {
      return null;
    }
  }

  checkTransactionListener(hash: string) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        this.walletProvider.web3.eth.getTransactionReceipt(hash).then((transaction) => {
          if (transaction?.status) {
            clearInterval(interval);
            return resolve(transaction);
          }
        }).catch((e: Error) => {
          console.log(e)
        });
      }, 20000);
    });
  }

  validateKyc() {
    this.kyc.initIframe();
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

  postAutonomus(transaction: string){
    const period = this.periods().find((e) => e.index == this.form.get('period').value);
    this.autonomus.post({
      transaction,
      chain: this.walletProvider.chain(),
      period: period.period,
      amount: Number(this.form.get('amount').value)
    }).subscribe();
  }

  async loadRecent() {
    try{
      this.infoActive.set(Views.rate);
      this.info.set(Views.rate);
      const txs = await this.walletProvider.getTransactions(8, null, CHAIN[this.walletProvider.chain()].OWNER);
      this.recenttxs.set(txs.result.transfers);
    }catch(e){
      console.log(e)
    }

  }

  alertDialog(message: string) {
    this.matDialog.open(AlertDialog, {
      scrollStrategy: new NoopScrollStrategy(),
      backdropClass: 'back-drop-class',
      autoFocus: false,
      panelClass: 'wallet-dialog',
      data: {
        message
      }
    });
  }

  track = track;
}
