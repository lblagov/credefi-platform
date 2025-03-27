import { Component } from '@angular/core';
import { HeaderComponent } from 'src/app/components/main/shared/header';
import { BannerComponent } from '../../shared/banner';
import { SidebarComponent } from '../../shared/sidebar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Bonds02TableComponent } from '../../shared/bonds02-table/bonds02-table.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bonds02',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [HeaderComponent, BannerComponent, SidebarComponent, RouterLink, RouterLinkActive, MatIconModule, Bonds02TableComponent, MatButtonModule],
  standalone: true
})

export class Bonds02Component {
  title="Long title for banner";
  description="A long description for the banner, which will take at least two lines, remember to write the text here";
  image = "./assets/images/bondsBanner.png"
  currentPage = "Corporate bonds"
  titleColor = "padding-top: 24px;"
  descriptionColor = "#5C68FF"
  imgProps = "width: 517px; height:134px;"

  linearGradient = "background: linear-gradient(138deg, #ECE9DC 0%, #EAE4CB 100%), #D9D9D9;height: 134px;"
  chart: any;
  
  height = "1374px";
  heightValue = 1374;
  tabHeightValue = 290;

  bonds02Id1 = "bonds02-id1";
  bonds02Id2 = "bonds02-id2";
  bonds02Id3 = "bonds02-id3";
  bonds02Id4 = "bonds02-id4";
  bonds02Id5 = "bonds02-id5";
  bonds02Id6 = "bonds02-id6";
  bonds02Id7 = "bonds02-id7";
  bonds02Id8 = "bonds02-id8";

  bondsIcon1 = "microsoft50";
  bondsIcon2 = "google50";
  bondsIcon3 = "apple50";
  bondsIcon4 = "tesla50";
  bondsIcon5 = "facebook50";
  bondsIcon6 = "twitter50";
  bondsIcon7 = "pepsi50";
  bondsIcon8 = "xbox50";

  // slideBonds02Table1 = "slideBonds02Table1";
  // slideBonds02Table2 = "slideBonds02Table2";
  // slideBonds02Table3 = "slideBonds02Table3";
  
  expandBonds02Table1: boolean = true;
  expandBonds02Table2: boolean = true;
  expandBonds02Table3: boolean = true;
  expandBonds02Table4: boolean = true;
  expandBonds02Table5: boolean = true;
  expandBonds02Table6: boolean = true;
  expandBonds02Table7: boolean = true;
  expandBonds02Table8: boolean = true;

  iconArrow = 'whiteArrowDown';

  public iconArrow1 = 'whiteArrowDown';
  public iconArrow2 = 'whiteArrowDown';
  public iconArrow3 = 'whiteArrowDown';
  public iconArrow4 = 'whiteArrowDown';
  public iconArrow5 = 'whiteArrowDown';
  public iconArrow6 = 'whiteArrowDown';
  public iconArrow7 = 'whiteArrowDown';
  public iconArrow8 = 'whiteArrowDown';

  public openTabsNumber = 0;

