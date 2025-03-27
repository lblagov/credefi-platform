import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'earn',
        loadChildren: () => import('./earn/routes').then(m => m.routes),
        title: 'Credefi XRPL | Autonomous earning',
    },
    {
        path: 'profile',
        loadChildren: () => import('./profile/routes').then(m => m.routes),
        title: 'Credefi XRPL | User details',
    },
    {
        path: 'wallet',
        loadComponent: () => import('./wallet').then((m) => m.WalletComponent),
        title: 'Credefi XRPL | Wallet',
    },
    {
        path: 'transactions',
        loadComponent: () => import('./all-transactions').then(m => m.AllTransactionsComponent),
        title: 'Credefi XRPL | All transactions',
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard').then(m => m.DashboardComponent),
        title: 'Credefi XRPL | Credefi Finance',
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
