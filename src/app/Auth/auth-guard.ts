import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const CanActivate = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.authenticated)
    {
        return true;
    }
    else
    {
        router.navigate(['']);
        return false;
    }
}

export const canDeactivate =() => {
    
}

export const CanCompActivate = (route: ActivatedRouteSnapshot,) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    let routeData = route.data;
    
    if (routeData && routeData["adminCheck"] == true){
        if (authService.UserType == 0)    {
            return false;
        }
    }

    if (authService.CompSelected)
    {
        return true;
    }
    else
    {        
        return false;
    }
}