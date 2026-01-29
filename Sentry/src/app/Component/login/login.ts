import { Component, inject, ViewChild } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FileManager } from '../../Services/FileManager/file-manager';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [MatFormField, MatLabel, MatIcon, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fileManager: FileManager = inject(FileManager);

  public readonly loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: [''],
      uploadedFile: [null, Validators.required]
    });
  }

  websiteTitle: string = 'SENTRY';
  tagLine: string = 'Securely manage your credentials';
  hide: boolean = true;

  //i have to remove this method and find out some alternate way
  public onFileChange(event: any): void {
    const inputElement: HTMLInputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.loginForm.patchValue({
        uploadedFile: file
      });
    }
  }

  public onSubmit(): void {
    if(this.loginForm.valid) {
      this.fileManager.readJsonFile(this.loginForm.value.uploadedFile);
    }
  }
}
