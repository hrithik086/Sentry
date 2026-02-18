import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialsCardDetails } from './credentials-card-details';

describe('CredentialsCardDetails', () => {
  let component: CredentialsCardDetails;
  let fixture: ComponentFixture<CredentialsCardDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialsCardDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredentialsCardDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
