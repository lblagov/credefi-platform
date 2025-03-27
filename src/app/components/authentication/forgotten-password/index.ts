import { ChangeDetectionStrategy, Component, Input, ViewChild, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserProvider } from 'src/app/providers';
import { FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { validateEmail } from 'src/app/helpers/emailValidator';
import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { ErrorPipe } from 'src/app/pipes/error';
import { AutoCompleteDirective } from 'src/app/directives/autocomplete';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { LazyImage } from '../../main/shared/lazy-image-component';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [
    NgIf,
    NgFor,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterLink,
    ErrorPipe,
    AutoCompleteDirective,
    SlicePipe,
    MatRippleModule,
    LazyImage
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})

export class ForgottenPasswordComponent {

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
      validateEmail
    ]),
  });

  @Input() translations: IObjectKeys;
  @ViewChild('formChild') public formChild: NgForm; 
  
  isSubmit = signal(false);
  success = signal(false);

  constructor(
    private userProvider: UserProvider
  ) { }

  onSubmit() {
    if (this.form.valid) {
      this.isSubmit.set(true);
      this.userProvider.resetPassword(this.form.value).subscribe(({ result, errors }) => {
        this.isSubmit.set(false);
        
        if(result){
          this.success.set(true);
          this.formChild.resetForm();
          return;
        }

        if (errors) {
          for (let key in errors) {
            const parsedErrors = errors[key].map((item: string) => {
              return this.translations[item];
            })
            this.form.controls[key].setErrors({ 'incorrect': parsedErrors });
          }
        }
      });
    }
  }

}
