import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ThemeService } from './Services/Theme/theme-service';

@Component({
  selector: 'app-root',
  imports: [MatButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly themeService = inject(ThemeService);
  protected readonly title = signal('Sentry');
}
