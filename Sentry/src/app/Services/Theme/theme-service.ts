import { DOCUMENT, inject, Injectable } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private readonly document = inject(DOCUMENT);

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
}
