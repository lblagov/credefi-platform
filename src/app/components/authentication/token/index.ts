import { NgFor, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { ErrorPipe } from 'src/app/pipes/error';
import { UserProvider } from 'src/app/providers';
import { LazyImage } from '../../main/shared/lazy-image-component';

@Component({
  selector: 'app-token',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  standalone: true,
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
    LazyImage
  ]
})

export class TokenComponent {

  isSubmit = signal(false);

  form = new FormGroup({
    token: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
  });

  @Input() translations: IObjectKeys;

  constructor(
    private router: Router,
    private userProvider: UserProvider
  ) { }

  onSubmit() {
    if (this.form.valid) {
      this.isSubmit.set(true);
      this.userProvider.validateToken(this.form.value).subscribe(({ result, errors }) => {
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

        return this.router.navigateByUrl('/');

      });
    }
  }

}
