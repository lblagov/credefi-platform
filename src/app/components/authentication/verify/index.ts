import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LazyImage } from '../../main/shared/lazy-image-component';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-verify',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, RouterLink, LazyImage, MatRippleModule],
  standalone: true
})

export class VerifyComponent { }
