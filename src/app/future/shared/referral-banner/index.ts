import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-referral-banner',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule ]
})
export class ReferralBannerComponent {
 public invite(){
    console.log("invite")
 }
}
