import { Component, ChangeDetectionStrategy, Inject, HostListener, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { WINDOW } from 'src/app/modules/window';
import { LazyImage } from '../lazy-image-component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SafeHTMLPipe } from 'src/app/pipes/safe-html';
import { MatInputModule } from '@angular/material/input';
import { NgFor, SlicePipe } from '@angular/common';
import { ErrorPipe } from 'src/app/pipes/error';

@Component({
  selector: 'authneticator-code-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatRippleModule, LazyImage, MatCheckboxModule, MatSnackBarModule, SafeHTMLPipe, MatInputModule, NgFor, SlicePipe, ErrorPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AuthneticatorCodeDialog {

  submitted = signal(false);
  translations: { [key: string]: string | Function | any } = this.data.translations;

  form = new FormGroup({
    code: new FormControl({
      value: this.data.code,
      disabled: true
    }, [
      Validators.required,
    ]),
    read: new FormControl(false, [
      Validators.requiredTrue,
    ]),
  });

  constructor(
    private MatSnackBar: MatSnackBar,
    @Inject(WINDOW) public window: IObjectKeys,
    private MatDialogRef: MatDialogRef<AuthneticatorCodeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IObjectKeys
  ) {
    this.MatDialogRef.disableClose = true;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeClose($event: IObjectKeys) {
    return this.form.value.read;
  }

  onSubmit() {
    this.submitted.set(true);
    this.close();
  }

  close() {
    if (this.form.valid) {
      this.MatDialogRef.close();
    }
  }

  async copy() {
    try {
      await this.window.navigator.clipboard.writeText(this.data.code);
      this.MatSnackBar.open(this.translations['snackbar'], 'OK', {
        duration: 3000
      });
    } catch (e) {
      console.log(e);
    }
  }

}
