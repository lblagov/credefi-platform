import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { track } from 'src/app/helpers/track';
import { WalletXRPLProvider } from 'src/app/components/main/providers/wallet/WalletXRPLProvider';
import { XummDialog } from '../xumm-dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { XummProvider } from '../../providers/wallet/XummProvider';

@Component({
  selector: 'app-wallet-connect-xrpl-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, NgFor, MatRippleModule, MatDialogModule, XummDialog],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletConnectXRPLDialog {

  constructor(
    private ref: MatDialogRef<WalletConnectXRPLDialog>,
    public walletProvider: WalletXRPLProvider,
    private xummWallet: XummProvider,
    private dialog: MatDialog
  ) { }

  async connectGemWallet() {
    try {
      await this.walletProvider.connectGemWallet();
      this.ref.close();
    } catch (error) {
      console.log(error);
    }
  }

  async connectXummWallet() {
    this.xummWallet.request({
      "txjson": {
        "TransactionType": "SignIn"
      },
    }).subscribe(({ result }) => {
      if (result) {
        this.dialog.open(XummDialog, {
          scrollStrategy: new NoopScrollStrategy(),
          autoFocus: false,
          panelClass: 'wallet-dialog',
          backdropClass: 'back-drop-class',
          data: result
        }).afterClosed().subscribe((data) => {
          if(data){
            this.sync(result);
          }
        })
      }
    })
  }

  async connectCrossmarkWallet(){
    try {
      await this.walletProvider.connectCrossmarkWallet();
      this.ref.close();
    } catch (error) {
      console.log(error);
    }
  }

  async sync(result: IObjectKeys) {
    this.xummWallet.get(result.uuid).subscribe(({ result }) => {
      if (result.response.account) {
        this.walletProvider.connectXummWallet(result.response.account);
        this.ref.close();
      }
    });
  }

  track = track
}
