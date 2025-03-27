import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { WalletProvider } from './providers/wallet/WalletProvider';
import { CHAIN } from 'src/environments/environment';

export const routes: Routes = [
    {
        path: 'earn',
        loadChildren: () => import('./earn/routes').then(m => m.routes),
        title: 'Investing tools',
    },
    {
        path: 'profile',
        loadChildren: () => import('./profile/routes').then(m => m.routes),
        title: 'User details',
    },
    {
        path: 'staking',
        loadComponent: () => import('./staking').then(m => m.StakingComponent),
        title: 'Staking catalogue',
    },
    {
        path: 'stake',
        loadComponent: () => import('./stake').then(m => m.StakeComponent),
        title: 'Stake',
    },
    {
      path: 'xcredi-stake',
      loadComponent: () => import('./xcredi-stake').then(m => m.XCrediStakeComponent),
      title: 'Stake',
      canActivate: [
        () => {
          const wallet = inject(WalletProvider);
          const router = inject(Router);

          if(wallet.chain() != CHAIN.binance.key){
            router.navigateByUrl("/")
            return false;
          }

          return true;
        }
      ]
  },
    {
        path: 'modulex',
        loadComponent: () => import('./modulex').then(m => m.ModuleXComponent),
        title: 'Module X',
    },
    {
        path: 'utilities',
        loadComponent: () => import('./utilities').then(m => m.UtilitiesComponent),
        title: 'Utilities',
    },
    {
        path: 'bonds',
        loadComponent: () => import('./bonds').then(m => m.BondsComponent),
        title: 'Bonds catalogue',
    },
    {
        path: 'wallet',
        loadComponent: () => import('./wallet').then((m) => m.WalletComponent),
        title: 'Wallet',
    },
    {
        path: 'transactions',
        loadComponent: () => import('./all-transactions').then(m => m.AllTransactionsComponent),
        title: 'All transactions',
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard').then(m => m.DashboardComponent),
        title: 'Credefi Finance',
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
