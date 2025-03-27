import { Directive, HostListener, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Environment } from 'src/globals/config';
import { WINDOW } from 'src/app/modules/window';

@Directive({
    selector: '[google]'
})

export class GoogleDirective {

    readonly scope = 'profile openid email';
    readonly state = 'application';
    readonly apiKey = 'AIzaSyCxvpHiR7-hKpLJ7tbGCz63szT2l_wnQgQ';
    readonly redirect = `${Environment.client_url}/authentication/google`;
    readonly clientId = '68991886833-dqrtme6ps7c7k89r4sfv5n7a9c509jmg.apps.googleusercontent.com';

    constructor(
        private ActivatedRoute: ActivatedRoute,
        @Inject(WINDOW) private window: Window,
    ) { }

    @HostListener('click') onClick() {
        const { url } = this.ActivatedRoute.snapshot.queryParams;
        const state = url ? `param==${this.state},redirect==${encodeURIComponent(url)}` : `param==${this.state}`;
        this.window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${this.clientId}&scope=${this.scope}&redirect_uri=${this.redirect}&state=${state}&nonce=${Date.now()}`;
    }

}