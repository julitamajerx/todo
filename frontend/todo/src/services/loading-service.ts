import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _isLoading = signal(false);
  public isLoading = this._isLoading.asReadonly();

  private startTime = 0;
  private readonly MIN_DURATION_MS = 1000;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private timeoutId: any = null;

  public show(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (!this._isLoading()) {
      this.startTime = Date.now();
      this._isLoading.set(true);
    }
  }

  public hide(): void {
    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.max(0, this.MIN_DURATION_MS - elapsedTime);

    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this._isLoading.set(false);
      this.timeoutId = null;
    }, remainingTime);
  }
}
