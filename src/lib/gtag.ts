// Google Analytics' command queue. Calls made before gtag.js loads wait in dataLayer and run
// once it arrives. Browser only.

declare global {
    interface Window {
        dataLayer?: unknown[];
    }
}

export function gtag(...args: unknown[]) {
    void args;
    // gtag.js reads the arguments object itself, not an array copy
    // eslint-disable-next-line prefer-rest-params
    (window.dataLayer = window.dataLayer || []).push(arguments);
}
