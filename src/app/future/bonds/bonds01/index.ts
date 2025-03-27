import { Component } from '@angular/core';
import { HeaderComponent } from 'src/app/components/main/shared/header';
import { BannerComponent } from '../../shared/banner';
import { SidebarComponent } from '../../shared/sidebar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Bonds01TableComponent } from '../../shared/bonds01-table';
import { MatButtonModule } from '@angular/material/button';
import { BannerMobileLendComponent } from '../../shared/banner-mobile-lend';
import { BontsPortfolioMobilePComponent } from '../../bonds-portfolio-mobile';

@Component({
  selector: 'app-bonds01',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [HeaderComponent, BannerComponent,BontsPortfolioMobilePComponent, SidebarComponent, RouterLink, RouterLinkActive, MatIconModule, Bonds01TableComponent, MatButtonModule,BannerMobileLendComponent],
  standalone: true
})
export class Bonds01Component {
  title = "Long title for banner";
  description = "A long description for the banner, which will take at least two lines, remember to write the text here";
  image = "./assets/images/bondsBanner.png"
  currentPage = "Corporate bonds"
  titleColor = "padding-top: 24px;"
  descriptionColor = "#5C68FF"
  imgProps = "width: 517px; height:134px;"

  linearGradient = "background: linear-gradient(138deg, #ECE9DC 0%, #EAE4CB 100%), #D9D9D9;height: 134px;"
  chart: any;
  height = "1588px";

  
  linearGradientMobile = "background: linear-gradient(138deg, #ECE9DC 0%, #EAE4CB 100%), #D9D9D9;"
  imgPropsMobile = "width: 312px; height:193px;"
  imageMobile = "./assets/images/bondsBannerMobile.png"
  descriptionMobile = "A long description for the banner, which will take at least two lines,";


  portfolioImage = "google50"
  portfolioName = "Name of bond"
  coinValue = "5 000 000 USD"
  portfolioImageSide = "sideSlide"

  portfolioImage2 = "apple50"
  portfolioName2 = "Balanced"

  portfolioImage3 = "microsoft50"
  portfolioName3 = "Agressive"

  portfolioImage4 = "tesla50"
  portfolioName4 = "Venture"

  portfolioImage5 = "facebook50"
  portfolioName5 = "Plain Vanilla"

  portfolioImage6 = "twitter50"
  portfolioName6 = "Plain Vanilla"


  portfolioImage7 = "nike50"
  portfolioImage8 = "pepsi50"
  portfolioImage9 = "adidas50"
  portfolioImage10 = "xbox50"
  
  public iconArrow = 'whiteArrowDown';

  

}
