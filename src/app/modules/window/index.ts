import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

declare global {
    interface Window {
        fbq: Function
    }
}

export const WINDOW = new InjectionToken<Window & typeof globalThis>(
    'An abstraction over global window object',
    {
        factory: () => {
            const { defaultView } = inject(DOCUMENT);

            if (!defaultView) {
                throw new Error('Window is not available');
            }

            return defaultView;
        },
    },
);