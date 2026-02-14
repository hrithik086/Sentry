import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { LoginDetailsAndCredentials } from '../../Models/DTO/LoginDetaiilsAndCredentials';
import { DecryptedCredentials } from '../../Models/DecryptedCredentials';
import { cloneDeep, forEach } from 'lodash';
import { Credentials } from '../../Models/Credentials';
import { OtherCredentialDetails } from '../../Models/OtherCredentialDetails';
import { DuplicateCredentialError } from '../../Core/Error/DuplicateCredentialError';
import { NoCredentialFoundError } from '../../Core/Error/NoCredentialFoundError';
import { EncryptDecryptService } from '../EncryptDecrypt/encrypt-decrypt-service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FileManager {
  private encryptDecryptService : EncryptDecryptService = inject(EncryptDecryptService);

  private _allCredentialDetails: LoginDetailsAndCredentials;
  private _decryptedCredentialsCache: DecryptedCredentials[] = [];
  private _encryptedCredentials: WritableSignal<Credentials[]>;
  private _jsonReadSuccessful : Subject<boolean> = new Subject<boolean>();

  public readJsonFile(file: File): void {
    let reader = new FileReader();
    reader.onload = (event: any) => {
      try {
        const json = JSON.parse(event.target.result);
        this._allCredentialDetails = json as LoginDetailsAndCredentials;
        this._jsonReadSuccessful.next(true);
        console.log('JSON content:', json);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        this._jsonReadSuccessful.next(false);
      }
    };
    reader.readAsText(file);
  }

  public exportJsonFile() : void {
    const blob = this.convertToJsonBlobFile();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this._allCredentialDetails.fileName + '.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  public get allCredentialDetails(): Signal<Credentials[]> {
    if(this._encryptedCredentials == null)
      this._encryptedCredentials = signal<Credentials[]>(this._allCredentialDetails.credentials);
    return this._encryptedCredentials.asReadonly();
  }

  public get JsonReadSuccessfulObservable() : Observable<boolean> {
    return this._jsonReadSuccessful.asObservable();
  }

  public get HashedPasswordFromJson() : string {
    return this._allCredentialDetails.password;
  }
  
  public decryptedCredentials(domainName: string, userId: string) : string{
    const caccheCredentials = this._decryptedCredentialsCache?.filter((decryptedCredential) => decryptedCredential.userId === userId && decryptedCredential.domainName === domainName);
    if(caccheCredentials && caccheCredentials.length > 0){
      if(caccheCredentials.length > 1){
        throw new DuplicateCredentialError('two or more credentials found with same user id and domain name combination');
      }
      else{
        return this.encryptDecryptService.decryptString(caccheCredentials[0].password);
      }
    }
    else{
      const encryptedCredentialIndex = this._allCredentialDetails.credentials.findIndex((cred) => cred.domainName === domainName && cred.userId === cred.userId);
      if(encryptedCredentialIndex >= 0){
        const decryptedPassword = this.encryptDecryptService.decryptString(this._allCredentialDetails.credentials[encryptedCredentialIndex].password);
        
        const decryptedCredentialsObject = new DecryptedCredentials();
        decryptedCredentialsObject.initializeDecryptedCredentials(this._allCredentialDetails.credentials[encryptedCredentialIndex], decryptedPassword);
        this._decryptedCredentialsCache.push(decryptedCredentialsObject);

        return decryptedPassword;
      }
      else{
        throw new NoCredentialFoundError('No credentials found with the given domain and username');
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
    else{
      throw new DuplicateCredentialError('Found duplicate domain name and user id combination in the database');
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
      throw new NoCredentialFoundError('No Credentials are matching with the given username and domain name');
    }
  }

  public removeEncryptedCredentials(domainName: string, userId: string) : void{
    const filteredCredentials = this._allCredentialDetails.credentials.filter((cred) => cred.domainName === domainName && cred.userId === userId);
    if(filteredCredentials.length === 1){
      let index = this._allCredentialDetails.credentials.findIndex((cred) => cred.domainName==domainName && cred.userId === userId);
      this._allCredentialDetails.credentials.splice(index, 1);

      index = this._decryptedCredentialsCache.findIndex((cred) => cred.domainName==domainName && cred.userId === userId);
      if(index >= 0)
        this._decryptedCredentialsCache.splice(index,1);

      this.refreshEncryptedCredentialsSignal();
    }
    else if(filteredCredentials.length > 1){
      throw new DuplicateCredentialError('two or more credentials found with the same domain name and user id');
    }
    else{
      throw new NoCredentialFoundError('No Credentials found with the provided domain name and user id.')
    }
  }

  private updateValuesFromDecryptedCredentialtoEncryptedCredentials(encryptedCred: Credentials, decryptedCred: DecryptedCredentials) : void{
    encryptedCred.password = this.encryptDecryptService.encryptString(decryptedCred.password);
    encryptedCred.pin = this.encryptDecryptService.encryptString(decryptedCred.pin);
    encryptedCred.securityKeys = this.encryptDecryptService.encryptString(decryptedCred.securityKeys);
    encryptedCred.otherDetails = decryptedCred.otherDetails;
    
    encryptedCred.otherDetails?.forEach((item : OtherCredentialDetails) => item.value = this.encryptDecryptService.encryptString(item.value));
  }

  private updateDecryptedCredentialsCache(decryptedCred: DecryptedCredentials) : void{
    const cache = this._decryptedCredentialsCache.filter((cred) => cred.domainName === decryptedCred.domainName && cred.userId === decryptedCred.userId);
    if(cache.length > 0){
      cache[0] = decryptedCred;
    }
    else{
      this._decryptedCredentialsCache.push(decryptedCred);
    }
  }

  private convertToJsonBlobFile() : Blob{
    const jsonString = JSON.stringify(this._allCredentialDetails);
    const blob = new Blob([jsonString], {type: 'application/json'});
    return blob;
  }
}