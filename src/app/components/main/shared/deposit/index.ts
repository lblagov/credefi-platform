import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CopyDirective } from 'src/app/directives/copy';
import { Environment } from 'src/globals';
import { WalletProvider } from '../../providers/wallet/WalletProvider';

@Component({
  selector: 'app-deposit-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatRippleModule, MatButtonModule, CopyDirective],
  standalone: true
})

export class DepositDialog {

  api_url = Environment.api_url;

  constructor(
    public ref: MatDialogRef<DepositDialog>,
    public wallet: WalletProvider
  ) { }

}
