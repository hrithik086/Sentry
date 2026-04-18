import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakOidc {
  keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "My Test Realm",
    clientId: "Sentry-Ui-Client"
  });

  public async isAuthenticated() : Promise<boolean>{
    try{
      var authenticated = await this.keycloak.init({
        onLoad: 'login-required',
        pkceMethod: 'S256'
      });
      return authenticated;
    }
    catch(error){
      console.log(error);
    }
    return false;
  }
}
