import { HttpErrorResponse } from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'An unknown error occurred';

      if (error.error?.message) {
        errorMsg = error.error.message;
      } else if (error.status) {
        errorMsg = `Error ${error.status}: ${error.statusText}`;
      }

      console.log('Global HTTP Error:', errorMsg, error);

      return throwError(() => new Error(errorMsg));
    }),
  );
};
