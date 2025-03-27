import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-banner-wallet-mobile',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatButtonModule, MatButtonModule],
  standalone: true
})
export class BannerWalletMobileComponent {
  @Input() descriptionMobile;
  @Input() imageMobile;
  @Input() colorMobile;

}
