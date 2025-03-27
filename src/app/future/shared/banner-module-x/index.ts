import { Component, Input } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-banner-module-x',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule],
  standalone: true
})
export class BannerModuleXComponent {
  @Input()  bannerImage
  @Input() bannerHeader
  @Input() bannerLinearGradient
}
