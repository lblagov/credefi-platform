import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'autonomous-earning',
        loadComponent: () => import('./autonomous-earning').then(m => m.AutonomousEarningComponent),
        title: 'Credefi XRPL | Autonomous Earning',
    },
    { path: '', redirectTo: 'autonomous-earning', pathMatch: 'full' },
];
