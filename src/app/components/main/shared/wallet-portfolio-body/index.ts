import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-wallet-portfolio-body',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, DecimalPipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletPortfolioBodyComponent {
  @Input() walletBodyCoin: string;
  @Input() walletBodyCrypto: string;
  @Input() walletBodyLong: string;
  @Input() walletBodyValue: number;
  @Input() walletBodyCurrency: string;

}
