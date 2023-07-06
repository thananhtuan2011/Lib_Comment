import { NgModule, forwardRef } from "@angular/core";
import { JeeCommentLibComponent } from "./jee-comment-lib/jee-comment-lib.component";
import { JeeCommentService } from "./services/jee-comment.service";
import { JeeCommentSignalrService } from "./services/jee-comment-signalr.service";
import { AuthService } from "./services/auth.service";
import { TranslateModule } from "@ngx-translate/core";
import { JeeCommentPostContentComponent } from "./post-comment-content/post-comment-content.component";
import { JeeCommentReactionShowComponent } from "./reaction-comment-show/reaction-comment-show.component";
import { CommonModule } from "@angular/common";
import { JeeCommentEnterCommentContentComponent } from "./enter-comment-content/enter-comment-content.component";
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from '@angular/material/icon';
import { GalleryModule } from "ng-gallery";
import { LightboxModule } from 'ng-gallery/lightbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuillModule } from 'ngx-quill';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { JeeCommentReactionContentComponent } from "./reaction-comment-content/reaction-comment-content.component";
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { AngularImageViewerModule } from 'image-viewer-dps';
import { HttpUtilsService } from "./services/http-utils.service";
import { AvatarModule } from "ngx-avatar";
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslationModule } from "./i18n/translation.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
// import { InlineSVGModule } from "ng-inline-svg";
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { CommentDpsComponent } from "./comment-dps.component";
import { DeleteEntityDialogComponent } from "./delete-entity-dialog/delete-entity-dialog.component";
import { ActionNotificationComponent } from "./action-natification/action-notification.component";
import { LayoutUtilsService } from "./services/layout-utils.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
@NgModule({
  imports: [
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
  ],
  declarations: [
    JeeCommentLibComponent,
    CommentDpsComponent,
    JeeCommentPostContentComponent,
    JeeCommentReactionShowComponent,
    JeeCommentEnterCommentContentComponent,
    JeeCommentReactionContentComponent,
    DeleteEntityDialogComponent,
    ActionNotificationComponent
  ],
  providers: [
    JeeCommentService,
    JeeCommentSignalrService,
    HttpUtilsService,
    AuthService,
    LayoutUtilsService
  ],
  entryComponents: [
    JeeCommentLibComponent,
    JeeCommentPostContentComponent,
    JeeCommentReactionShowComponent,
    JeeCommentEnterCommentContentComponent,
    JeeCommentReactionContentComponent,
    DeleteEntityDialogComponent,
    ActionNotificationComponent
  ],
  exports: [
    CommentDpsComponent,
    JeeCommentLibComponent,
    JeeCommentPostContentComponent,
    JeeCommentReactionShowComponent,
    JeeCommentEnterCommentContentComponent,
    JeeCommentReactionContentComponent,
    DeleteEntityDialogComponent,
    ActionNotificationComponent
  ],
})
export class JeeCommentLibModule { }
