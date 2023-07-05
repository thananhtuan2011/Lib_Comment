
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { finalize, share, tap } from 'rxjs/operators';
import { QueryFilterComment, UserCommentInfo, PostCommentModel, ReactionCommentModel } from '../Models/jee-comment.model';
import { AuthService } from './auth.service';
import { NotifiModel } from '../Models/notifi.model';
import { HttpUtilsService } from './http-utils.service';
import { environment } from '../../environments/environment.prod';

const API_JEECOMMENT_URL = environment.HOST_JEECOMMENT_API + '/api';
const API_JEEACCOUNT_URL = environment.HOST_JEEACCOUNT_API + '/api';
const JEEWORK_API = environment.HOST_JEEWORK_API + "/api";
const JEETEAM_API = environment.HOST_JEETEAM_API + '/api';
const API_CMT = environment.HOST_JEEWORK_API + "/api/comment";

@Injectable()
export class JeeCommentService {
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _errorMessage$ = new BehaviorSubject<string>('');
  private _lstUser: UserCommentInfo[] = [];
  public _usernameRep$ = new BehaviorSubject<any>(null);
  private _mainUser$: BehaviorSubject<UserCommentInfo> = new BehaviorSubject<UserCommentInfo>(new UserCommentInfo());
  private readonly _reloadComment = new BehaviorSubject<any>(
    undefined
  );
  readonly _reloadComment$ = this._reloadComment.asObservable();

  get data_share() {
    return this._reloadComment.getValue();
  }
  set data_share(val) {
    this._reloadComment.next(val);
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }

  get mainUser$() {
    return this._mainUser$.asObservable();
  }

  get mainUser() {
    return this._mainUser$.value;
  }

  get lstUser() {
    return this._lstUser;
  }

