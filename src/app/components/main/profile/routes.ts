import { Routes } from '@angular/router';
import { LanguageResolver, SharedLanguageResolver } from 'src/app/resolvers';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard').then(m => m.ProfileDashboard),
        title: 'Profile',
        data: {
            languagePath: 'profile/information/security',
            sharedLanguagePaths: {
                authneticatorDialog: 'shared/authneticator-dialog',
                authneticatorCodeDialog: 'shared/authneticator-code-dialog',
              }
        },
        resolve: {
            translations: LanguageResolver,
            sharedTranslations: SharedLanguageResolver
        },
    },
    { path: '', redirectTo: '', pathMatch: 'full' },
];
