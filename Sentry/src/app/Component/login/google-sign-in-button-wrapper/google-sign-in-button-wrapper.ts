import { AfterViewInit, Component, EventEmitter, inject, Inject, input, NgZone, OnDestroy, output, Output, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

declare const google: any;

@Component({
  selector: 'app-google-sign-in-button-wrapper',
  templateUrl: './google-sign-in-button-wrapper.html',
  styleUrl: './google-sign-in-button-wrapper.css',
  standalone: true
})
export class GoogleSignInButtonWrapper implements AfterViewInit, OnDestroy {
  authCompletionEvent = output<any>();
  //i need to make this dynamically fetch from api.
  private clientId: string = '1021269737526-ehrr84a5ffl308kudld700nn6vbrpc8b.apps.googleusercontent.com'

  private scriptId = 'google-gsi-client-script';
  private intervalId?: number;

  private readonly renderer = inject(Renderer2)
  private readonly document: Document = inject(DOCUMENT);

  ngAfterViewInit(): void {
    this.loadScriptAndInitialize();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  handleGoogleSsoLogin(response:any){
    const payload = this.decodeJwtToken(response.credential);
    sessionStorage.setItem('user', JSON.stringify(payload));
    this.authCompletionEvent.emit(response);
  }

  handleGoogleLogin() {
    this.createFakeGoogleWrapper();
  }

  private loadScriptAndInitialize(): void {
    // If the google object is ready, we can initialize the button right away.
    if (typeof google !== 'undefined' && google.accounts) {
      this.initializeGoogleButton();
      return;
    }

    // Check if the script tag is already in the DOM.
    const script = this.document.getElementById(this.scriptId);

    if (script) {
      // If the script tag exists but `google` isn't ready, it means the script is still loading.
      // We'll wait for it to be available.
      this.waitForGoogleLibrary();
    } else {
      // If the script tag doesn't exist, create it and load the script.
      this.insertScript();
    }
  }

  private insertScript(): void {
    //this method avoids putting <script src="https://accounts.google.com/gsi/client" async></script> in the index.html, it inserts it dynamically
    //no where it will be helpful, i just did it because i wanted to make a single component solution for google sso login.
    const script = this.renderer.createElement('script');
    script.id = this.scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    this.renderer.listen(script, 'load', () => {
      this.initializeGoogleButton();
    });

    this.renderer.listen(script, 'error', () => {
      console.error('Google Sign-In script could not be loaded.');
    });

    this.renderer.appendChild(this.document.body, script);
  }

  private waitForGoogleLibrary(): void {
    // Poll every 100ms for the `google` object to become available.
    this.intervalId = window.setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        window.clearInterval(this.intervalId);
        this.initializeGoogleButton();
      }
    }, 100);
  }

  private initializeGoogleButton(): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback : (response: any) => {
        this.handleGoogleSsoLogin(response);
      }
    });
  }

  private decodeJwtToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  private createFakeGoogleWrapper = () => {
    const googleLoginWrapper = document.createElement('div');
    googleLoginWrapper.style.display = 'none';
    googleLoginWrapper.id = 'googleSignIn';
    googleLoginWrapper.classList.add('custom-google-button');
    document.body.appendChild(googleLoginWrapper);

    (window as any).google.accounts.id.renderButton(googleLoginWrapper, {
      theme: "filled_blue",
      size: "large",
      shape: "rectangular",
      text: "signin_with",
      logo_alignment: "left"
    })

    const googleLoginWrapperButton = googleLoginWrapper.querySelector(
      'div[role=button]'
    ) as HTMLElement;

    googleLoginWrapperButton?.click();
  };
}
