import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'autonomous-earning',
        loadComponent: () => import('./autonomous-earning').then(m => m.AutonomousEarningComponent),
        title: 'Autonomous Earning',
    },
    {
        path: 'invest-now-mobile',
        loadComponent: () => import('./invest-now-mobile').then(m => m.InvestNowMobileComponent),
        title: 'Invest Now Mobile',
    },
    { path: '', redirectTo: 'autonomous-earning', pathMatch: 'full' },
];
