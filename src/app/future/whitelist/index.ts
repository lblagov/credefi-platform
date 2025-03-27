import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { WhitelistMobileComponent } from "../whitelist-mobile";

@Component({
  selector: 'app-whitelist',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  standalone: true,
  imports: [MatIconModule, NgIf, WhitelistMobileComponent]
})

export class WhitelistComponent {
   currentPage = "Whitelist"
   height = "982px"
   isMobile: boolean = false;

   constructor() {
    this.isMobile = window.outerWidth <= 700;
  }
}
