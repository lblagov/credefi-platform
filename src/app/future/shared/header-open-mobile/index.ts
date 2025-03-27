import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header-open-mobile',
    templateUrl: './index.html',
    styleUrls: ['./style.scss'],
    imports: [ MatIconModule, CommonModule ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
  })

  export class HeaderOpenMobileComponent {
    public iconArrow = 'ArrowDown';

    changeEarnIcon(): void {
      if (this.iconArrow === 'ArrowDown') {
        this.iconArrow = 'ArrowUp';
      } else {
        this.iconArrow = 'ArrowDown';
      }
      // this.change.markForCheck();
    }
  }