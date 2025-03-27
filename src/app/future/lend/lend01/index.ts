import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from 'src/app/components/main/shared/header';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from '../../shared/sidebar';
import { BannerComponent } from '../../shared/banner';
import { BannerMobileLendComponent } from '../../shared/banner-mobile-lend';

import { PortfolioComponent } from '../../portfolio';
import { PortfolioMobileComponent } from '../../portfolio-mobile';

import { BarChartComponent } from '../../shared/bar-chart';
import { BarChartMobileComponent } from '../../shared/bar-chart-mobile';

import { IncomeBarModel } from 'src/app/model/income.bar.model';
import { BarModel } from 'src/app/model/bar.model';
import { PopUpWarningComponent } from '../../shared/pop-up-warning';

@Component({
  selector: 'app-lend01',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [SidebarComponent, HeaderComponent, BannerComponent, PortfolioComponent,PortfolioMobileComponent, BarChartComponent, MatDialogModule, MatButtonModule,BannerMobileLendComponent,BarChartMobileComponent],
  standalone: true
})
export class Lend01Component {

  constructor(
    private matDialog: MatDialog) {
  }
  public BarData: Array<BarModel> = [

    { Value: 60, Color: 'linear-gradient(to bottom, #FFF171 , rgba(255, 239, 102, 0))', Size: '10', Legend: '', name: 'Venture' },
    { Value: 25, Color: 'linear-gradient(to bottom, #FF8282 , rgba(255, 130, 130, 0))', Size: '20', Legend: '', name: 'Agressive' },
    { Value: 50, Color: 'linear-gradient(to bottom, #76BDFF , rgba(122, 191, 255, 0))', Size: '30', Legend: '', name: 'Balanced' },
    { Value: 80, Color: 'linear-gradient(to bottom, #7D77FF , rgba(128, 123, 255, 0))', Size: '40', Legend: '', name: 'Plain Vanilla' },
  ];



  public IncomeBarData: Array<IncomeBarModel> = [

    { Value: 60, Color: 'linear-gradient(to bottom, #FFF171 , rgba(255, 239, 102, 0))', Size: '10', Legend: '', name: 'Venture' },
    { Value: 25, Color: 'linear-gradient(to bottom, #FF8282 , rgba(255, 130, 130, 0))', Size: '20', Legend: '', name: 'Agressive' },
    { Value: 50, Color: 'linear-gradient(to bottom, #76BDFF , rgba(122, 191, 255, 0))', Size: '30', Legend: '', name: 'Balanced' },
    { Value: 80, Color: 'linear-gradient(to bottom, #7D77FF , rgba(128, 123, 255, 0))', Size: '40', Legend: '', name: 'Plain Vanilla' },
  ];

  portfolioImage = "dot"
  portfolioName = "Plain Vanilla"

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








  title = "Long title for banner";
  description = "A long description for the banner, which will take at least two lines, remember to write the text here. A long description for the banner, which will take at least two lines, remember to write the text here";
  image = "./assets/images/lendBanner.png"
  imageMobile = "./assets/images/lendBannerMobile.png"
  imgPropsMobile = "width: 312px; height:193px;"
  linearGradientMobile = "background: linear-gradient(138deg, #FFDCDF 0%, #FFCBD2 100%);"

  currentPage = "Lend"
  titleColor = "#6FACFF"
  descriptionColor = "color: rgba(7, 7, 7, 0.7)"
  imgProps = "width: 533px; height:166px;"
  linearGradient = "background: linear-gradient(138deg, #FFDCDF 0%, #FFCBD2 100%);  height:166px;"
  chart: any;
  height = "1570px";

  descriptionMobile = "A long description for the banner, which will take at least two lines, remember to write the text here.";


  chartOptions = {
    animationEnabled: true,
    axisY: {
      includeZero: true,
      suffix: "K"
    },
    data: [{
      type: "bar",
      indexLabel: "{y}",
      yValueFormatString: "#,###K",
      dataPoints: [
        { label: "Agressive", y: 25 },
        { label: "Balanced", y: 50 },
        { label: "Venture", y: 60 },
        { label: "Plain Vanilla", y: 73 }
      ]
    }]
  }


  public lendNow() {
    // document.querySelector('#container-lend').classList.add('blur');
    this.matDialog.open(PopUpWarningComponent, {
      panelClass: 'dialog-side-panel',
      width: '398px',
      height: '415px',


    })

  }

}
