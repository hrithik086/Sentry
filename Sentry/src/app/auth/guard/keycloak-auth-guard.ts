import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { KeycloakOidc } from '../oidc/keycloak-oidc';

export const keycloakAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(KeycloakOidc)
  
  //check if the navigation is from the login screen
  const pathArr = window.location.pathname.split('/');
  if(pathArr[pathArr.length - 1]){
    const redirectUrl = window.location.origin + state.url;
    return auth.isAuthenticated(redirectUrl);
  }

  return auth.isAuthenticated();
};
