import { signal } from '@angular/core';

export abstract class IntegerInput {
    integerSignal = signal<string>('');

    onInput(event: Event) {
        const target = event.target as HTMLInputElement;
        
        // Remove any non-numeric characters from the input value
        const cleanedValue = target.value.replace(/[^0-9]/g, '');
        
        // Update DOM element to reflect the cleaned value
        target.value = cleanedValue;

        // Update the signal with the cleaned value
        this.integerSignal.set(cleanedValue);
    }
    
}