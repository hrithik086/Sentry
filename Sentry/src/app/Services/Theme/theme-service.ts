import { computed, DOCUMENT, inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private readonly document = inject(DOCUMENT);
  private currentTheme = signal<Theme>('system');

  public readonly getCurrentTheme = computed(() => this.currentTheme());

  constructor() {}

  setTheme(theme: Theme): void {
    if (theme === 'system') {
      this.document.body.classList.remove('light-mode', 'dark-mode');
    }
    else if (theme === 'light') {
      this.document.body.classList.add('light-mode');
      this.document.body.classList.remove('dark-mode');
    }
    else if (theme === 'dark') {
      this.document.body.classList.add('dark-mode');
      this.document.body.classList.remove('light-mode');
    }
  }

  toggleTheme(): void {
    if (this.document.body.classList.contains('dark-mode')) {
      this.setTheme('light');
      this.currentTheme.set('light');
    } else {
      this.setTheme('dark');
      this.currentTheme.set('dark');
    }
  }
}
