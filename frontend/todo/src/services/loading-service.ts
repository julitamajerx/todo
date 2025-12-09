import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = new BehaviorSubject<boolean>(false);

  public readonly loading$: Observable<boolean> = this.loading.asObservable().pipe(delay(1));

  private startTime: number = 0;
  private readonly MIN_DURATION_MS = 1000;

  public show(): void {
    if (!this.loading.value) {
      this.startTime = Date.now();
      this.loading.next(true);
    }
  }

  public hide(): void {
    const elapsedTime = Date.now() - this.startTime;

    const remainingTime = this.MIN_DURATION_MS - elapsedTime;

    if (remainingTime > 0) {
      timer(remainingTime).subscribe(() => {
        this.loading.next(false);
      });
    } else {
      this.loading.next(false);
    }
  }
}
