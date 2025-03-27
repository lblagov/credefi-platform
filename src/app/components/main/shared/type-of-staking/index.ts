import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-type-of-staking',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, DecimalPipe, MatRippleModule, RouterLink],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeOfStakingComponent {

  @Input() logoMobile: string;
  @Input() stakingTitle: string;
  @Output() onClick = new EventEmitter();
  @Input() balance = 0;
  @Input() ar = 0;

}
