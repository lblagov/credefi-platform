import { ChangeDetectionStrategy, Component, Input, SkipSelf, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { UserProvider } from 'src/app/providers';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from 'src/app/helpers/passwordConfirmValidator';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { ErrorPipe } from 'src/app/pipes/error';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { strongPasswordValidator } from 'src/app/helpers/strongPasswordValidator';
import { PasswordDirective } from 'src/app/directives/show';
import { MatRippleModule } from '@angular/material/core';
import { LazyImage } from '../../main/shared/lazy-image-component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [
    NgIf,
    NgFor,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    ErrorPipe,
    AutoCompleteDirective,
    SlicePipe,
    PasswordDirective,
    MatRippleModule,
    LazyImage
  ],
  providers: [UserProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})

export class ResetPasswordComponent {

  form = new FormGroup({
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

  @Input() translations: IObjectKeys;
  @Input() token: string;
  isSubmit = signal(false);

  constructor(
    private router: Router,
    @SkipSelf() private userProvider: UserProvider
  ) { }


  onSubmit() {
    if (this.form.valid) {
      this.isSubmit.set(true);
      this.userProvider.changePassword({ ...this.form.value, token: this.token }).subscribe(({ result, errors }) => {
        this.isSubmit.set(false);

        if (errors) {
          for (let key in errors) {
            const parsedErrors = errors[key].map((item: string) => {
              return this.translations[item];
            })
            this.form.controls[key].setErrors({ 'incorrect': parsedErrors });
          }
        }

        if (result) {
          this.router.navigateByUrl('/authentication')
        }

      });
    }
  }

}
