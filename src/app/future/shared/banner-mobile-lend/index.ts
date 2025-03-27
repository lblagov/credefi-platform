import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-banner-mobile-lend',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [CommonModule,
    MatIconModule],
  standalone: true
})

export class BannerMobileLendComponent {

  @Input() title;
  @Input() titleColor;
  @Input() description;
  @Input() descriptionColor;
  @Input() image;
  @Input() imgProps;
  @Input() linearGradient;
  @Input() showCarosel;


}
