import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { Router, provideRouter, withComponentInputBinding, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { ErrorIntercept } from './app/helpers/error.interceptor';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { CustomViewportScroller } from './app/modules/custom-viewport-scroller';
import { APP_INITIALIZER, ErrorHandler, importProvidersFrom, ɵɵinject } from '@angular/core';
import { routes } from './app/app-routing.module';

import { ApiProvider, LanguageProvider, MapProvider, UserProvider } from './app/providers';
import { MatDialogModule } from '@angular/material/dialog';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(MatDialogModule),
    provideAnimations(),
    provideRouter(routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      }),
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation(),
    ),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorIntercept,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [
        Router,
        LanguageProvider,
        UserProvider
      ],
      multi: true
    },
    {
      provide: ViewportScroller,
      useFactory: () => new CustomViewportScroller(ɵɵinject(DOCUMENT), window, ɵɵinject(ErrorHandler), ɵɵinject(Router))
    },
    MapProvider,
    ApiProvider,
    UserProvider
  ]
});

export function init_app(
  router: Router,
  languageProvider: LanguageProvider,
  userProvider: UserProvider
) {
  return () => Promise.all([
    languageProvider.init({}),
    userProvider.init(),
  ]).catch((e) => {
    router.navigate(['/error']);
  });
}