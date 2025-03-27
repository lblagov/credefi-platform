import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar';
import { HeaderComponent } from 'src/app/components/main/shared/header';
import { BannerComponent } from '../../shared/banner';
import { RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BannerMobileLendComponent } from '../../shared/banner-mobile-lend';
import { BontsPortfolioMobilePComponent } from '../../bonds-portfolio-mobile';

@Component({
  selector: 'app-p2p01',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [SidebarComponent, HeaderComponent,BontsPortfolioMobilePComponent, BannerComponent, RouterLinkActive, MatIconModule, MatButtonModule,BannerMobileLendComponent],
  standalone: true
})
export class P2p01Component {
  title = "Long title for banner";
  description = "A long description for the banner, which will take at least two lines, remember to write the text here";
  image = "./assets/images/p2pBanner.png"
  currentPage = "P2P Lending"
  linearGradient = "background: linear-gradient(91.78deg, #E7EEFA, #BCD4ED);height: 134px;"
  chart: any;
  height = "1588px";
  titleColor = "padding-top: 24px;"
  descriptionColor = "color: rgba(7, 7, 7, 0.4);"
  imgProps = "width: 517px; height:134px;"

  linearGradientMobile = "background: linear-gradient(137deg, #E7EEFA 0%, #BCD4ED 100%);"
  imgPropsMobile = "width: 312px; height:193px;"
  imageMobile = "./assets/images/p2pBannerMobile.png"
  descriptionMobile = "A long description for the banner, which will take at least two lines,";
  titleColorMobile = "padding-top: 0px;"


  portfolioImage = "google50"
  close = "Close"
  open = "Open"


  investNow = "Invest Now"

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

  setBackground1: boolean = true;
  setBackground2: boolean = true;
  setBackground3: boolean = true;
  setBackground4: boolean = true;
  setBackground5: boolean = true;
  setBackground6: boolean = true;
  setBackground7: boolean = true;
  setBackground8: boolean = true;
  setBackground9: boolean = true;
  setBackground10: boolean = true;


  p2pId1 = "p2pId1";
  p2pId2 = "p2pId2";

  openCloseColor = "color: rgba(166, 68, 68, 1); background-color: rgba(166, 68, 68, 0.10); border: 1px solid #A64444"
  investNowColor = "color: rgba(7, 7, 7, 0.4);  background-color: #F3F4FA"

  public iconArrow = 'whiteArrowDown';

  changeImage1(): void {
    
    if(this.iconArrow === 'whiteArrowDown'){
      this.iconArrow = 'lightArrowUp';  

    document.querySelector("#p2pId1").classList.add('change-background');
    document.querySelector("#p2pId1 .hide").classList.remove('hide');
    document.querySelector("#p2pId1").classList.add('expand');
    document.querySelector("#p2pId1").classList.add('remove-border');
    }else{
    document.querySelector("#p2pId1").classList.remove('change-background');
    document.querySelector("#p2pId1 .expanded").classList.add('hide');
    document.querySelector("#p2pId1").classList.remove('expand');
    document.querySelector("#p2pId1").classList.remove('remove-border');


      this.iconArrow = 'whiteArrowDown';

    }
  }


  changeImage2(): void {
    
    if(this.iconArrow === 'whiteArrowDown'){
      this.iconArrow = 'lightArrowUp';
      document.querySelector("#p2pId2").classList.add('change-background');
      document.querySelector("#p2pId2 .hide").classList.remove('hide');
      document.querySelector("#p2pId2").classList.add('expand');
      document.querySelector("#p2pId2").classList.add('remove-border');
      }else{
      document.querySelector("#p2pId2").classList.remove('change-background');
      document.querySelector("#p2pId2 .expanded").classList.add('hide');
      document.querySelector("#p2pId2").classList.remove('expand');
      document.querySelector("#p2pId2").classList.remove('remove-border');

      this.iconArrow = 'whiteArrowDown';

    }
  }


  changeBackground1() {

    if (this.setBackground1) {
      document.querySelector('#bonds-id1').classList.add('set-background-white');
      this.setBackground1 = false;
    }
    else {
      document.querySelector('#bonds-id1').classList.remove('set-background-white');
      this.setBackground1 = true;
    }

  }

  changeBackground2() {
    if (this.setBackground2) {
      document.querySelector('#bonds-id2').classList.add('set-background-white');
      this.setBackground2 = false;
    }
    else {
      document.querySelector('#bonds-id2').classList.remove('set-background-white');
      this.setBackground2 = true;
    }

  }

  changeBackground3() {
    if (this.setBackground3) {
      document.querySelector('#bonds-id3').classList.add('set-background-white');
      this.setBackground3 = false;
    }
    else {
      document.querySelector('#bonds-id3').classList.remove('set-background-white');
      this.setBackground3 = true;
    }
  }

  changeBackground4() {
    if (this.setBackground4) {
      document.querySelector('#bonds-id4').classList.add('set-background-white');
      this.setBackground4 = false;
    }
    else {
      document.querySelector('#bonds-id4').classList.remove('set-background-white');
      this.setBackground4 = true;
    }
  }

  changeBackground5() {
    if (this.setBackground5) {
      document.querySelector('#bonds-id5').classList.add('set-background-white');
      this.setBackground5 = false;
    }
    else {
      document.querySelector('#bonds-id5').classList.remove('set-background-white');
      this.setBackground5 = true;
    }
  }

  changeBackground6() {
    if (this.setBackground6) {
      document.querySelector('#bonds-id6').classList.add('set-background-white');
      this.setBackground6 = false;
    }
    else {
      document.querySelector('#bonds-id6').classList.remove('set-background-white');
      this.setBackground6 = true;
    }
  }

  changeBackground7() {
    if (this.setBackground7) {
      document.querySelector('#bonds-id7').classList.add('set-background-white');
      this.setBackground7 = false;
    }
    else {
      document.querySelector('#bonds-id7').classList.remove('set-background-white');
      this.setBackground7 = true;
    }
  }

  changeBackground8() {
    if (this.setBackground8) {
      document.querySelector('#bonds-id8').classList.add('set-background-white');
      this.setBackground8 = false;
    }
    else {
      document.querySelector('#bonds-id8').classList.remove('set-background-white');
      this.setBackground8 = true;
    }
  }

  changeBackground9() {
    if (this.setBackground9) {
      document.querySelector('#bonds-id9').classList.add('set-background-white');
      this.setBackground9 = false;
    }
    else {
      document.querySelector('#bonds-id9').classList.remove('set-background-white');
      this.setBackground9 = true;
    }
  }


  changeBackground10() {
    if (this.setBackground10) {
      document.querySelector('#bonds-id10').classList.add('set-background-white');
      this.setBackground10 = false;
    }
    else {
      document.querySelector('#bonds-id10').classList.remove('set-background-white');
      this.setBackground10 = true;
    }
  }



}
