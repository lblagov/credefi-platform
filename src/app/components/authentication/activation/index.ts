import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationProvider } from '../providers/AuthenticationProvider';
import { RouterLink } from '@angular/router';
import { LazyImage } from '../../main/shared/lazy-image-component';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-activation',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, RouterLink, LazyImage, MatRippleModule],
  standalone: true
})

export class ActivationComponent {

  @Input() token: string;

  constructor(
    private authenticationProvider: AuthenticationProvider
  ) { }

  ngOnInit() {
    this.authenticationProvider.postActivation(this.token).subscribe();
  }

}
