import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-portfolio-borrow',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class PortfolioBorrowComponent {
  @Input() portfolioName;
  @Input() portfolioImage;

  public height: string = "1567px";

  @Output() heightEvent = new EventEmitter<string>();

 
  constructor(){}

    setHeight() {
      // console.log(this.height)
      this.heightEvent.emit(this.height)
    }
  


  expandPortfolioBorrow: boolean = true;
  public iconArrow = 'whiteArrowDown';

  slidePortfolioBorrow(): void {
    // document.querySelector<HTMLElement>(".wrapper").style.backgroundColor = "khaki"; 
    if(this.iconArrow === 'whiteArrowDown'){
      this.iconArrow = 'lightArrowUp';
      this.height = "1567px";
    }else{
      this.iconArrow = 'whiteArrowDown';
      
      this.height = "1279px";
    }
    this.setHeight()


    if (this.expandPortfolioBorrow) {
      document.querySelector<HTMLElement>(".wrapper-portfolio-borrow").classList.add('expand');
      document.querySelector<HTMLElement>(".expanded").classList.remove('hide');
      document.querySelector<HTMLElement>(".first-column > mat-icon").classList.add('add-border');
      document.querySelector<HTMLElement>(".chart-table").classList.add('remove-border');
      this.expandPortfolioBorrow = false;
      
    } else {
      document.querySelector<HTMLElement>(".wrapper-portfolio-borrow").classList.remove('expand');
      document.querySelector<HTMLElement>(".expanded").classList.add('hide');
      document.querySelector<HTMLElement>(".first-column > mat-icon").classList.remove('add-border');
      document.querySelector<HTMLElement>(".chart-table").classList.remove('remove-border');
      this.expandPortfolioBorrow = true;
    }
  }
}
