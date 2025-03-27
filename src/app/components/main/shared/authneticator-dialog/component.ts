import { Component, ChangeDetectionStrategy, Inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { WINDOW } from 'src/app/modules/window';
import { UserProvider } from 'src/app/providers';
import { LazyImage } from '../lazy-image-component';
import { MatInputModule } from '@angular/material/input';
import { NgFor, SlicePipe } from '@angular/common';
import { ErrorPipe } from 'src/app/pipes/error';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'authneticator-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatRippleModule, LazyImage, MatInputModule, SlicePipe, ErrorPipe, NgFor, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuthneticatorDialog {

  isSubmit = signal(false);
  qrCode: string;
  translations: { [key: string]: string | Function | any } = this.data.translations;

  form = new FormGroup({
    code: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(
    private userProvider: UserProvider,
    @Inject(WINDOW) public window: IObjectKeys,
    private MatDialogRef: MatDialogRef<AuthneticatorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IObjectKeys
  ) {
    const { qrCode } = data;

    const blob = new Blob([qrCode], { type: "image/svg+xml" });
    const urlCreator = this.window.URL || this.window.webkitURL;
    this.qrCode = urlCreator.createObjectURL(blob);
  }

  onSubmit() {
    if (this.form.valid) {
      this.isSubmit.set(true);
      this.userProvider.gaActivate(this.form.value).subscribe(({ errors, result }) => {
        this.isSubmit.set(false);
        if (result) {
          return this.MatDialogRef.close(result);
        }
        if (errors) {
          for (let key in errors) {
            const parsedErrors = errors[key].map((item: string) => {
              return this.translations[item];
            });
            this.form.controls[key].setErrors({ 'incorrect': parsedErrors });
          }
        }
      });
    }
  }

  close() {
    this.MatDialogRef.close();
  }

}
