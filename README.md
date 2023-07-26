
# Angular X Comment

A configurable Angular image viewer component, compatible with Angular 11.x+ 

## Features:
 * Compatible with Angular 11.x+
 * Configurable


## Set up

To use default configuration, simply import the ImageViewerModule into your module, like so:

```javascript
import { JeeCommentLibModule } from "comment-dps";

@NgModule({
  //...
  imports: [
    //...
    JeeCommentLibModule
  ],
  //...
})
```

Then, add the component to your template, providing an array of image URLs. You can also optionally add an index, to indicate which image should be shown first. The default will be the first item in the array.

```html
  <jee-comment-lib (changeValue)="ChangeComment($event)" (NotifyComentEventSub)="NotifyComent($event)" [UserCurrent_lib]="UserCurrent_lib"  [showCommentDefault]="true" [objectID]="(topicObjectID$.asObservable() | async)!">
  </jee-comment-lib>
```

```javascript
  UserCurrent_lib: string = 'congtytest.tuan'
  topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  NotifyComent(event: any) {
    // nơi nhận sự kiện để comment để  gọi thông báo
    // console.log("Eddd", event)
  }
  //topicObjectID$ là topicIDcomment
  //UserCurrent_lib là username login
```


---

## Configuration
-Các thư viện cần sử dụng ở app để hoạt động ở lib

```javascript
 CommonModule,
    FormsModule,
    TranslateModule,
    MatMenuModule,
    MatIconModule,
    GalleryModule,
    NgxMatSelectSearchModule,
    // InlineSVGModule,
    TranslationModule,
    AvatarModule,
    MatProgressBarModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    LightboxModule,
    QuillModule.forRoot(),
    EmojiModule,
    MatFormFieldModule,
    MatTooltipModule,
    PickerModule,
    ReactiveFormsModule,
    AngularImageViewerModule,
```



