import { signal } from '@angular/core';

export abstract class CurrencyInput {
    currencySignal = signal<string>('');
    previousValue = '';

    onInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        if (/^\d*\.?\d{0,2}$/.test(value)) {
            this.currencySignal.set(value);
            this.previousValue = value;
        } else {
            target.value = this.previousValue;
        }
    }
}