import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header-mobile',
    templateUrl: './index.html',
    styleUrls: ['./style.scss'],
    imports: [ MatIconModule, CommonModule, RouterLink ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
  })

  export class HeaderMobileComponent {
    public iconArrow = 'ArrowDown';
    public iconMenu  = 'menuOpen';

    changeEarnIcon(): void {
      if (this.iconArrow === 'ArrowDown') {
        this.iconArrow = 'ArrowUp';
      } else {
        this.iconArrow = 'ArrowDown';
      }
      // this.change.markForCheck();
    }
    
    changeMenuIcon(): void {
      if (this.iconMenu === 'menuOpen') {
        this.iconMenu = 'menuClose';
      } else {
        this.iconMenu = 'menuOpen';
      }
      // this.change.markForCheck();
    }
  }