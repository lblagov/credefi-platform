import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { AlertDialog } from '../alert';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-portfolio-staking',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, DatePipe, DecimalPipe, MatRippleModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})

export class PortfolioStakingComponent {
  @Input() portfolioImage: string;
  @Input() data: IObjectKeys;

  dialog = inject(MatDialog);

  alert(){
    this.dialog.open(AlertDialog, {
      scrollStrategy: new NoopScrollStrategy(),
      backdropClass: 'back-drop-class',
      panelClass: 'wallet-dialog',
      data: {
        title: '$xCREDI LP',
        message: 'Rewards and LP tokens are already automatically distributed please check your wallet',
        button: 'OK'
      }
    });
  }
}
