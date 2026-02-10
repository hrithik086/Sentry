import { Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FileManager } from '../../Services/FileManager/file-manager';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { EncryptDecryptService } from '../../Services/EncryptDecrypt/encrypt-decrypt-service';

@Component({
  selector: 'app-login',
  imports: [MatFormField, MatLabel, MatIcon, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy{
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private fileManager: FileManager = inject(FileManager);
  private encryptDecryptService : EncryptDecryptService = inject(EncryptDecryptService);
  private jsonReadSuccessfulSubscription : Subscription;

  public readonly loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: [''],
      uploadedFile: [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.jsonReadSuccessfulSubscription.unsubscribe();
  }

  websiteTitle: string = 'SENTRY';
  tagLine: string = 'Securely manage your credentials';
  hide: boolean = true;

  public onSubmit(): void {
    this.jsonReadSuccessfulSubscription = this.fileManager.JsonReadSuccessfulObservable.subscribe(this.jsonReadSuccessfulListener);

    if(this.fileInput.nativeElement.files && this.fileInput.nativeElement.files.length > 0) {
      const file = this.fileInput.nativeElement.files[0];
      this.loginForm.patchValue({
        uploadedFile: file
      });
    }
    if(this.loginForm.valid) {
      this.fileManager.readJsonFile(this.loginForm.value.uploadedFile);
    }
  }

  private jsonReadSuccessfulListener(status : boolean) : void {
    this.encryptDecryptService.
  }
}
