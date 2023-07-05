import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ReturnFilterComment } from '../Models/jee-comment.model';
import { environment } from '../../environments/environment.prod';
import { CookieService } from 'ngx-cookie-service';
const KEY_SSO_TOKEN = 'sso_token';
const HUB_JEECOMMENT_URL = environment.HOST_JEECOMMENT_API + '/hub/commentv2';

@Injectable()
export class JeeCommentSignalrService {
  private hubConnection!: HubConnection;
  public _showChange$: BehaviorSubject<ReturnFilterComment> = new BehaviorSubject<ReturnFilterComment>(new ReturnFilterComment());

  get showChange$() {
    return this._showChange$.asObservable();
  }
  constructor(private http: HttpClient, private _authService: AuthService, private cookieService: CookieService) { }

  connectToken(topicObjectID: string) {

    // const data = this._authService.getAuthFromLocalStorage();
    const access_token = this.cookieService.get(KEY_SSO_TOKEN);
    this.hubConnection = new HubConnectionBuilder()

      .withUrl(HUB_JEECOMMENT_URL + '?token=' + access_token + '&topicid=' + topicObjectID, {

        // skipNegotiation: true,

        //  transport: signalR.HttpTransportType.WebSockets

      }).withAutomaticReconnect()

      .build()

    this.hubConnection.onclose((error: any) => {
      console.log("Ngắt kết nối ở comment")
    });

    this.hubConnection.start().catch((err: any) => this.hubConnection.start());

    this.hubConnection.on('changeComment', (data: any) => {

      const result = JSON.parse(data);

      this._showChange$.next(result);

    });

  }

  CheckconnectComent() {
    if (this.hubConnection.state == 'Disconnected') {
      return false
    }
    else {
      return true;
    }
  }

  disconnectToken() {
    // const data = this._authService.getAuthFromLocalStorage();
    const access_token = this.cookieService.get(KEY_SSO_TOKEN);
    const token = `${access_token}`;
    this.hubConnection.stop();
  }

  stopHubConnectionComment() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch((error: any) => console.log(error));

    }
  }
}
