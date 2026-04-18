import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { KeycloakOidc } from '../oidc/keycloak-oidc';

export const keycloakAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(KeycloakOidc)
  
  return auth.isAuthenticated();
};
