import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EncryptDecryptService } from '../../Services/EncryptDecrypt/encrypt-decrypt-service';
import { FileManager } from '../../Services/FileManager/file-manager';
import { invoke } from 'lodash';

@Component({
  selector: 'app-password-viewer',
  imports: [CommonModule],
  templateUrl: './password-viewer.html',
  styleUrl: './password-viewer.css',
})
export class PasswordViewer {
  private encryptionDecryptionService: EncryptDecryptService = inject(EncryptDecryptService);
  private fileManagerService: FileManager = inject(FileManager);
  
  credentials: Array<any> = [
    {
      domainName: 'Google',
      url: 'https://accounts.google.com',
      userId: 'youremail@gmail.com',
      password: 'P@ssw0rd!23',
      lastUsed: '2 days ago',
      expanded: false,
      showPassword: false,
    },
    {
      domainName: 'GitHub',
      url: 'https://github.com',
      userId: 'dev-user',
      password: 'ghp_verysecret',
      lastUsed: '1 week ago',
      expanded: false,
      showPassword: false,
    },
    {
      domainName: 'Figma',
      url: 'https://www.figma.com',
      userId: 'designer@example.com',
      password: 'designPass#1',
      lastUsed: '3 weeks ago',
      expanded: false,
      showPassword: false,
    },
  ];

  constructor(){
    this.fileManagerService.allCredentialDetails;
  }

  toggleExpand(index: number) {
    this.credentials[index].expanded = !this.credentials[index].expanded;
  }

  togglePassword(index: number) {
    this.credentials[index].password = this.fileManagerService.decryptedCredentials(this.credentials[index].domainName, this.credentials[index].userId);
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
