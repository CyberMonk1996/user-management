import { Routes } from '@angular/router';
import { AppUrlEnum } from './core/const/route.enums';

export const routes: Routes = [
    {
        path: '',
        redirectTo: `/${AppUrlEnum.USER}/${AppUrlEnum.LIST}`,
        pathMatch: 'full',
    },
    
    {
        path: `${AppUrlEnum.USER}/${AppUrlEnum.LIST}`,
        loadComponent: () => import('./features/user-list/user-list.component').then(m => m.UserListComponent),
    },
    {
        path: `${AppUrlEnum.USER}/${AppUrlEnum.ADD}`,
        loadComponent: () => import('./features/user/user.component').then(m => m.default),
    },
    {
        path: `${AppUrlEnum.USER}/:id`,
        loadComponent: () => import('./features/user/user.component').then(m => m.default),
    },
    { path: '**', pathMatch: 'full', redirectTo: `/${AppUrlEnum.USER}/${AppUrlEnum.LIST}` },
];
