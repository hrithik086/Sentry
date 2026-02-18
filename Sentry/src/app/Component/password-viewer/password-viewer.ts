import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, Signal, WritableSignal } from '@angular/core';
import { EncryptDecryptService } from '../../Services/EncryptDecrypt/encrypt-decrypt-service';
import { FileManager } from '../../Services/FileManager/file-manager';
import { invoke } from 'lodash';
import { Credentials } from '../../Models/Credentials';
import { CredentialsCardDetails } from '../../Models/ViewModel/CredentialsCardDetails'
import { CredentialsCardDetailsComponent } from '../credentials-card-details/credentials-card-details';

@Component({
  selector: 'app-password-viewer',
  imports: [CommonModule, CredentialsCardDetailsComponent],
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

  toggleExpand(id: string) {
    this.credentials().forEach((item) => {
      if(item.id === id){
        item.expanded = !item.expanded;
      }
    })
  }

  togglePassword(id:string) {
    this.credentials().forEach((item) => {
      if(item.id === id){
        item.password = this.fileManagerService.decryptedCredentials(item.domainName, item.userId);
        item.showPassword = !item.showPassword;
        return;
      }
    });
  }
}
