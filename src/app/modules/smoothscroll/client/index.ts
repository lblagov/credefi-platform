if (!("scrollBehavior" in document.documentElement.style)) {
    import('./polyfill').then((m) => {
        const { polyfill } = m;
        if (polyfill) {
            polyfill();
        }
    }).catch((err) => {
        console.log(err);
    });
}