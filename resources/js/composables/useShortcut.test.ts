import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';

import { useShortcut } from '@/composables/useShortcut';

function mountWithShortcut(handler: () => void) {
    return mount(
        defineComponent({
            setup() {
                useShortcut('n', handler);

                return () => h('div', [h('input'), h('dialog')]);
            },
        }),
        { attachTo: document.body },
    );
}

function press(target: EventTarget, init: KeyboardEventInit = {}): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', bubbles: true, ...init }));
}

describe('useShortcut', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('runs the handler when the key is pressed', () => {
        const handler = vi.fn();
        mountWithShortcut(handler);

        press(document.body);

        expect(handler).toHaveBeenCalledOnce();
    });

    it('ignores the key while typing in a field', () => {
        const handler = vi.fn();
        const wrapper = mountWithShortcut(handler);

        press(wrapper.get('input').element);

        expect(handler).not.toHaveBeenCalled();
    });

    it('ignores the key when combined with a modifier', () => {
        const handler = vi.fn();
        mountWithShortcut(handler);

        press(document.body, { ctrlKey: true });
        press(document.body, { metaKey: true });

        expect(handler).not.toHaveBeenCalled();
    });

    it('ignores the key while a dialog is open', () => {
        const handler = vi.fn();
        const wrapper = mountWithShortcut(handler);
        wrapper.get('dialog').element.setAttribute('open', '');

        press(document.body);

        expect(handler).not.toHaveBeenCalled();
    });
});
