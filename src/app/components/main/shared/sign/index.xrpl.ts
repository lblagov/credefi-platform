import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { ErrorPipe } from 'src/app/pipes/error';
import { WalletXRPLProvider } from 'src/app/components/main/providers/wallet/WalletXRPLProvider';

@Component({
  selector: 'app-sign-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, MatRippleModule, MatButtonModule, MatInputModule, ReactiveFormsModule, SlicePipe, ErrorPipe, AutoCompleteDirective, NgFor, NgIf],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SignDialog {

  isSubmit = false;

  form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(
    public ref: MatDialogRef<SignDialog>,
    private wallet: WalletXRPLProvider,
    private change: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private rawTx: IObjectKeys
  ) { }

  async onSubmit() {

    // if (this.form.valid) {
    //   const { password } = this.form.value;
    //   this.isSubmit = true;
    //   try {
    //     const data = await this.wallet.getPrivKey(this.wallet.wallet().data.keyStore, password);
    //     const sign = await this.wallet.signAndSend(this.rawTx, data.privateKey);
    //     this.ref.close();
    //   } catch (e) {
    //     this.form.get('password')?.setErrors({
    //       walletPassword: true
    //     });
    //     this.change.markForCheck();
    //   }finally{
    //     this.isSubmit = false;
    //     this.change.markForCheck();
    //   }
    // }
  }

}
