import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeaderComponent } from 'src/app/components/main/shared/header';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from '../shared/sidebar';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BannerModuleXComponent } from '../shared/banner-module-x';
import { Stake02ModuleXComponent } from '../shared/stake02-module-x';


@Component({
  selector: 'app-stake03',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [SidebarComponent, HeaderComponent, MatDialogModule, MatButtonModule, MatIconModule, MatSelectModule, BannerModuleXComponent, Stake02ModuleXComponent, MatFormFieldModule, MatInputModule],
  standalone: true
})
export class Stake03Component {
  currentPage = "Stake";
  height = "1139px";
  
  title="Long title for banner";
  description="A long description for the banner, which will take at least two lines, remember to write the text here. A long description for the banner, which will take at least two lines, remember to write the text here";
  image = "./assets/images/lendBanner.png";
  
  color1 = "#FFDCDF";
  color2 = "#FFCBD2";
  color3 = "#FFDCDF";

  logoMobile = "logoMobile";
  logoMobile2 = "binanceCoin";
  steakingTitle = "Module X";
  steakingTitle2= "CREDI LP BSC";

  portfolioImage = "dot";

  DATA_COUNT = 7;
  NUMBER_CFG = {count: this.DATA_COUNT, min: 0, max: 100};
  // value = 250000;
  value = 123322;
  disabled = false
  // max = 3000000;
  max = 2098049;
  // min = 250000;
  min = 0;
  showTicks = false;
  step = 1000;
  thumbLabel = false;
  moduleImage = "moduleGreen"
  h5 = "Title"
  p = "Here you need to set aside <br> space for a description, a few lines long"
  moduleImage2 = "moduleRed"
  moduleImage3 = "moduleBrown"

 

  bannerImage = "./assets/images/stakeBanner.png"
  bannerHeader = "Here you need to allocate space for the description, a few lines long. This block will be different from the others, it will also have a slider. There will be four sliders"
  bannerLinearGradient = "background: linear-gradient(120deg, #DFCDEB 0%, #BB96D5 100%);"
  
  buttonStakeCrediLabel = "Stake CREDI LP"

  fn(value) {
    if (value < 1000000) {
      // let a = value / 1000;
      if (value%1000 == 0) {
        var right = "000";
      } else {
        right = (value%1000).toString();
      }
      return Math.floor(value/1000)+"."+right + ".00";
    } else {
      if (value%1000 == 0) {
        var hundred = "000";
      } else {
        hundred = (value%1000).toString();
      }
      if (Math.floor(value/1000) % 1000 == 0) {
        var thousand = "000";
      } else {
        thousand = (Math.floor(value/1000) % 1000).toString();
        if (thousand.length == 1) thousand = "00"+thousand;
        if (thousand.length == 2) thousand = "0"+thousand;
      }
      return Math.floor(value/1000000) + "," + thousand + "." + hundred + ".00";
    }
  }

  stakeButton = ($event): void => {
    this.buttonStakeCrediLabel = "Stake CREDI LP"
    document.querySelector(".stake-available").classList.remove('hide');
    document.querySelector(".dropDown").classList.remove('hide');
    document.querySelector(".button--stake").classList.remove('unstake');
    document.querySelector(".button--unstake").classList.remove('unstake');
    document.querySelector(".button--stake-credi").classList.remove('unstake');
    document.querySelector(".logo").classList.remove('unstake');
    document.querySelector(".stake").classList.remove('unstake');
  }

  unstakeButton = ($event): void => {
    this.buttonStakeCrediLabel = "Unstake CREDI LP"
    document.querySelector(".stake-available").classList.add('hide');
    document.querySelector(".dropDown").classList.add('hide');
    document.querySelector(".button--stake").classList.add('unstake');
    document.querySelector(".button--unstake").classList.add('unstake');
    document.querySelector(".button--stake-credi").classList.add('unstake');
    document.querySelector(".logo").classList.add('unstake');
    document.querySelector(".stake").classList.add('unstake');
  }
}