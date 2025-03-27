import { Directive, HostListener, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Environment } from 'src/globals/config';
import { WINDOW } from 'src/app/modules/window';

@Directive({
    selector: '[facebook]'
})

export class FacebookDirective {

    readonly appId = '2796523117344672';
    readonly version = 'v10.0';
    readonly redirect = `${Environment.client_url}/authentication/facebook`;
    readonly state = 'application';

    constructor(
        private ActivatedRoute: ActivatedRoute,
        @Inject(WINDOW) private window: Window,
    ) { }

    @HostListener('click') onClick() {
        const { url } = this.ActivatedRoute.snapshot.queryParams;
        const state = url ? `param==${this.state},redirect==${url}` : `param==${this.state}`;
        this.window.location.href = `https://www.facebook.com/${this.version}/dialog/oauth?client_id=${this.appId}&redirect_uri=${this.redirect}&state=${state}&scope=public_profile,email`;
    }

}