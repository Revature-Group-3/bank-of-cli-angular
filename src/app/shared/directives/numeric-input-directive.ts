import { Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Restricts an <input> to digits, with an optional fixed number of decimals.
 *
 * decimals = 0 (default) -> integers only ("1234")
 * decimals = 2           -> currency-style ("1234.50")
 *
 * UX only: always validate again on the server.
 * 
 * USAGE: 
 * Integer (account number, quantity)
 * <input appNumericInput inputmode="numeric" maxlength="10" [(ngModel)]="accountNumber" />
 *
 * Currency, two decimals
 * <input appNumericInput [decimals]="2" inputmode="decimal" [(ngModel)]="amount" />
 */
@Directive({
    selector: 'input[appNumericInput]',
    standalone: true,
    host: {
        '(beforeinput)': 'onBeforeInput($event)',
        '(paste)': 'onPaste($event)',
        '(blur)': 'onBlur()',
    },
})
export class NumericInputDirective {
    private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

    /** Max digits after the decimal point. 0 means integers only. */
    readonly decimals = input(0);

    /** Does the full string match the allowed shape? */
    private isValid(value: string): boolean {
        const d = this.decimals();
        const pattern = d > 0 ? new RegExp(`^\\d*\\.?\\d{0,${d}}$`) : /^\d*$/;
        return pattern.test(value);
    }

    /** Strip anything illegal, keep only the first '.', trim excess decimals. */
    private sanitize(value: string): string {
        const d = this.decimals();
        if (d === 0) return value.replace(/\D/g, '');

        const cleaned = value.replace(/[^\d.]/g, '');
        const dot = cleaned.indexOf('.');
        if (dot === -1) return cleaned;

        const whole = cleaned.slice(0, dot);
        const fraction = cleaned.slice(dot + 1).replace(/\./g, '').slice(0, d);
        return `${whole}.${fraction}`;
    }

    /** What the field would contain if `text` replaced the current selection. */
    private proposed(text: string): string {
        const input = this.el.nativeElement;
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        return input.value.slice(0, start) + text + input.value.slice(end);
    }

    /** Tell Angular's value accessor that the value changed programmatically. */
    private notify(): void {
        this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }

    onBeforeInput(event: InputEvent): void {
        // Only guard insertions; allow deletes, undo/redo, etc.
        if (!event.inputType.startsWith('insert') || event.data == null) return;

        if (!this.isValid(this.proposed(event.data))) {
            event.preventDefault();
        }
    }

    onPaste(event: ClipboardEvent): void {
        event.preventDefault();

        const cleaned = this.sanitize(event.clipboardData?.getData('text') ?? '');
        if (!cleaned || !this.isValid(this.proposed(cleaned))) return;

        const input = this.el.nativeElement;
        // Replaces the selection and puts the caret after the inserted text
        input.setRangeText(
            cleaned,
            input.selectionStart ?? input.value.length,
            input.selectionEnd ?? input.value.length,
            'end',
        );
        this.notify();
    }

    onBlur(): void {
        const input = this.el.nativeElement;
        const original = input.value;

        // Fallback for paths beforeinput can miss (drag-and-drop, some autofill)
        let value = this.sanitize(original);

        // Pad to fixed decimals, but leave empty / lone "." for validators to flag
        const d = this.decimals();
        if (d > 0 && value !== '' && value !== '.') {
            const [whole = '', fraction = ''] = value.split('.');
            value = `${whole || '0'}.${fraction.padEnd(d, '0')}`;
        }

        if (value !== original) {
            input.value = value;
            this.notify();
        }
    }
}