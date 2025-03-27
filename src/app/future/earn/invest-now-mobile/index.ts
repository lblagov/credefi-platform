import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HeaderComponent } from 'src/app/components/main/shared/header';
// import { HeaderMobileComponent } from 'src/app/components/main/shared/header-mobile';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-invest-now-mobile',
    templateUrl: './index.html',
    styleUrls: ['./style.scss'],
    imports: [
      HeaderComponent,
      MatIconModule,
      MatSelectModule,
      MatInputModule,
      RouterLink,
      // HeaderMobileComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
  })

export class InvestNowMobileComponent {
    active = signal(false);
}