import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'app-add-new-credential',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-new-credential.html',
  styleUrl: './add-new-credential.css',
})
export class AddNewCredential implements OnInit {
  @Output()
  public onCardCloseEvent: EventEmitter<void> = new EventEmitter();

  credentialForm!: FormGroup;

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

  get otherDetailsControl(): FormArray {
    return this.credentialForm.get('otherDetails') as FormArray;
  }

  otherDetailsArray() {
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
      const formData = this.credentialForm.value;
      console.log('Form submitted:', formData);
      // Add your submit logic here
    }
  }

  closeCard(){
    this.onCardCloseEvent.emit();
  }
}
