import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TransactionsComponent } from '../shared/transactions';
import { IncomeChartComponent } from '../shared/income-chart';
import { MatButtonModule } from '@angular/material/button';
import { LazyImage } from '../shared/lazy-image-component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    TransactionsComponent,
    IncomeChartComponent,
    MatButtonModule,
    LazyImage,
    RouterLink
  ]
})

export class DashboardComponent { }
