import { NgFor, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Renderer2, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { ErrorPipe } from 'src/app/pipes/error';
import { AccountProvider } from '../../providers';
import { WalletProvider } from '../../providers/wallet/WalletProvider';
import { BusinessProvider } from '../../providers/BusinessProvider';

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
  ],
  standalone: true
})

export class BusinessDialog {

  isSubmit = signal(false);

  form = new FormGroup({
    wallet: new FormControl('', [
      Validators.required,
      Validators.maxLength(255)
    ]),
    company: new FormControl('', [
      Validators.required,
      Validators.maxLength(255)
    ]),
    representive: new FormControl('', [
      Validators.required,
      Validators.maxLength(255)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(255)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.maxLength(255)
    ]),
  },);

  constructor(
    private render: Renderer2,
    public ref: MatDialogRef<BusinessDialog>,
    private wallet: WalletProvider,
    private businessProvider: BusinessProvider
  ) { }

  async onSubmit() {
    if (this.form.valid) {
      this.isSubmit.set(true);
      this.businessProvider.post(this.form.value).subscribe(() => {
        this.isSubmit.set(false);
        this.ref.close();
      });

    }

  }


}
