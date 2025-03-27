import { Component,Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-portfolio-mobile',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule],
  standalone: true
})
export class PortfolioMobileComponent {
  @Input() portfolioName;
  @Input() portfolioImage;
  

  public withdraw(){
    console.log("withdorw")
  }


  public iconArrow = 'whiteArrowDown';

  changeImage(): void {
    // document.querySelector<HTMLElement>(".wrapper").style.backgroundColor = "khaki"; 
    if(this.iconArrow === 'whiteArrowDown'){
      this.iconArrow = 'lightArrowUp';
    }else{
      this.iconArrow = 'whiteArrowDown';
      
    }
  }
}
