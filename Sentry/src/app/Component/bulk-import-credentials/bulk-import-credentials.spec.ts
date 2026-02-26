import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkImportCredentials } from './bulk-import-credentials';

describe('BulkImportCredentials', () => {
  let component: BulkImportCredentials;
  let fixture: ComponentFixture<BulkImportCredentials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkImportCredentials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkImportCredentials);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
