import { Component, inject } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FileManager } from '../../Services/FileManager/file-manager';

@Component({
  selector: 'app-login',
  imports: [MatFormField, MatLabel, MatIcon],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fileManager: FileManager = inject(FileManager);

  websiteTitle: string = 'SENTRY';
  tagLine: string = 'Securely manage your credentials';
  hide: boolean = true;
}
