import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { Environment } from 'src/globals';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, MatRippleModule, MatButtonModule],
  standalone: true
}) 

export class AlertDialog {

  api_url = Environment.api_url;

  constructor(
    public ref: MatDialogRef<AlertDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IObjectKeys,
  ) { }

}
