import { onKeyStroke } from '@vueuse/core';

function isTyping(target: EventTarget | null): boolean {
    return (
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    );
}

/**
 * Registers a single-key shortcut that is ignored while the user is typing,
 * when a modifier is held, or while a modal dialog is open.
 */
export function useShortcut(key: string, handler: () => void): void {
    onKeyStroke(key, (event) => {
        if (
            event.repeat ||
            event.metaKey ||
            event.ctrlKey ||
            event.altKey ||
            isTyping(event.target) ||
            document.querySelector('dialog[open]')
        ) {
            return;
        }

        event.preventDefault();
        handler();
    });
}
