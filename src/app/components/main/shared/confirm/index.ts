import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { Environment } from 'src/globals';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatRippleModule, MatButtonModule, MatRippleModule, NgFor],
  standalone: true
})

export class ConfirmDialog {

  api_url = Environment.api_url;

  constructor(
    public ref: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IObjectKeys,
  ) { }

  handler(index: number) {
    if (this.data.buttons && this.data.buttons instanceof Array) {
      const button = this.data.buttons[index];
      if (button.handler instanceof Function) {
        button.handler();
      }
    }
    this.ref.close({ action: false })
  }
}
