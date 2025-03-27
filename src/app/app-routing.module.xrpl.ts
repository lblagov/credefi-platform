import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { AuthenticationProvider } from './components/authentication/providers';
import { inject } from '@angular/core';
import { UserProvider } from './providers';
import { map } from 'rxjs';
import { AccountProvider, GeckoProvider, KycProvider, FileProvider } from './components/main/providers';
import { WalletXRPLProvider } from './components/main/providers/wallet/WalletXRPLProvider';
import { XummProvider } from './components/main/providers/wallet/XummProvider';

export const routes: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('./components/authentication/routes').then(m => m.routes),
    providers: [AuthenticationProvider]
  },
  {
    path: '',
    loadComponent: () => import('./components/main').then(m => m.MainComponent),
    loadChildren: () => import('./components/main/routes').then(m => m.routes),
    providers: [
      AccountProvider, GeckoProvider, KycProvider, FileProvider, WalletXRPLProvider, XummProvider
    ],
    canActivate: [
      (
        _route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ) => {
        const userProvider = inject(UserProvider);
        const router = inject(Router);

        return userProvider.get().pipe(map(({ result }) => {

          if (result) {
            return true;
          }

          const { url } = state;

          router.navigate(['/authentication/login'], {
            queryParams: {
              url
            }
          });

          return false;

        }));

      }
    ],

  },
  { path: '**', loadComponent: () => import('./components/main/not-found').then(m => m.NotFoundComponent) },
];
