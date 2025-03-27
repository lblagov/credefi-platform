import { ViewportScroller } from '@angular/common';
import { ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Manages the scroll position for a browser window.
 */

export class CustomViewportScroller implements ViewportScroller {
    private offset: () => [number, number] = () => {
        if (this.window.screen.width < 800) {
            return [0, 64];
        }
        return [0, 84];
    };
    constructor(
        private document: Document,
        private window: Window & typeof globalThis,
        private errorHandler: ErrorHandler,
        private router: Router
    ) { }

    /**
     * Configures the top offset used when scrolling to an anchor.
     * @param offset A position in screen coordinates (a tuple with x and y values)
     * or a function that returns the top offset position.
     *
     */
    setOffset(offset: [number, number] | (() => [number, number])): void {
        if (Array.isArray(offset)) {
            this.offset = () => offset;
        } else {
            this.offset = offset;
        }
    }

    /**
     * Retrieves the current scroll position.
     * @returns The position in screen coordinates.
     */
    getScrollPosition(): [number, number] {
        const scrollEl = this.document.documentElement;

        if (this.supportScrollRestoration() && scrollEl) {
            return [scrollEl.scrollLeft, scrollEl.scrollTop];
        } else {
            return [0, 0];
        }
    }

    /**
     * Sets the scroll position.
     * @param position The new position in screen coordinates.
     */
    scrollToPosition(position: [number, number]): void {
        const scrollEl = this.document.documentElement;
        const disable = !this.window?.history.state?.disableScroll;
        if (this.supportScrollRestoration() && scrollEl && disable) {
            // Total hack but waiting for content/images to load to give us a 
            // better chance of hitting our scroll target. It also gives the UI a bit
            // of movement to show users that we scrolled them after page load. In a
            // real implementation of ViewportScroller, we should get rid of this but
            // it suits my current needs.
            const { width = 0, height = 0 } = scrollEl.getBoundingClientRect();
            const pseudoScroll = this.document.getElementById('pseudodoscroll');

            if (pseudoScroll) {
                pseudoScroll.style.width = `${position[0] + width}px`;
                pseudoScroll.style.height = `${position[1] + height}px`;
                pseudoScroll.style.maxWidth = `100%`;
            }

            this.window.scrollTo({
                left: position[0],
                top: position[1],
            });

        }
    }

    /**
     * Scrolls to an anchor element.
     * @param anchor The ID of the anchor element.
     */
    scrollToAnchor(anchor: string): void {

        const disable = !this.router.getCurrentNavigation()?.extras?.state?.disableScroll;

        if (this.supportScrollRestoration() && disable) {
            // Escape anything passed to `querySelector` as it can throw errors and stop the application
            // from working if invalid values are passed.
            if (this.window.CSS && this.window.CSS.escape) {
                anchor = this.window.CSS.escape(anchor);
            } else {
                anchor = anchor.replace(/(\"|\'\ |:|\.|\[|\]|,|=)/g, '\\$1');
            }
            try {
                const elSelectedById = this.document.querySelector(`#${anchor}`);

                if (elSelectedById) {
                    this.parseAnchorScroll(elSelectedById);
                    return;
                }
                const elSelectedByName = this.document.querySelector(`[name='${anchor}']`);
                if (elSelectedByName) {
                    this.parseAnchorScroll(elSelectedByName);
                    return;
                }
            } catch (e) {
                this.errorHandler.handleError(e);
            }
        }
    }

    parseAnchorScroll(element: Element) {
        setTimeout(() => {
            this.scrollToElement(element);
        }, 50);
    }
    /**
     * Disables automatic scroll restoration provided by the browser.
     */
    setHistoryScrollRestoration(scrollRestoration: 'auto' | 'manual'): void {
        if (this.supportScrollRestoration()) {
            const history = this.window.history;
            if (history && history.scrollRestoration) {
                history.scrollRestoration = scrollRestoration;
            }
        }
    }


    private scrollToElement(el: Element): void {
        const [x, y] = this.offset();
        const rect = el.getBoundingClientRect();
        const { width = 0, height = 0 } = rect;
        const left = rect.left + this.window.pageXOffset;
        const top = rect.top + this.window.pageYOffset;

        const pseudoScroll = this.document.getElementById('pseudodoscroll');

        if (pseudoScroll) {
            pseudoScroll.style.width = `${left + width}px`;
            pseudoScroll.style.height = `${top + height}px`;
        }

        this.window.scrollTo({
            left: left - x,
            top: top - y,
            behavior: 'smooth'
        });
    }

    /**
     * We only support scroll restoration when we can get a hold of window.
     * This means that we do not support this behavior when running in a web worker.
     *
     * Lifting this restriction right now would require more changes in the dom adapter.
     * Since webworkers aren't widely used, we will lift it once RouterScroller is
     * battle-tested.
     */
    private supportScrollRestoration(): boolean {
        try {
            return !!this.window && !!this.window.scrollTo;
        } catch {
            return false;
        }
    }
}
