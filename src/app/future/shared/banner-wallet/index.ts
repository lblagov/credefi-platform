import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-banner-wallet',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class BannerWalletComponent {
  @Input() description;
  @Input() image;
  @Input() color;



}
