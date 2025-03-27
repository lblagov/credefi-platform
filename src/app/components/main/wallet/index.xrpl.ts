import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarComponent } from '../shared/sidebar';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from 'src/app/components/main/shared/header';
import { MatButtonModule } from '@angular/material/button';
import { TransactionsComponent } from '../shared/transactions';
import { PortfolioWalletComponent } from '../shared/portfolio-wallet';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateWalletDialog } from '../shared/create-wallet';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ConnectXRPLDialog } from 'src/app/helpers/connectXRPLDialog';

@Component({
  selector: 'app-wallet',
  templateUrl: './index.xrpl.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    SidebarComponent,
    MatIconModule,
    TransactionsComponent,
    PortfolioWalletComponent,
    MatButtonModule,
    MatDialogModule,
  ],
  standalone: true
})
export class WalletComponent extends ConnectXRPLDialog{

  constructor() {
    super();
  }


}
