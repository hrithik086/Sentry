import { Routes } from '@angular/router';
import { Login } from './Component/login/login';
import { PasswordViewer } from './Component/password-viewer/password-viewer';
import { AddNewCredential } from './Component/add-new-credential/add-new-credential';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'Login'},
    {path: 'Login', component: Login},
    {path: 'PasswordViewer', component: PasswordViewer},
    {path: 'AddCredential', component: AddNewCredential}
];
