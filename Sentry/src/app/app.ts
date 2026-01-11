import { Component, inject, signal } from '@angular/core';
import { MatButton, MatFabButton } from '@angular/material/button';
import { ThemeService } from './Services/Theme/theme-service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [MatButton, MatIcon],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly themeService = inject(ThemeService);
  protected readonly title = signal('Sentry');
}
