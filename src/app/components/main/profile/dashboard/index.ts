import { NgFor, NgIf, SlicePipe, isPlatformBrowser } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, PLATFORM_ID, Renderer2, ViewChild, WritableSignal, effect, signal, untracked } from "@angular/core";
import { FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { AutoCompleteDirective } from "src/app/directives/autocomplete";
import { IObjectKeys } from "src/app/helpers/interfaces";
import { passwordMatchValidator } from "src/app/helpers/passwordConfirmValidator";
import { strongPasswordValidator } from "src/app/helpers/strongPasswordValidator";
import { WINDOW } from "src/app/modules/window";
import { ErrorPipe } from "src/app/pipes/error";
import { MapProvider, UserProvider } from "src/app/providers";
import { FileTypes } from "src/globals";
import { FileProvider } from "../../providers";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AuthneticatorDialog } from "../../shared/authneticator-dialog/component";
import { NoopScrollStrategy } from "@angular/cdk/overlay";
import { AuthneticatorCodeDialog } from "../../shared/authneticator-code-dialog/component";
import { BasicUser } from "src/app/model";
import { ConfirmDialog } from "../../shared/confirm";
import { WalletProvider } from "../../providers/wallet/WalletProvider";

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatInputModule, ReactiveFormsModule, ErrorPipe, AutoCompleteDirective, SlicePipe, NgFor, NgIf, MatDialogModule],
  standalone: true
})

export class ProfileDashboard {

  @Input() translations: IObjectKeys;
  @Input() sharedTranslations: IObjectKeys;

  tierLevel = signal(0);
  userData: WritableSignal<IObjectKeys>;
  isSubmit = signal(false);
  form = new FormGroup({
    currentPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(255),
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

  companyForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(255),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
  });

  @ViewChild('formChild') public formChild: NgForm;
  @ViewChild('companyFormChild') public companyFormChild: NgForm;

  constructor(
    private rendered: Renderer2,
    private userProvider: UserProvider,
    private walletProvider: WalletProvider,
    private mapProvider: MapProvider,
    private fileProvider: FileProvider,
    private elementRef: ElementRef,
    private dialog: MatDialog,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.userData = signal(this.mapProvider.get(MapProvider.USER));
    this.companyForm.get('email').setValue(this.userData().email);
  }

  private loggingEffect = effect(() => {
    if (this.walletProvider.address()) {
      untracked(() => {
        this.setTier();
      });
    }
  });

  async setTier() {
    const tierLevel = await this.walletProvider.getTierLevel();
    this.tierLevel.set(tierLevel);
  }

  loadInput() {
    if (isPlatformBrowser(this.platformId)) {

      this.window.requestAnimationFrame(() => {
        const input: HTMLInputElement = this.rendered.createElement('input');

        input.type = 'file'
        input.multiple = false;
        input.accept = FileTypes.image.suportedTypes.join(',');
        input.onchange = this.prepareFile.bind(this, input);
        input.classList.add('hidden');

        this.elementRef.nativeElement.appendChild(input);

        input.click();
      });

    }
  }

  prepareFile(input: HTMLInputElement, event: Event) {
    const target = event?.target as HTMLInputElement;
    const files = target?.files as FileList;
    this.handleFile(files);
    input.remove();
  }


  handleFile(files: FileList) {
    if (files?.length > 0) {

      const file = files[0];
      const error = this.checkFile(file);

      switch (error) {
        case (-2): {
          break;
        }
        case (-1): {
          break;
        }
        case (FileTypes.image.key): {
          const url = window.URL.createObjectURL(file);
          const img = new Image();
          img.src = url;
          img.onload = this.preUpload.bind(this, img, file);

          break;
        }

      }

    }
  }

  checkFile(file: File) {

    if (file.size > FileTypes.image.maxSize) {
      return -2;
    }

    if (FileTypes.image.suportedTypes.includes(file.type)) {
      return FileTypes.image.key;
    }

    return -1;

  }

  preUpload = (image: HTMLImageElement, file: File) => {
    this.upload(file, { width: image.width, height: image.height });
  }

  upload(file: File, sizes: { width: number, height: number }) {
    const form: FormData = new FormData();
    form.append('data', file);
    return this.fileProvider.post({ formData: form }).subscribe(({ result }) => {

      if (result) {
        const user = this.mapProvider.get(MapProvider.USER);
        this.mapProvider.set(MapProvider.USER, {
          ...user,
          picture: {
            name: result.name,
            mime: result.mime
          }
        })
      }

    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isSubmit.set(true);

      this.userProvider.updatePassword(this.form.value).subscribe(({ result, errors }) => {
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
          this.form.reset();
          this.formChild.resetForm();
        }

      });
    }
  }

  onSubmitCorporate() {
    if (this.companyForm.valid) {
      this.isSubmit.set(true);

      this.userProvider.corporatePost(this.companyForm.value).subscribe(({ result, errors }) => {
        this.isSubmit.set(false);

        if (errors) {
          for (let key in errors) {
            const parsedErrors = errors[key].map((item: string) => {
              return this.translations[item];
            })
            this.companyForm.controls[key].setErrors({ 'incorrect': parsedErrors });
          }
        }

        if (result) {
          this.companyForm.reset();
          this.companyFormChild.resetForm();
        }

      });
    }
  }

  opne2faDialog() {
    this.fileProvider.get('user/qrcode').subscribe((data) => {
      this.dialog.open(AuthneticatorDialog, {
        autoFocus: false,
        scrollStrategy: new NoopScrollStrategy(),
        panelClass: 'wallet-dialog',
        backdropClass: 'back-drop-class',
        data: {
          qrCode: data,
          translations: this.sharedTranslations.authneticatorDialog,
        }
      }).afterClosed().subscribe((code) => {
        if (code) {
          this.dialog.open(AuthneticatorCodeDialog, {
            autoFocus: false,
            scrollStrategy: new NoopScrollStrategy(),
            panelClass: 'wallet-dialog',
            backdropClass: 'back-drop-class',
            data: {
              translations: this.sharedTranslations.authneticatorCodeDialog,
              code: code
            }
          }).afterClosed().subscribe(() => {
            this.userData.update((value) => {
              value.gaEnabled = true;
              return value;
            })
            this.mapProvider.set(MapProvider.USER, new BasicUser(this.userData));
          });
        }
      });
    })

  }

  disableDialog() {
    this.dialog.open(ConfirmDialog, {
      autoFocus: false,
      scrollStrategy: new NoopScrollStrategy(),
      panelClass: 'wallet-dialog',
      backdropClass: 'back-drop-class',
      data: {
        message: "Are you sure you want to deactivate 2FA?",
        buttons: [
          {
            label: 'NO'
          },
          {
            label: 'YES',
            handler: () => {
              this.userProvider.gaDeactivate().subscribe(({ result }) => {
                if (result) {
                  this.userData.update((value) => {
                    value.gaEnabled = false;
                    return value;
                  })
                  this.mapProvider.set(MapProvider.USER, new BasicUser(this.userData()));
                }
              });
            }
          }
        ]
      }
    })
  }

}
