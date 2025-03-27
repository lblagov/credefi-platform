import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LazyImage } from '../shared/lazy-image-component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [LazyImage],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {

  constructor(private location: Location) { }

  back() {
    this.location.back();
  }


}
