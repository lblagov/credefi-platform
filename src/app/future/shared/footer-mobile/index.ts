import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-mobile',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [ MatIconModule, CommonModule ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FooterMobileComponent {

}