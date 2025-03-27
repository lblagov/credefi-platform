import { Component, Input } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stake02-module-x',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule],
  standalone: true
})
export class Stake02ModuleXComponent {
  @Input() moduleImage;
  @Input() h5;
  @Input() p;
}
