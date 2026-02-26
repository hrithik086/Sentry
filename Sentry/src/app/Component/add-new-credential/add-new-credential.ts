import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { FileManager } from '../../Services/FileManager/file-manager';
import { OtherCredentialDetails } from '../../Models/OtherCredentialDetails';
import { DecryptedCredentials } from '../../Models/DecryptedCredentials';
import { BulkImportCredentials } from '../bulk-import-credentials/bulk-import-credentials';

@Component({
  selector: 'app-add-new-credential',
  imports: [CommonModule, ReactiveFormsModule, BulkImportCredentials],
  templateUrl: './add-new-credential.html',
  styleUrl: './add-new-credential.css',
})
export class AddNewCredential implements OnInit {
  @Output()
  public onCardCloseEvent: EventEmitter<void> = new EventEmitter();

  credentialForm!: FormGroup;
  selectedTab: 'add' | 'import' = 'add';
  private fileService = inject(FileManager)

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.credentialForm = this.fb.group({
      domainName: ['', Validators.required],
      userId: ['', Validators.required],
      password: ['', Validators.required],
      pin: [''],
      securityKeys: [''],
      otherDetails: this.fb.array([]),
    });
  }

  private get otherDetailsControl(): FormArray {
    return this.credentialForm.get('otherDetails') as FormArray;
  }

  public get otherDetailsArray() {
    return this.otherDetailsControl;
  }

  addOtherDetail(): void {
    const otherDetailGroup = this.fb.group({
      informationType: [''],
      key: [''],
      value: [''],
    });
    this.otherDetailsControl.push(otherDetailGroup);
  }

  removeOtherDetail(index: number): void {
    this.otherDetailsControl.removeAt(index);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.credentialForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.credentialForm.valid) {
      const otherDetails = this.credentialForm.value.otherDetails;
      const filteredOtherDetails = otherDetails.filter((detail : OtherCredentialDetails) => detail.informationType.length && detail.key.length && detail.value.length)
      this.credentialForm.patchValue({
        otherDetails: filteredOtherDetails
      });

      const decryptedCredential : DecryptedCredentials = {
        domainName : this.credentialForm.value.domainName,
        userId : this.credentialForm.value.userId,
        password: '',
        decryptedPassword: this.credentialForm.value.password,
        decryptedSecurityKeys: this.credentialForm.value.securityKeys?.length ? this.credentialForm.value.securityKeys : '',
        decryptedPin : this.credentialForm.value.pin?.length ? this.credentialForm.value.pin : '',
        decryptedOtherDetails: filteredOtherDetails
      };

      this.fileService.addNewCredential(decryptedCredential);
    }
  }

  closeCard(){
    this.onCardCloseEvent.emit();
  }

  selectTab(tab: 'add' | 'import'): void {
    this.selectedTab = tab;
  }
}