  // tiếng việt icon
  public i18n = {
    search: 'Tìm kiếm',
    emojilist: 'Danh sách Emoji',
    notfound: 'Không tìm thấy Emoji ',
    clear: 'Xoá sạch',
    categories: {
      search: 'Kết quả',
      recent: 'Sử dụng thường xuyên',
      people: 'Biểu tượng mặt cười & Con người',
      nature: 'Động vật & Thiên nhiên',
      foods: 'Đồ ăn & Nước uống',
      activity: 'Hoạt động',
      places: 'Du lịch & Nghỉ dưỡng',
      objects: 'Đồ vật',
      symbols: 'Biểu tượng',
      flags: 'Cờ',
      custom: 'Custom',
    },
    skintones: {
      1: 'Default Skin Tone',
      2: 'Light Skin Tone',
      3: 'Medium-Light Skin Tone',
      4: 'Medium Skin Tone',
      5: 'Medium-Dark Skin Tone',
      6: 'Dark Skin Tone',
    },
  };

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private _authService: AuthService) {
    this.getlstUserCommentInfo();
  }

  public showTopicCommentByObjectID(objectID: string, filter: QueryFilterComment): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.getHttpParamsFilter(filter);
    const url = API_JEECOMMENT_URL + `/comments/show/${objectID}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  public showChangeTopicCommentByObjectID(objectID: string, filter: QueryFilterComment): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.getHttpParamsFilter(filter);
    const url = API_JEECOMMENT_URL + `/comments/showChange/${objectID}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  public showChangeComment(objectID: string, commentID: string, filter: QueryFilterComment): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.getHttpParamsFilter(filter);
    const url = API_JEECOMMENT_URL + `/comments/showChange/${objectID}/${commentID}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  public showFullComment(objectID: string, commentID: string, filter: QueryFilterComment): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.getHttpParamsFilter(filter);
    const url = API_JEECOMMENT_URL + `/comments/show/${objectID}/${commentID}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  private getHttpParamsFilter(filter: QueryFilterComment): HttpParams {
    console.log("filter", filter)
    let query = new HttpParams().set('ViewLengthComment', filter.ViewLengthComment ? filter.ViewLengthComment.toString() : '10').set('Date', filter.Date.toISOString());
    return query;
  }

  public getlstUserCommentInfo() {
    this.getDSUserCommentInfo()
      .pipe(
        tap((res: any) => {
          if (res) {
            const usernamelogin = 'congtytest.tuan'
            // const usernamelogin = this._authService.getAuthFromLocalStorage()['user']['username'];
            res.data.forEach((element: any) => {
              // init ListUserCommentInfo
              const item = new UserCommentInfo();
              item.Username = element.Username;
              item.AvartarImgURL = element.AvartarImgURL;
              item.PhoneNumber = element.PhoneNumber;
              item.Email = element.Email;
              item.Jobtitle = element.Jobtitle;
              item.FullName = element.FullName;
              item.Display = element.FullName ? element.FullName : element.Username;
              item.BgColor = element.BgColor;
              item.FirstName = element.FirstName;
              item.UserId = element.UserId;
              this._lstUser.push(item);

              // init main User Login
              if (usernamelogin === item.Username) this._mainUser$.next(item);
            });
            this._lstUser.sort((a, b) => a.FullName.localeCompare(b.FullName));
          } else {
            this._errorMessage$.next(res.error.message);
            return of();
          }
        }),
        finalize(() => {
          this._isLoading$.next(false);
        }),
        share()
      )
      .subscribe();
  }
  public PushNotifi(item: NotifiModel): Observable<any> {
    const url = JEETEAM_API + '/notifi' + `/PushNotifi`;
    return this.http.post<any>(url, item, {
    });
  }
  public PushNotifiTagNameComment(item: NotifiModel): Observable<any> {
    const url = JEETEAM_API + '/notifi' + `/PushNotifiTagNameComment`;
    return this.http.post<any>(url, item, {
    });
  }
  private getDSUserCommentInfo(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEEACCOUNT_URL + `/accountmanagement/GetListAccountManagement?query.more=true`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  public getDisplay(username?: string): string {
    const object = this._lstUser.find((element) => element.Username === username);
    if (object) return object.Display;
    return username!;
  }

  public getUriAvatar(username?: string): string {
    const avatar = this._lstUser.find((element) => element.Username === username);
    if (avatar) return avatar.AvartarImgURL;
    return 'https://cdn.jee.vn/jee-account/images/avatars/default2.png';
  }

  public postCommentModel(model: PostCommentModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEECOMMENT_URL + `/comments/postcomment`;
    return this.http.post<any>(url, model, {
      headers: httpHeaders,
    });
  }

  public postReactionCommentModel(model: ReactionCommentModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEECOMMENT_URL + `/comments/postReactionComment`;
    return this.http.post<any>(url, model, {
      headers: httpHeaders,
    });
  }

  public updateCommentModel(model: PostCommentModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEECOMMENT_URL + `/comments/editComment`;
    return this.http.post<any>(url, model, {
      headers: httpHeaders,
    });
  }

  public deleteComment(topiccommentid: string, commentid: string): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEECOMMENT_URL + `/comments/delete/${topiccommentid}/${commentid}`;
    return this.http.delete<any>(url, {
      headers: httpHeaders,
    });
  }

  public deleteReplyComment(topiccommentid: string, commentid: string, replycommentid: string): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEECOMMENT_URL + `/comments/delete/${topiccommentid}/${commentid}/${replycommentid}`;
    return this.http.delete<any>(url, {
      headers: httpHeaders,
    });
  }
  public getTopicObjectIDByComponentNameJeeTeam(componentName: number): Observable<string> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = JEETEAM_API + `/comments/getByComponentName/${componentName}`;
    return this.http.get(url, {
      headers: httpHeaders,
      responseType: 'text'
    });
  }
  public getTopicObjectIDByComponentNamePrivate(componentName: number): Observable<string> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = JEETEAM_API + `/comments/GetByComponentNamePrivate/${componentName}`;
    return this.http.get(url, {
      headers: httpHeaders,
      responseType: 'text'
    });
  }
  // hàm notify
  public notifyComment(item: any) { }

  //-----------Sử dung cho form JeeWork=================
  getTopicObjectIDByComponentName(componentName: string): Observable<string> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = JEEWORK_API + `/comments/getByComponentName/${componentName}`;
    return this.http.get(url, {
      headers: httpHeaders,
      responseType: "text",
    });
  }

  LuuLogcomment(model: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_CMT + `/luu-log-comment`;
    return this.http.post<any>(url, model, {
      headers: httpHeaders,
    });
  }
}
