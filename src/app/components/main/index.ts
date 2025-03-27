import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar';
import { HeaderComponent } from './shared/header';
import { fadeAnimation } from 'src/app/helpers/animations';
import { CommonModule } from '@angular/common';
// import { TestWallet } from './providers/wallet/TestWallet';

@Component({
    selector: 'app-main',
    templateUrl: './index.html',
    styleUrls: ['./style.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [fadeAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SidebarComponent, HeaderComponent, RouterOutlet,  CommonModule]
})

export class MainComponent {

    constructor(
      //  private testWallet: TestWallet
    ) {
      // this.test()
    }

    // async test(){
    //   await this.testWallet.connect({
    //     chainId: "0x38",
    //     chainName: "Binance",
    //     rpcUrls: ['https://bsc-dataseed.binance.org'],
    //     blockExplorerUrls: "https://bscscan.com",
    //     nativeCurrency: {
    //       name: "Binance",
    //       symbol: "BNB",
    //       decimals: 18
    //     }
    //   });
    //   await this.testWallet.setApprove({
    //    amount: '1',
    //    spender: "0x01521db54f9311cd63ed1710057b3c519b7e935e",
    //     tokenContract: '0xAC9fbdbE486F8023606b932a747BC476011B5071'
    //   })
    // }

}
