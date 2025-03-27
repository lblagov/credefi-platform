import {
  Injectable,
  PLATFORM_ID,
  Inject,
  RendererFactory2,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { UserProvider, LoaderProvider, MapProvider } from 'src/app/providers';
import snsWebSdk from '@sumsub/websdk';

@Injectable()
export class KycProvider {
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    private UserProvider: UserProvider,
    private LoaderProvider: LoaderProvider,
    private MapProvider: MapProvider,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platform: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  async initIframe() {
    if (isPlatformBrowser(this.platform)) {
      const user = this.MapProvider.get(MapProvider.USER);
      const element = this.document.getElementById('sumsub-websdk-container');
      try {
        const access = await this.UserProvider.getKycAccess();
        element.classList.add('active');
        // this.LoaderProvider.show();

        let snsWebSdkInstance = snsWebSdk
          .init(
            access.result.token,
            // token update callback, must return Promise
            // Access token expired
            // get a new one and pass it to the callback to re-initiate the WebSDK
            async () => {
              return (await this.UserProvider.getKycAccess()).result.token
            }
          )
          .withConf({
            lang: 'en',
            email: user.email,
          })
          .withOptions({ addViewportTag: true, adaptIframeHeight: true })
          // see below what kind of messages WebSDK generates
          .on('idCheck.onStepCompleted', (payload) => {
            console.log('onStepCompleted', payload);
            element.classList.remove('active');
          })
          .on('idCheck.onError', (error) => {
            console.log('onError', error);
            element.classList.remove('active');
          })
          .build();

        // you are ready to go:
        // just launch the WebSDK by providing the container element for it
        snsWebSdkInstance.launch('#sumsub-websdk-container');
      } catch (error) {
        element.classList.remove('active');
      }
    }
  }

  initIframeShufti() {
    if (isPlatformBrowser(this.platform)) {
      this.LoaderProvider.show();
      return this.UserProvider.prepareKYC().subscribe(({ result }) => {
        if (result.event && result.event === 'request.pending') {
          this.createIframeShufti(result.verification_url);
        }
      });
    }
  }

  private createIframeShufti(src: string) {
    if (isPlatformBrowser(this.platform)) {
      let iframe: HTMLIFrameElement = this.renderer.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.id = 'shuftipro-iframe';
      iframe.name = 'shuftipro-iframe';
      iframe.allow = 'camera';
      iframe.src = src;
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.bottom = '0';
      iframe.style.right = '0';
      iframe.style.margin = '0';
      iframe.style.padding = '0';
      iframe.style.overflow = 'hidden';
      iframe.style.border = 'none';
      iframe.style.zIndex = '2147483647';
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.dataset.removable = 'true';

      this.document.body.appendChild(iframe);
    }
  }
}
