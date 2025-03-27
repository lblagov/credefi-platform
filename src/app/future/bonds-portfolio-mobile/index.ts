import { Component,Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bonds-portfolio-mobile',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule],
  standalone: true
})
export class BontsPortfolioMobilePComponent {
  @Input() portfolioName;
  @Input() portfolioImage;
  @Input() coinValue;

  @Input() openClose;
  @Input() investNow;
  @Input() closeStyle;
  @Input() changeImage: (args: any) => void;

  @Input() iconArrow;
  @Input() p2pId1;

  @Input() openCloseColor;
  @Input() investNowColor;

}
