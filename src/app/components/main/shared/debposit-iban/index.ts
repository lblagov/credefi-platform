import { KeyValuePipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CopyDirective } from 'src/app/directives/copy';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { Environment } from 'src/globals';

@Component({
  selector: 'app-deposit-iban-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatRippleModule, MatButtonModule, CopyDirective, KeyValuePipe, NgFor],
  standalone: true
})

export class DepositIbanDialog {

  api_url = Environment.api_url;

  constructor(
    public ref: MatDialogRef<DepositIbanDialog>,
     @Inject(MAT_DIALOG_DATA) public data: IObjectKeys

  ) { }

}
