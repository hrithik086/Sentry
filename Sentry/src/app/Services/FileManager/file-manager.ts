import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { LoginDetailsAndCredentials } from '../../Models/DTO/LoginDetaiilsAndCredentials';
import { DecryptedCredentials } from '../../Models/DecryptedCredentials';
import { cloneDeep, forEach } from 'lodash';
import { Credentials } from '../../Models/Credentials';
import { OtherCredentialDetails } from '../../Models/OtherCredentialDetails';


@Injectable({
  providedIn: 'root',
})
export class FileManager {
  private _allCredentialDetails: LoginDetailsAndCredentials;
  private _decryptedCredentials: DecryptedCredentials[];
  private _encryptedCredentials: WritableSignal<Credentials[]>;

  public readJsonFile(file: File): void {
    let reader = new FileReader();
    reader.onload = (event: any) => {
      try {
        const json = JSON.parse(event.target.result);
        this._allCredentialDetails = json as LoginDetailsAndCredentials;
        console.log('JSON content:', json);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    };
    reader.readAsText(file);
  }

  public get allCredentialDetails(): Signal<Credentials[]> {
    if(this._encryptedCredentials == null)
      this._encryptedCredentials = signal<Credentials[]>(this._allCredentialDetails.credentials);
    return this._encryptedCredentials.asReadonly();
  }
  
  public decryptedCredentials(domainName: string, userId: string) : string{
    const credentials = this._decryptedCredentials.filter((decryptedCredential) => decryptedCredential.userId === userId && decryptedCredential.domainName === domainName);
    if(credentials && credentials.length > 0){
      if(credentials.length > 1){
        // throw error
        return '';
      }
      else{
        return this.decryptString(credentials[0].password);
      }
    }
    else{
      const encryptedCredentialIndex = this._allCredentialDetails.credentials.findIndex((cred) => cred.domainName === domainName && cred.userId === cred.userId);
      if(encryptedCredentialIndex >= 0){
        const decryptedPassword = this.decryptString(this._allCredentialDetails.credentials[encryptedCredentialIndex].password);
        const decryptedCredentialsObject = new DecryptedCredentials();
        decryptedCredentialsObject.initializeDecryptedCredentials(this._allCredentialDetails.credentials[encryptedCredentialIndex], decryptedPassword);
        return decryptedPassword;
      }
      else{
        //throw error
        return '';
      }
    }
  }

  private refreshEncryptedCredentialsSignal() : void{
    this._encryptedCredentials.set(this._allCredentialDetails.credentials);
  }

  public addEncryptedCredential(newCredential: Credentials) : void{
    const checkExistingCredentials = this._allCredentialDetails.credentials.filter((credential) => credential.domainName === newCredential.domainName && credential.userId === newCredential.userId);
    if(checkExistingCredentials.length === 0){
      this._allCredentialDetails.credentials.push(newCredential);
      this.refreshEncryptedCredentialsSignal();
    }
  }

  public updateCredentials(decryptedCred: DecryptedCredentials){
    const encryptedCred = this._allCredentialDetails.credentials.filter((cred) => cred.domainName === decryptedCred.domainName && cred.userId === decryptedCred.userId);
    if(encryptedCred.length > 0){
      this.updateValuesFromDecryptedCredentialtoEncryptedCredentials(encryptedCred[0], decryptedCred);
      this.refreshEncryptedCredentialsSignal();
      this.updateDecryptedCredentialsCache(decryptedCred);
    }
    else{
      //throw error
    }
  }

  public removeEncryptedCredentials(domainName: string, userId: string) : void{
    const filteredCredentials = this._allCredentialDetails.credentials.filter((cred) => cred.domainName === domainName && cred.userId === userId);
    if(filteredCredentials.length === 1){
      let index = this._allCredentialDetails.credentials.findIndex((cred) => cred.domainName==domainName && cred.userId === userId);
      this._allCredentialDetails.credentials.splice(index, 1);

      index = this._decryptedCredentials.findIndex((cred) => cred.domainName==domainName && cred.userId === userId);
      if(index >= 0)
        this._decryptedCredentials.splice(index,1);

      this.refreshEncryptedCredentialsSignal();
    }
    else if(filteredCredentials.length > 1){
      //log error that there are duplicates and we need to remove all and then we need to add one
    }
    else{
      //log error that there is no object which is matching the domain name and userid.
    }
  }

  private decryptString(cipherText: string) : string{
    //this logic should be moved to new service class responsible for encryptiona and decryption related logics
    //decryption logic to be implemented
    return ""
  }

  private encryptString(plainText : string) : string {
    //this logic should be moved to new service class responsible for encryptiona and decryption related logics
    //decryption logic to be implemented
    return ''
  }

  private updateValuesFromDecryptedCredentialtoEncryptedCredentials(encryptedCred: Credentials, decryptedCred: DecryptedCredentials) : void{
    encryptedCred.password = this.encryptString(decryptedCred.password);
    encryptedCred.pin = this.encryptString(decryptedCred.pin);
    encryptedCred.securityKeys = this.encryptString(decryptedCred.securityKeys);
    encryptedCred.otherDetails = decryptedCred.otherDetails;
    
    encryptedCred.otherDetails?.forEach((item : OtherCredentialDetails) => item.value = this.encryptString(item.value));
  }

  private updateDecryptedCredentialsCache(decryptedCred: DecryptedCredentials) : void{
    const cache = this._decryptedCredentials.filter((cred) => cred.domainName === decryptedCred.domainName && cred.userId === decryptedCred.userId);
    if(cache.length > 0){
      cache[0] = decryptedCred;
    }
    else{
      this._decryptedCredentials.push(decryptedCred);
    }
  }
}