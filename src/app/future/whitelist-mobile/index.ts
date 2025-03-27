import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-whitelist-mobile',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  standalone: true,
  imports: [MatIconModule]
})
export class WhitelistMobileComponent {
   currentPage = "Whitelist"
   height = "982px"
}
