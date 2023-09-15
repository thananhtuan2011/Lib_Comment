import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
const KEY_SSO_TOKEN = 'sso_token';
@Injectable({
  providedIn: 'root',
})
export class HttpUtilsService {
  constructor(private auth: AuthService, private cookieService: CookieService) { }

  public getAuthFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage")!);
  }
  getToken() {
    const access_token = this.cookieService.get(KEY_SSO_TOKEN);
    // console.log("access_token", access_token)
    if (access_token) {
      return access_token
    }
    else {
      const dt = this.getAuthFromLocalStorage();
      const tokenlocal = dt.access_token;
      // console.log("tokenlocal", tokenlocal)
      return tokenlocal
    }

  }
  getHTTPHeaders(): HttpHeaders {
    // const auth = this.auth.getAuthFromLocalStorage();
    const access_token = this.getToken();
    let result = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'TimeZone': (new Date()).getTimezoneOffset().toString()
    });
    return result;
  }

  getHTTPHeadersVersion(version: any): HttpHeaders {
    const auth = this.auth.getAuthFromLocalStorage();
    let result = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.access_token}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'TimeZone': (new Date()).getTimezoneOffset().toString(),
      'x-api-version': `${version}`,
    });
    return result;
  }
}
