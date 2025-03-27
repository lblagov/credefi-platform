import { Component,Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-borrow-portfolio-mobile',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule],
  standalone: true
})
export class BorrowPortfolioMobilePComponent {
  @Input() portfolioName;
  @Input() portfolioImage;
  

 

  public iconArrow = 'arrowRight';

  changeImage(): void {
    if(this.iconArrow === 'arrowRight'){
      this.iconArrow = 'arrowLeft';
    }else{
      this.iconArrow = 'arrowRight';
      
    }
  }
}
