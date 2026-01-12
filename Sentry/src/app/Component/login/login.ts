import { Component } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [MatFormField, MatLabel, MatIcon],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  websiteTitle: string = 'SENTRY';
  tagLine: string = 'Securely manage your credentials';
  hide: boolean = true;
}
