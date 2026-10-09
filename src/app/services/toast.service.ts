import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  private dismissTimeout: ReturnType<typeof setTimeout> | undefined;

  toastState$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' = 'success') {
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
    }

    this.toastSubject.next({ text: message, type });
    this.dismissTimeout = setTimeout(() => this.dismiss(), 3000);
  }

  dismiss() {
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
      this.dismissTimeout = undefined;
    }

    this.toastSubject.next(null);
  }
}
