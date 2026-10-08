import { Component, computed, effect, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// import { NumericInputDirective } from './numeric-input.directive';

// Business rule: the amount must be greater than zero
const positiveAmount: ValidatorFn = (control) => {
  const n = Number(control.value);
  return control.value !== '' && !(n > 0) ? { positive: true } : null;
};

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

export interface TransactionConfig {
  label: string;
  showTo: boolean;   // does it put money into one of your accounts?
}

export const TRANSACTION_CONFIG: Record<TransactionType, TransactionConfig> = {
  deposit: { label: 'Deposit', showTo: false },
  withdrawal: { label: 'Withdrawal', showTo: false },
  transfer: { label: 'Transfer', showTo: true },
};

// Type guard: checks that an arbitrary string is a real transaction type
export function isTransactionType(value: unknown): value is TransactionType {
  return typeof value === 'string' && value in TRANSACTION_CONFIG;
}

@Component({
  selector: 'app-transaction-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    //NumericInputDirective,
  ],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm {
  private router = inject(Router);

  type = input<string>();
  currentType = computed<TransactionType>(() => {
    const t = this.type();
    return isTransactionType(t) ? t : 'deposit';
  });
  config = computed(() => TRANSACTION_CONFIG[this.currentType()]);

  form = new FormGroup({
    amount: new FormControl('', { nonNullable: true, validators: [Validators.required, positiveAmount] }),
    to: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    effect(() => {
      const to = this.form.controls.to;
      if (this.config().showTo) {
        to.enable();
      } else {
        to.reset();   // clear any stale value from a previous transfer
        to.disable(); // excluded from validation and form.value
      }
    });
  }

  changeType(type: TransactionType) {
    this.router.navigate(['/transaction', type]);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // reveals every error message at once
      return;
    }
    // .value leaves out disabled controls, so only relevant fields are sent
    const payload = { type: this.currentType(), ...this.form.value };
    console.log('Submitting', payload);
  }
}