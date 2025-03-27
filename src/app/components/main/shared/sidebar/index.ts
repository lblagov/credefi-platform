import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WalletProvider } from '../../providers/wallet/WalletProvider';
import { CHAIN } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, RouterLink, RouterLinkActive, NgIf],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SidebarComponent  {

  active = signal<string>('');
  wallet = inject(WalletProvider);

  constructor() { }

  isXcrediStakingActive(){
    return CHAIN[this.wallet.chain()].xcrediStake
  }

  setActive(action: string){
    if(this.active() == action){
      this.active.set('');
    }else{
      this.active.set(action);
    }
  }


}

