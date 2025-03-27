import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActiveSessionsComponent } from '../shared/active-sessions';
import { ActiveSessionsMobileComponent } from '../shared/active-sessions-mobile';






@Component({
  selector: 'app-user-details',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule, MatFormFieldModule,
    MatButtonModule,ActiveSessionsComponent,
    ActiveSessionsMobileComponent
  ]
})
export class UserDetailsComponent {
  currentPage = "User details"
  height = '1335px';

  svgIcon = 'sessionsApple';
  sessionName = 'TR5502TG';
  sessionLocation = 'Google chrome | 3:18 Ukraine';
  showxClose = 'showxClose';

  svgIcon2 = 'sessionsWindows';
  sessionName2 = 'TR5502TG';
  sessionLocation2 = 'Google chrome | 3:18 Ukraine';
  showxClose2 = 'showxClose';

  svgIcon3 = 'sessionsAndroid';
  sessionName3 = 'TR5502TG';
  sessionLocation3 = 'Google chrome | 3:18 Ukraine';
  showxClose3 = 'showxClose';

  svgIcon4 = 'sessionsApple';
  sessionName4 = 'TR5502TG';
  sessionLocation4 = 'Google chrome | 3:18 Ukraine';
  showxClose4 = 'showxClose';
}
