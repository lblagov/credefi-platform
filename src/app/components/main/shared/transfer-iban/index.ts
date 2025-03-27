import { NgFor, NgIf, SlicePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { InputNumberDirective } from 'src/app/directives/number';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { track } from 'src/app/helpers/track';
import { WINDOW } from 'src/app/modules/window';
import { ErrorPipe } from 'src/app/pipes/error';
import { DepositTypes } from 'src/globals';
import { LoaderProvider } from 'src/app/providers';

@Component({
  selector: 'app-transfer-iban-dialog',
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
    MatDialogModule,
    SlicePipe,
    ErrorPipe,
    AutoCompleteDirective,
    InputNumberDirective,
    NgFor,
    NgIf,
  ],
  standalone: true,
})
export class TransferIbanDialog {
  depositTypes = DepositTypes;
  isSubmit = signal(false);

  currencies = [
    {
      name: 'IBAN',
      type: DepositTypes.bank,
    },
    {
      name: 'Crypto',
      type: DepositTypes.crypto,
    },
  ];

  reasons = [
    {
      name: 'Purchase of goods or services',
      type: 1,
    },
    {
      name: 'Employee Payroll',
      type: 2,
    },
    {
      name: 'Internal / Inter-company Transfer ',
      type: 3,
    },
    {
      name: 'Utility Bills',
      type: 4,
    },
    {
      name: 'Reimbursement / Refund',
      type: 5,
    },
    {
      name: 'Dividends / Royalties',
      type: 6,
    },
    {
      name: 'Taxes Payment',
      type: 7,
    },
    {
      name: 'Loan Repayment',
      type: 8,
    },
    {
      name: 'Investment / Assets Purchase',
      type: 9,
    },
    {
      name: 'Other',
      type: 10,
    },
  ];

  eur_rate = 1.03;
  usdt_rate = 0.98;

  commision = 0.0125;

  currencynames = [
    {
      name: 'EUR',
    },
    {
      name: 'USD',
    },
  ];

  currencynamescrypto = [
    {
      name: 'USDC',
    },
  ];

  form = new FormGroup({
    method: new FormControl(DepositTypes.bank, [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
    wallet: new FormControl(null, [Validators.required]),
    currency: new FormControl(null, [Validators.required]),
  });

  constructor(
    private loaderProvider: LoaderProvider,
    public ref: MatDialogRef<TransferIbanDialog>,
    @Inject(WINDOW) private window: IObjectKeys
  ) {}

  async onSubmit() {
    this.loaderProvider.show();
    const amount = this.form.get('amount').value;
    const method = this.form.get('method').value;
    const currency = this.form.get('currency').value;
    const iban = this.form.get('wallet').value;

    const usdc_amount = Number(
      this.getCookie('balanceUSDC').length == 0
        ? 10000
        : this.getCookie('balanceUSDC')
    );

    if (method == 'bank') {
      if (currency == 'EUR') {
        const eur =
          Number(
            this.getCookie('balanceEUR').length == 0
              ? 10000
              : this.getCookie('balanceEUR')
          ) - amount;
        const a = amount * this.eur_rate;
        const usdc = a - a * this.commision + usdc_amount;
        document.cookie = `balanceEUR=${eur};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
        document.cookie = `balanceUSDC=${usdc};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
        const newTransaction = {
          iban: iban,
          currency: currency,
          method: method,
          amount: amount,
        };
        let bankHistoryStr = this.getCookie("bankhistory");
        let bankHistory = [];

        if (bankHistoryStr.length > 0) {
            try {
                bankHistory = JSON.parse(decodeURIComponent(bankHistoryStr));
            } catch (e) {
                bankHistory = [];
            }
        }
        if (!Array.isArray(bankHistory)) {
            bankHistory = [];
        }

        bankHistory.push(newTransaction);
        document.cookie = `bankhistory=${encodeURIComponent(JSON.stringify(bankHistory))};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
      }

      if (currency == 'USD') {
        const eur =
          Number(
            this.getCookie('balancefUSD').length == 0
              ? 10000
              : this.getCookie('balancefUSD')
          ) - amount;
        const usdc = amount - amount * this.commision + usdc_amount;
        document.cookie = `balancefUSD=${eur};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
        document.cookie = `balanceUSDC=${usdc};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
        const newTransaction = {
          iban: iban,
          currency: currency,
          method: method,
          amount: amount,
        };
        let bankHistoryStr = this.getCookie("bankhistory");
        let bankHistory = [];

        if (bankHistoryStr.length > 0) {
            try {
                bankHistory = JSON.parse(decodeURIComponent(bankHistoryStr));
            } catch (e) {
                bankHistory = [];
            }
        }
        if (!Array.isArray(bankHistory)) {
            bankHistory = [];
        }

        bankHistory.push(newTransaction);
        document.cookie = `bankhistory=${encodeURIComponent(JSON.stringify(bankHistory))};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
      }
    }

    if (method == 'crypto') {
      if (iban == 'FR8214508000503288225894Q91') {
        const eur =
          Number(
            this.getCookie('balanceUSDC').length == 0
              ? 10000
              : this.getCookie('balanceUSDC')
          ) - amount;
        const usdc = amount - amount * this.commision + usdc_amount;
        document.cookie = `balanceUSDC=${eur};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
        document.cookie = `balancefUSD=${usdc};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
      }

      if (iban == 'GB79BARC20040427882431') {
        const eur =
          Number(
            this.getCookie('balanceUSDC').length == 0
              ? 10000
              : this.getCookie('balanceUSDC')
          ) - amount;
        const a = amount * this.usdt_rate;
        const usdc = a - a * this.commision + usdc_amount;
        document.cookie = `balanceUSDC=${eur};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
        document.cookie = `balanceEUR=${usdc};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
      }
      const newTransaction = {
        iban: iban,
        currency: currency,
        method: method,
        amount: amount,
      };
      let bankHistoryStr = this.getCookie("bankhistory");
      let bankHistory = [];

      if (bankHistoryStr.length > 0) {
          try {
              bankHistory = JSON.parse(decodeURIComponent(bankHistoryStr));
          } catch (e) {
              bankHistory = [];
          }
      }
      if (!Array.isArray(bankHistory)) {
          bankHistory = [];
      }

      bankHistory.push(newTransaction);
      document.cookie = `bankhistory=${encodeURIComponent(JSON.stringify(bankHistory))};expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/`;
    }
    setTimeout(this.reload, 1);
  }

  getCookie(cname) {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  reload() {
    location.reload();
  }

  track = track;
}
