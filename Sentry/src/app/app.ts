import { Component, inject, signal } from '@angular/core';
import { MatButton, MatFabButton } from '@angular/material/button';
import { ThemeService } from './Services/Theme/theme-service';
import { MatIcon } from '@angular/material/icon';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [MatButton, MatIcon, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly themeService = inject(ThemeService);
  protected readonly title = signal('Sentry');
}
