import { NgFor, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { PasswordDirective } from 'src/app/directives/show';
import { validateEmail } from 'src/app/helpers/emailValidator';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { ErrorPipe } from 'src/app/pipes/error';
import { UserProvider } from 'src/app/providers';
import { LazyImage } from '../../main/shared/lazy-image-component';

@Component({
  selector: 'app-login',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgFor,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    ErrorPipe,
    AutoCompleteDirective,
    SlicePipe,
    RouterLink,
    MatRippleModule,
    PasswordDirective,
    LazyImage
  ],
  standalone: true
})

export class LoginComponent {

  isSubmit = signal(false);

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
      validateEmail,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
      Validators.minLength(6)
    ])
  });

  @Input() translations: IObjectKeys;

  constructor(
    private router: Router,
    private userProvider: UserProvider,
  ) { }

  onSubmit() {
    if (this.form.valid) {
      this.isSubmit.set(true);
      this.userProvider.authenticate(this.form.value).subscribe(({ result, errors }) => {
        this.isSubmit.set(false);

        if (errors) {
          for (let key in errors) {
            const parsedErrors = errors[key].map((item: string) => {
              return this.translations[item];
            })
            this.form.controls[key].setErrors({ 'incorrect': parsedErrors });
          }

          return false;
        }

        if (result) {
          if(result.gaEnabled){
            return this.router.navigate(['/authentication/2fa'], {
              queryParamsHandling: 'merge'
            });
          }
          this.router.navigateByUrl('/authentication/token');
        }

      });
    }
  }

}
