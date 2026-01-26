import { Routes } from '@angular/router';
import { Login } from './Component/login/login';
import { PasswordViewer } from './Component/login/password-viewer/password-viewer';

export const routes: Routes = [
    {path: 'GetCredential', component: Login},
    {path: 'PasswordViewer', component: PasswordViewer},
];
