import { Pipe, PipeTransform, LOCALE_ID } from '@angular/core';
import { formatCurrency } from '@angular/common';

// Converts integer of cents to string of dollars
@Pipe({
  name: 'centsIntegerToDollarString',
  standalone: true
})
export class CentsIntegerToDollarStringPipe implements PipeTransform {
  transform(cents: number | undefined): string {
    // 0. Return empty string if number of cents is invalid
    if (cents === null || cents === undefined || isNaN(cents)) {
      return '';
    }

    // 1. Convert cents integer to a dollar decimal
    const dollars = cents / 100;

    // 2. Set appropriate currency symbol
    const currencySymbol = '$';

    // 3. Format the number as a currency string (e.g., $1,234.56)
    return formatCurrency(dollars, "en-US", currencySymbol, 'USD', '1.2-2');
  }
}
