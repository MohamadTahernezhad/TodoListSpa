// jsdom does not implement modal dialogs yet; emulate the parts the app relies on.
if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
        this.setAttribute('open', '');
    };

    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
        if (!this.hasAttribute('open')) return;

        this.removeAttribute('open');
        this.dispatchEvent(new Event('close'));
    };
}
