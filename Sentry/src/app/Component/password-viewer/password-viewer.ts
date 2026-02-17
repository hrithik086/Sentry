import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, Signal, WritableSignal } from '@angular/core';
import { EncryptDecryptService } from '../../Services/EncryptDecrypt/encrypt-decrypt-service';
import { FileManager } from '../../Services/FileManager/file-manager';
import { invoke } from 'lodash';
import { Credentials } from '../../Models/Credentials';
import { CredentialsCardDetails } from '../../Models/ViewModel/CredentialsCardDetails'

@Component({
  selector: 'app-password-viewer',
  imports: [CommonModule],
  templateUrl: './password-viewer.html',
  styleUrl: './password-viewer.css',
})
export class PasswordViewer {
  private encryptionDecryptionService: EncryptDecryptService = inject(EncryptDecryptService);
  private fileManagerService: FileManager = inject(FileManager);

  public credentials : WritableSignal<CredentialsCardDetails[]>;

  constructor(){
    this.credentials = linkedSignal(() => {
      return this.fileManagerService.allCredentialDetails().map((cred) => {
        return {
          ...cred,
          id: cred.domainName+cred.userId,
          expanded : false,
          showPassword : false
        } as CredentialsCardDetails;
      })
    });
  }

  toggleExpand(id: string, expandValue : boolean) {
    this.credentials().forEach((item) => {
      if(item.id === id){
        item.expanded = expandValue;
      }
    })
  }

  togglePassword(index: number) {
    this.credentials()[index].password = this.fileManagerService.decryptedCredentials(this.credentials()[index].domainName, this.credentials()[index].userId);
    this.credentials()[index].showPassword = !this.credentials()[index].showPassword;
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
