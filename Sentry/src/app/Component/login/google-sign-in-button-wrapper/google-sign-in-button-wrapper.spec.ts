import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSignInButtonWrapper } from './google-sign-in-button-wrapper';

describe('GoogleSignInButtonWrapper', () => {
  let component: GoogleSignInButtonWrapper;
  let fixture: ComponentFixture<GoogleSignInButtonWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleSignInButtonWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleSignInButtonWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
