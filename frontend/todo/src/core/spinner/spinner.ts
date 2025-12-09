import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../../services/loading-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-spinner',
  imports: [AsyncPipe],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner {
  protected loading: Observable<boolean>;

  private loadingService = inject(LoadingService);

  constructor() {
    this.loading = this.loadingService.loading$;
  }
}
