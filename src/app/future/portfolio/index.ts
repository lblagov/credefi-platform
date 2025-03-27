import { Component,Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-portfolio',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule],
  standalone: true
})
export class PortfolioComponent {
  @Input() portfolioName;
  @Input() portfolioImage;

  public withdraw(){
    console.log("withdorw")
  }
}
