import { NgFor, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Renderer2, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { passwordMatchValidator } from 'src/app/helpers/passwordConfirmValidator';
import { strongPasswordValidator } from 'src/app/helpers/strongPasswordValidator';
import { ErrorPipe } from 'src/app/pipes/error';
import { AccountProvider } from '../../providers';
import { WalletXRPLProvider } from '../../providers/wallet/WalletXRPLProvider';
import { PasswordDirective } from 'src/app/directives/show';

@Component({
  selector: 'app-create-wallet-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    SlicePipe,
    ErrorPipe,
    AutoCompleteDirective,
    NgFor,
    PasswordDirective
  ],
  standalone: true
})

export class CreateWalletDialog {

  isSubmit = signal(false);

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(255)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(255),
      strongPasswordValidator
    ]),
    passwordConfirm: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(255)
    ]),
  }, passwordMatchValidator('password', 'passwordConfirm'));

  constructor(
    private render: Renderer2,
    public ref: MatDialogRef<CreateWalletDialog>,
    private wallet: WalletXRPLProvider,
    private accountProvider: AccountProvider
  ) { }

  async onSubmit() {
    if (this.form.valid) {
      // const { password } = this.form.value;
      // const account = await this.wallet.createAccount({ password });
      // this.isSubmit.set(true);

      // const value: IObjectKeys = this.form.value;
      // value.address = account?.address;
      // value.keyStore = account;

      // this.accountProvider.post(value).subscribe((res: any) => {
      //   this.isSubmit.set(false);
      //   if (res.result) {
      //     this.generateFile(value);
      //     this.ref.close();
      //   }
      // });

    }

  }

  generateFile(data: IObjectKeys) {
    const element = this.render.createElement('a');

    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data.keyStore)));
    element.setAttribute('download', `0x${data.keyStore.address}.json`);
    element.click();
    element.remove();

  }

}
