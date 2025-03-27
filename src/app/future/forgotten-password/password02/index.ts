import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-password02',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  standalone: true,
  imports: [
    MatIconModule, 
    MatFormFieldModule,
    MatInputModule,
    

  ]
})
export class Password02Component {

}
