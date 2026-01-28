import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordViewer } from './password-viewer';

describe('PasswordViewer', () => {
  let component: PasswordViewer;
  let fixture: ComponentFixture<PasswordViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
