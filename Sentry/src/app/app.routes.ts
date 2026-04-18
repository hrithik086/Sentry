import { Routes } from '@angular/router';
import { Login } from './Component/login/login';
import { PasswordViewer } from './Component/password-viewer/password-viewer';
import { AddNewCredential } from './Component/add-new-credential/add-new-credential';
import { keycloakAuthGuard } from './auth/guard/keycloak-auth-guard';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'Login'},
    {path: 'Login', component: Login},
    {
        path: 'PasswordManager',
        canActivateChild: [keycloakAuthGuard],
        children: [
            {path: 'PasswordViewer', component: PasswordViewer},
            {path: 'AddCredential', component: AddNewCredential}
        ]
    }
];
