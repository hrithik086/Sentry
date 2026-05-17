import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInitOptions } from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakOidc {
  keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "My Test Realm",
    clientId: "Sentry-Ui-Client"
  });

  public async isAuthenticated(redirectUri: string = '') : Promise<boolean>{
    try{
      const keycloadInitOptions : KeycloakInitOptions = {
        onLoad: 'login-required',
        pkceMethod: 'S256'
      }
      keycloadInitOptions.redirectUri = redirectUri?.trim().length > 0 ? redirectUri : undefined;
      const authenticated = await this.keycloak.init(keycloadInitOptions);
      return authenticated;
    }
    catch(error){
      console.log(error);
    }
    return false;
  }
}
