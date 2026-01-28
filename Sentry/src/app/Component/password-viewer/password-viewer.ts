import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-password-viewer',
  imports: [CommonModule],
  templateUrl: './password-viewer.html',
  styleUrl: './password-viewer.css',
})
export class PasswordViewer {
  credentials: Array<any> = [
    {
      siteName: 'Google',
      url: 'https://accounts.google.com',
      username: 'youremail@gmail.com',
      password: 'P@ssw0rd!23',
      lastUsed: '2 days ago',
      expanded: false,
      showPassword: false,
    },
    {
      siteName: 'GitHub',
      url: 'https://github.com',
      username: 'dev-user',
      password: 'ghp_verysecret',
      lastUsed: '1 week ago',
      expanded: false,
      showPassword: false,
    },
    {
      siteName: 'Figma',
      url: 'https://www.figma.com',
      username: 'designer@example.com',
      password: 'designPass#1',
      lastUsed: '3 weeks ago',
      expanded: false,
      showPassword: false,
    },
  ];

  toggleExpand(index: number) {
    this.credentials[index].expanded = !this.credentials[index].expanded;
  }

  togglePassword(index: number) {
    this.credentials[index].showPassword = !this.credentials[index].showPassword;
  }

  mask(password: string) {
    return '•'.repeat(Math.min(12, password.length));
  }

  getInitials(name: string) {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  copyToClipboard(text: string) {
    if (!text) return;
    if ((navigator as any).clipboard && (navigator as any).clipboard.writeText) {
      (navigator as any).clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
  }
}
