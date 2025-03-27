import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'autonomous-earning',
        loadComponent: () => import('./autonomous-earning').then(m => m.AutonomousEarningComponent),
        title: 'Autonomous Earning',
    },
    {
        path: 'autonomous-business',
        loadComponent: () => import('./autonomous-business').then(m => m.AutonomousEarningComponent),
        title: 'Autonomous for Business',
    },
    { path: '', redirectTo: 'autonomous-earning', pathMatch: 'full' },
    {
        path: 'bonds-investing',
        loadComponent: () => import('./bonds-investing').then(m => m.BondsInvestingComponent),
        title: 'Bonds Investing',
    },
    { path: '', redirectTo: 'bonds-investing', pathMatch: 'full' },
];
