import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MapProvider, UserProvider } from 'src/app/providers';
import { ActivatedRoute, ActivationStart, Router, RouterLink } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { ConnectXRPLDialog } from 'src/app/helpers/connectXRPLDialog';
import { KycProvider } from '../../providers';
import { IObjectKeys } from 'src/app/helpers/interfaces';
import { MatRippleModule } from '@angular/material/core';
import { Environment } from 'src/globals';
import { WalletXRPLProvider } from '../../providers/wallet/WalletXRPLProvider';
import { LazyImage } from '../lazy-image-component';

@Component({
  selector: 'app-header',
  templateUrl: './index.xrpl.html',
  styleUrls: ['./style.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatDialogModule, NgIf, MatRippleModule, MatIconModule, RouterLink, LazyImage],
})

export class HeaderComponent extends ConnectXRPLDialog implements OnInit, OnDestroy {

  api_url = Environment.api_url;

  routeSubscrion: Subscription;
  userSubscription: Subscription;

  user: string;
  email: string;

  title = signal<string | null>(null);
  userData: WritableSignal<IObjectKeys> = signal(null);
  show = signal(false);

  @ViewChild('menuBar', { static: true }) menuBar: ElementRef<HTMLDivElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mapProvider: MapProvider,
    public walletProvider: WalletXRPLProvider,
    private userProvider: UserProvider,
    private kyc: KycProvider
  ) {
    super();
    const user = this.mapProvider.get(MapProvider.USER);
    const index = user.email.indexOf('@');
    this.user = user.email.slice(0, index);
    this.email = user.email;
    
    this.title.set(this.route.snapshot.children?.[0]?.routeConfig?.title as string);
    this.userData.set(this.mapProvider.get(MapProvider.USER));
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.menuBar.nativeElement.contains(event.target)) {
      this.show.set(false);
    }
  }

  ngOnInit(): void {
    this.routeSubscrion = this.router.events.pipe(filter(e => e instanceof ActivationStart)).subscribe((route: ActivationStart) => {
      this.title.set(route.snapshot.routeConfig?.title as string);
    });
    this.userSubscription = this.mapProvider.setSubsription(MapProvider.USER).subscribe((data) => {
      this.userData.set(data);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscrion) {
      this.routeSubscrion.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
  }

  openSettings(): void {
    this.show.update(v => !v);
  }

  validateKyc() {
    this.kyc.initIframe();
  }

  logOut() {
    this.userProvider.logout().subscribe(() => {
      this.router.navigateByUrl('/authentication')
    });
  }

}

