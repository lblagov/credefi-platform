import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SidebarComponent } from 'src/app/components/main/shared/sidebar';
import { HeaderComponent } from 'src/app/components/main/shared/header';
import { BannerComponent } from 'src/app/components/main/shared/banner';
import { PortfolioBorrowComponent } from 'src/app/components/main/shared/portfolio-borrow';
import { MatButtonModule } from '@angular/material/button';
import { BorrowPortfolioMobilePComponent } from '../../borrow-portfolio-mobile';
import { BannerMobileLendComponent } from '../../shared/banner-mobile-lend';


@Component({
  selector: 'app-my-borrow',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarComponent, HeaderComponent, BannerComponent, PortfolioBorrowComponent, MatButtonModule,BorrowPortfolioMobilePComponent,BannerMobileLendComponent],
  standalone: true
})

export class MyBorrowComponent implements OnInit {

  constructor() {

  }
  ngOnInit(): void {

  }

  currentPage = "Borrow";
  height = "1279px";

  title = "Long title for banner";
  description = "A long description for the banner, which will take at least two lines, remember to write the text here. A long description for the banner, which will take at least two lines, remember to write the text here";
  image = "./assets/images/dashboardBanner.png";

  linearGradient = "background: linear-gradient(120deg, #DFCDEB 0%, #BB96D5 100%); height: 166px  ";

  linearGradientMobile = "background: linear-gradient(120deg, #DFCDEB 0%, #BB96D5 100%);"
  imgPropsMobile = "width: 312px; height:193px;"
  imageMobile = "./assets/images/borrowBannerMobile.png"
  descriptionMobile = "A long description for the banner, which will take at least two lines, remember to write the text here.";

  titleColor = "#6FACFF"
  descriptionColor = "#5C68FF"
  imgProps = "width: 530px; height:166px;"


  portfolioImage = "dot"
  portfolioName = "Plain Vanilla"

  portfolioImageSide = "sideSlide"

  portfolioImage2 = "dot2"
  portfolioName2 = "Balanced"

  portfolioImage3 = "dot3"
  portfolioName3 = "Agressive"

  portfolioImage4 = "dot4"
  portfolioName4 = "Venture"

  portfolioImage5 = "dot5"
  portfolioName5 = "Plain Vanilla"

  portfolioImage6 = "dot6"
  portfolioName6 = "Plain Vanilla"


  getHeight($event) {
    this.height = $event
  }


}
