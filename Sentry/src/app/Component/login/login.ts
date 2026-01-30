import { Component, ElementRef, inject, ViewChild } from '@angular/core';
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
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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

  public onSubmit(): void {
    console.log(this.fileInput.nativeElement.files);
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
}
