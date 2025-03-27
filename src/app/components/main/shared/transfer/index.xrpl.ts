import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { InputNumberDirective } from 'src/app/directives/number';
import { track } from 'src/app/helpers/track';
import { ErrorPipe } from 'src/app/pipes/error';
import { WalletXRPLProvider } from 'src/app/components/main/providers/wallet/WalletXRPLProvider';
import { CurrencyTypes, WalletTypes } from 'src/globals';
import { XummDialog } from '../xumm-dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { xrpToDrops } from 'xrpl';
import { XRPL_TOKENS } from 'src/environments/environment.xrpl';
import { XummProvider } from '../../providers/wallet/XummProvider';

@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    SlicePipe,
    ErrorPipe,
    AutoCompleteDirective,
    InputNumberDirective,
    MatDialogModule,
    NgFor,
    NgIf,
  ],
  standalone: true
})

export class TransferDialog {

  isSubmit = signal(false);

  currencies = [
    {
      name: 'XRPL',
      type: CurrencyTypes.xrpl
    },
    {
      name: 'RLUSD',
      type: CurrencyTypes.usd
    },
    {
      name: 'EUR',
      type: CurrencyTypes.eur
    }
  ];

  form = new FormGroup({
    currency: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
    ]),
    wallet: new FormControl(null, [
      Validators.required,
    ]),
  });

  constructor(
    private wallet: WalletXRPLProvider,
    public ref: MatDialogRef<TransferDialog>,
    private xummWallet: XummProvider,
    private dialog: MatDialog
  ) { }

  async onSubmit() {

    if (this.form.invalid) {
      return false;
    }

    try {

      this.isSubmit.set(true);

      switch (this.wallet.wallet().type) {
        case (WalletTypes.gemwallet): {
          await this.trasnferGemWallet();
          this.ref.close(true);
          break
        }
        case (WalletTypes.crosswallet): {
          await this.trasnferCrossWallet();
          this.ref.close(true);
          break
        }
        case (WalletTypes.xumm): {
          this.trasnferXUMWallet();
          break;
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.isSubmit.set(false);
    }

  }

  async trasnferGemWallet() {
    const value = this.form.value;

    switch (value.currency) {
      case (CurrencyTypes.xrpl): {
        await this.wallet.transactionGemWallet({
          amount: value.amount,
          destination: value.wallet
        })
        break;
      }
      case (CurrencyTypes.usd): {
        const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.usd);
        const currency = XRPL_TOKENS[index];
        await this.wallet.transactionTokenGemWallet({
          currency: {
            currency: currency.address,
            issuer: currency.issuer,
            value: value.amount.toString()
          },
          destination: value.wallet
        })
        break;
      }
      case (CurrencyTypes.eur): {
        const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.eur);
        const currency = XRPL_TOKENS[index];
        await this.wallet.transactionTokenGemWallet({
          currency: {
            currency: currency.address,
            issuer: currency.issuer,
            value: value.amount.toString()
          },
          destination: value.wallet
        })
        break;
      }
    }
  }

  async trasnferXUMWallet() {
    const value = this.form.value;
    switch (value.currency) {
      case (CurrencyTypes.xrpl): {
        this.xummWallet.request({
          "TransactionType": "Payment",
          "Destination": value.wallet,
          "Amount": xrpToDrops(value.amount),
        }).subscribe(({ result }) => {
          if (result) {
            this.dialog.open(XummDialog, {
              scrollStrategy: new NoopScrollStrategy(),
              autoFocus: false,
              panelClass: 'wallet-dialog',
              backdropClass: 'back-drop-class',
              data: result
            }).afterClosed().subscribe((data) => {
              if (data) {
                this.ref.close(true);
              }
            })
          }
        });
        break;
      }
      case (CurrencyTypes.usd): {
        const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.usd);
        const currency = XRPL_TOKENS[index];
        const data = {
          currency: currency.address,
          issuer: currency.issuer,
          value: value.amount.toString()
        };

        this.xummWallet.request({
          "TransactionType": "Payment",
          "Destination": value.wallet,
          "Amount": data,
        }).subscribe(({ result }) => {
          if (result) {
            this.dialog.open(XummDialog, {
              scrollStrategy: new NoopScrollStrategy(),
              autoFocus: false,
              panelClass: 'wallet-dialog',
              backdropClass: 'back-drop-class',
              data: result
            }).afterClosed().subscribe((data) => {
              if (data) {
                this.ref.close(true);
              }
            })
          }
        })
        break;
      }
      case (CurrencyTypes.eur): {
        const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.eur);
        const currency = XRPL_TOKENS[index];
        const data = {
          currency: currency.address,
          issuer: currency.issuer,
          value: value.amount.toString()
        };

        this.xummWallet.request({
          "TransactionType": "Payment",
          "Destination": value.wallet,
          "Amount": data,
        }).subscribe(({ result }) => {
          if (result) {
            this.dialog.open(XummDialog, {
              scrollStrategy: new NoopScrollStrategy(),
              autoFocus: false,
              panelClass: 'wallet-dialog',
              backdropClass: 'back-drop-class',
              data: result
            }).afterClosed().subscribe((data) => {
              if (data) {
                this.ref.close(true);
              }
            })
          }
        })
        break;
      }
    }
  }


  async trasnferCrossWallet() {
    const value = this.form.value;

    switch (value.currency) {
      case (CurrencyTypes.xrpl): {
        await this.wallet.transactionCrossWallet({
          amount: value.amount,
          destination: value.wallet
        })
        break;
      }
      case (CurrencyTypes.usd): {
        const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.usd);
        const currency = XRPL_TOKENS[index];
        await this.wallet.transactionTokenCrossWallet({
          currency: {
            currency: currency.address,
            issuer: currency.issuer,
            value: value.amount.toString()
          },
          destination: value.wallet
        })
        break;
      }
      case (CurrencyTypes.eur): {
        const index = XRPL_TOKENS.findIndex((item) => item.type == CurrencyTypes.eur);
        const currency = XRPL_TOKENS[index];
        await this.wallet.transactionTokenCrossWallet({
          currency: {
            currency: currency.address,
            issuer: currency.issuer,
            value: value.amount.toString()
          },
          destination: value.wallet
        })
        break;
      }
    }
  }

  track = track

}
