import { ChangeDetectionStrategy, Component, } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './index.xrpl.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SidebarComponent  {


}