  slideBonds02Table1 = (args: any): void => {
    if(this.iconArrow1 === 'whiteArrowDown'){
      this.iconArrow1 = 'lightArrowUp';
    }else{
      this.iconArrow1 = 'whiteArrowDown';
    }

    if (this.expandBonds02Table1) {
      this.openTabsNumber += 1
      this.height = (this.heightValue + this.openTabsNumber*this.tabHeightValue).toString() + "px";
      document.querySelector("#bonds02-id1").classList.add('expand');
      document.querySelector("#bonds02-id1 .first-column > mat-icon").classList.remove('fill-white');
      document.querySelector<HTMLElement>("#bonds02-id1 .expanded").classList.remove('hide');
      document.querySelector<HTMLElement>("#bonds02-id1 .first-column > mat-icon").classList.add('add-border');
      document.querySelector<HTMLElement>("#bonds02-id1").classList.add('remove-border');
      this.expandBonds02Table1 = false;
      
    } else {
      this.openTabsNumber -= 1;
      this.height = (this.heightValue + this.openTabsNumber*this.tabHeightValue).toString() + "px";
      document.querySelector<HTMLElement>("#bonds02-id1").classList.remove('expand');
      document.querySelector("#bonds02-id1 .first-column > mat-icon").classList.add('fill-white');
      document.querySelector<HTMLElement>("#bonds02-id1 .expanded").classList.add('hide');
      document.querySelector<HTMLElement>("#bonds02-id1 .first-column > mat-icon").classList.remove('add-border');
      document.querySelector<HTMLElement>("#bonds02-id1").classList.remove('remove-border');
      this.expandBonds02Table1 = true;
    }
  }
  slideBonds02Table2 = (args: any): void => {

    if(this.iconArrow2 === 'whiteArrowDown'){
      this.iconArrow2 = 'lightArrowUp';
    }else{
      this.iconArrow2 = 'whiteArrowDown';
    }

    if (this.expandBonds02Table2) {
      this.openTabsNumber += 1
      this.height = (this.heightValue + this.openTabsNumber*this.tabHeightValue).toString() + "px";
      document.querySelector("#bonds02-id2").classList.add('expand');
      document.querySelector("#bonds02-id2 .first-column > mat-icon").classList.remove('fill-white');
      document.querySelector<HTMLElement>("#bonds02-id2 .expanded").classList.remove('hide');
      document.querySelector<HTMLElement>("#bonds02-id2 .first-column > mat-icon").classList.add('add-border');
      document.querySelector<HTMLElement>("#bonds02-id2").classList.add('remove-border');
      this.expandBonds02Table2 = false;
      
    } else {
      this.openTabsNumber -= 1
      this.height = (this.heightValue + this.openTabsNumber*this.tabHeightValue).toString() + "px";
      document.querySelector<HTMLElement>("#bonds02-id2").classList.remove('expand');
      document.querySelector("#bonds02-id2 .first-column > mat-icon").classList.add('fill-white');
      document.querySelector<HTMLElement>("#bonds02-id2 .expanded").classList.add('hide');
      document.querySelector<HTMLElement>("#bonds02-id2 .first-column > mat-icon").classList.remove('add-border');
      document.querySelector<HTMLElement>("#bonds02-id2").classList.remove('remove-border');
      this.expandBonds02Table2 = true;
    }
  }
  slideBonds02Table3 = (args: any): void => {

    if(this.iconArrow3 === 'whiteArrowDown'){
      this.iconArrow3 = 'lightArrowUp';
    }else{
      this.iconArrow3 = 'whiteArrowDown';
    }

    if (this.expandBonds02Table3) {
      this.openTabsNumber += 1
      this.height = (this.heightValue + this.openTabsNumber*this.tabHeightValue).toString() + "px";
      document.querySelector("#bonds02-id3").classList.add('expand');
      document.querySelector("#bonds02-id3 .first-column > mat-icon").classList.remove('fill-white');
      document.querySelector<HTMLElement>("#bonds02-id3 .expanded").classList.remove('hide');
      document.querySelector<HTMLElement>("#bonds02-id3 .first-column > mat-icon").classList.add('add-border');
      document.querySelector<HTMLElement>("#bonds02-id3").classList.add('remove-border');
      this.expandBonds02Table3 = false;
      
    } else {
      this.openTabsNumber -= 1
      this.height = (this.heightValue + this.openTabsNumber*this.tabHeightValue).toString() + "px";
      document.querySelector<HTMLElement>("#bonds02-id3").classList.remove('expand');
      document.querySelector("#bonds02-id3 .first-column > mat-icon").classList.add('fill-white');
      document.querySelector<HTMLElement>("#bonds02-id3 .expanded").classList.add('hide');
      document.querySelector<HTMLElement>("#bonds02-id3 .first-column > mat-icon").classList.remove('add-border');
      document.querySelector<HTMLElement>("#bonds02-id3").classList.remove('remove-border');
      this.expandBonds02Table3 = true;
    }
  }
  slideBonds02Table4 = (args: any): void => {
  }
  slideBonds02Table5 = (args: any): void => {
  }
  slideBonds02Table6 = (args: any): void => {
  }
  slideBonds02Table7 = (args: any): void => {
  }
  slideBonds02Table8 = (args: any): void => {
  }
}
