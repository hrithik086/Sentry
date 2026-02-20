import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCredential } from './add-new-credential';

describe('AddNewCredential', () => {
  let component: AddNewCredential;
  let fixture: ComponentFixture<AddNewCredential>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewCredential]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewCredential);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
