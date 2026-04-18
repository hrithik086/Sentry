import { TestBed } from '@angular/core/testing';

import { KeycloakOidc } from './keycloak-oidc';

describe('KeycloakOidc', () => {
  let service: KeycloakOidc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeycloakOidc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
