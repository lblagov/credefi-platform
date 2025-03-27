import { ChangeDetectionStrategy, Component, signal, OnDestroy, OnInit, effect, untracked } from '@angular/core';
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
import { KycProvider } from '../../providers';
import { CHAIN } from 'src/environments/environment';

Chart.register(...registerables);

enum Views {
  tvl,
  apy,
  rate
}

@Component({
  selector: 'app-bonds-investing',
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

export class BondsInvestingComponent extends ConnectDialog implements OnDestroy, OnInit {

  views = Views;
  explorer = CHAIN[this.walletProvider.chain()].EXPLORER;
  form = new FormGroup({
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
  total = signal(0);

  balance = signal(0);
  bondUSD = signal(0);
  tvl = signal(0);
  active = signal(false);
  recenttxs = signal([]);

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

  }

  ngOnDestroy() {

  }

  private loggingEffect = effect(() => {
    if (this.walletProvider.address()) {
      untracked(() => {
        this.erc1155Balance();
      })
    }
  });

  async erc1155Balance() {
    const balance = await this.walletProvider.erc1155Balance();
    this.balance.set(Number(balance));
    if(balance){
      this.active.set(true);
    }
  }

  async init() {

    // this.loaderProvider.show();

    // const [params, percent, periods, decimals] = await this.walletProvider.getEarnContractParams();
    // const tvl = Number(params[3]) / (10 ** Number(decimals))
    // this.tvl.set(tvl);

    // const p = periods.sort((a, b) => {
    //   return a.period < b.period ? -1 : 0;
    // }).map((p: IObjectKeys) => {
    //   p.period = Math.round(Number(p.period) / 30);
    //   return p;
    // })

    // this.periods.set(p)
    // this.amount.set(percent.amount / 10n);

    // this.balance.set(await this.walletProvider.getContractBalance({
    //   ABI: USDT_ABI,
    //   address: CHAIN[this.walletProvider.chain()].USDT_ADDRESS
    // }));

    // this.tvldata[0].count = this.tvl();
    // this.renderChart(this.tvldata);
    // this.loaderProvider.hide();
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
          spender: CHAIN[this.walletProvider.chain()].bonds.one.swap,
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
        spender: CHAIN[this.walletProvider.chain()].bonds.one.swap,
        amount: value.amount
      });

      const tx: IObjectKeys = await this.openDialog(rawData);

      const transaction = await this.checkTransaction(tx.transactionHash);
      if (!transaction?.status) {
        await this.checkTransactionListener(tx.transactionHash);
      }

      const r = await this.walletProvider.swapBondTx({ from: this.walletProvider.address(), amount: value.amount });

      const tx2: IObjectKeys = await this.openDialog(r);

      window.open(`${CHAIN[this.walletProvider.chain()].EXPLORER}/${tx2.transactionHash}`);
      this.form.reset()

    } catch (e) {
      console.error(e)
      this.alertDialog(e.message)
    } finally {
      this.load.set(false);
      this.loaderProvider.hide();
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
          spender: CHAIN[this.walletProvider.chain()].bonds.one.swap,
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
        spender: CHAIN[this.walletProvider.chain()].bonds.one.swap,
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

      const r = await this.walletProvider.swapBondTx({ from: this.walletProvider.address(), amount: value.amount });

      const tx = await provider.request({
        method: 'eth_sendTransaction',
        params: [r],
      });


      window.open(`${CHAIN[this.walletProvider.chain()].EXPLORER}/${tx}`);
      this.form.reset()

    } catch (e) {
      console.error(e)
      this.alertDialog(e.message)
    } finally {
      this.load.set(false);
      this.loaderProvider.hide();
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
          spender: CHAIN[this.walletProvider.chain()].bonds.one.swap,
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
        spender: CHAIN[this.walletProvider.chain()].bonds.one.swap,
        amount: value.amount
      });
      delete rawData.nonce;

      const data = await this.walletProvider.getWallet()
        .request({
          method: 'eth_sendTransaction',
          params: [rawData],
        });

      const transaction = await this.checkTransaction(data);

      if (!transaction?.status) {
        await this.checkTransactionListener(data);
      }

      const r = await this.walletProvider.swapBondTx({ from: this.walletProvider.address(), amount: value.amount });
      delete r.nonce;

      const tx = await  this.walletProvider.getWallet()
        .request({
          method: 'eth_sendTransaction',
          params: [r],
        });


      window.open(`${CHAIN[this.walletProvider.chain()].EXPLORER}/${tx}`);
      this.form.reset()


    } catch (e) {
      console.error(e)
      this.alertDialog(e.message)
    } finally {
      this.load.set(false);
      this.loaderProvider.hide();
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
  }

  showAPY() {
    this.buttonActive.set(Views.apy);
  }

  showURate() {
    this.buttonActive.set(Views.rate);
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
