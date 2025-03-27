import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { track } from 'src/app/helpers/track';
import { AppWalletConnectDialog } from '../app-wallet-connect-dialog';
import { Web3Modal } from '@web3modal/html'
import { WalletProvider } from '../../providers/wallet/WalletProvider';
import { WINDOW } from 'src/app/modules/window';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { MobileWidth } from 'src/globals';
import { CHAIN } from 'src/environments/environment';

@Component({
  selector: 'app-wallet-connect-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, NgFor, MatRippleModule, MatButtonModule, AppWalletConnectDialog, NgIf],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletConnectDialog {

  isMobile = false;

  constructor(
    public ref: MatDialogRef<WalletConnectDialog>,
    public walletProvider: WalletProvider,
    @Inject(MAT_DIALOG_DATA) public data,
    @Inject(WINDOW) public window: IObjectKeys
  ) {
    if(this.window.innerWidth <= MobileWidth){
      this.isMobile = true;
    }
  }

  async connectMetamask() {
    try {
      await this.walletProvider.connectMetamask();
      this.ref.close();
    } catch (error) {
      console.log(error);
    }
  }

  async connectOKX() {
    try {
      await this.walletProvider.connectOKX();
      this.ref.close();
    } catch (error) {
      console.log(error);
    }
  }

  async walletConnect() {
    try {

      const projectId = CHAIN[this.walletProvider.chain()].WALLET_CONNECT.projectId;
      this.walletProvider.generateWagmi();

      const web3modal = new Web3Modal({ projectId, themeMode: 'dark' }, this.walletProvider.ethereumClient);

      if(this.walletProvider.address()){
        var uri = await this.walletProvider.walletConnect(() => {
          web3modal.closeModal();
        }, true);

      }else{
        var uri = await this.walletProvider.walletConnect(() => {
          web3modal.closeModal();
        });

      }


      if(uri){
        await web3modal.openModal({
          uri,
          standaloneChains: ["eip155:1"],
        });
      }


      this.ref.close();
    } catch (error) {
      console.log(error);
    }
  }

  async connect(index: number) {
    const wallet = this.data[index];
    this.walletProvider.setWallet(wallet);
    this.ref.close();
  }

  track = track
}
