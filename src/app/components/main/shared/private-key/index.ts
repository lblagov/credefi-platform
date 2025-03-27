import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { ErrorPipe } from 'src/app/pipes/error';
import { WalletProvider } from '../../providers/wallet/WalletProvider';
import { PasswordDirective } from 'src/app/directives/show';

@Component({
  selector: 'app-private-key-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
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
    NgIf,
    PasswordDirective
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PrivateKeyDialog {

  isSubmit = signal(false);
  privateKey = signal('');

  form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(
    public ref: MatDialogRef<PrivateKeyDialog>,
    private wallet: WalletProvider
  ) { }

  async onSubmit() {

    this.privateKey.set('');

    if (this.form.valid) {
      const { password } = this.form.value;
      this.isSubmit.set(true);
      try {
        const data = await this.wallet.getPrivKey(this.wallet.wallet().data.keyStore, password);
        this.privateKey.set(data.privateKey);
      } catch (e) {
        this.form.get('password')?.setErrors({
          walletPassword: true
        });
      }
      this.isSubmit.set(false);
    }
  }

}
