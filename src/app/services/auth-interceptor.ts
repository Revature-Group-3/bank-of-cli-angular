
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const token = auth.getToken();

    // Don't modify requests if the user isn't logged in.
    if (!token) {
        return next(req);
    }

    // Only attach the token to requests going to our backend.
    if (!req.url.startsWith('http://localhost:8080/api/')) {
        return next(req);
    }

    // Clone the request and attach the JWT.
    const authenticatedRequest = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    return next(authenticatedRequest);
};
