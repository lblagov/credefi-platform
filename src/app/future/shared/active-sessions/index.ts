import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-active-sessions',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule]
})
export class ActiveSessionsComponent {
  @Input() svgIcon;
  @Input() sessionName;
  @Input() sessionLocation;
  @Input() showxClose;
}
