import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of, Subject, BehaviorSubject, Observable, Observer } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  EventEmitter,
  Output,
} from '@angular/core';
import "quill-mention";
import { JeeCommentService } from '../services/jee-comment.service';
import { QuillEditorComponent } from 'ngx-quill';
import { JeeCommentSignalrService } from '../services/jee-comment-signalr.service';
import { JeeCommentStore } from '../services/jee-comment.store';
import { CommentDTO, PostCommentModel, TagComment, UserCommentInfo } from '../Models/jee-comment.model';

@Component({
  selector: 'jeecomment-enter-comment-content',
  templateUrl: 'enter-comment-content.component.html',
  styleUrls: ['enter-comment-content.scss', '../jee-comment-lib/jee-comment-light.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class JeeCommentEnterCommentContentComponent implements OnInit, AfterViewInit {
  private readonly onDestroy = new Subject<void>();
  constructor(public service: JeeCommentService, public store: JeeCommentStore, public cd: ChangeDetectorRef
    , private signalrService: JeeCommentSignalrService,

  ) { }
  formats = [
    'background',
    'bold',
    'color',
    'font',
    'code',
    'italic',
    'link',
    'size',
    'strike',
    'script',
    'mention',
    'underline',
    'blockquote',
    'header',
    'indent',
    'list',
    'align',
    'direction',
    'code-block',
    'formula',
    // 'image',
    // 'video'
  ];
  @Input() UserCurrent_lib: string = '';
  @Input('objectID') objectID: string = '';
  @Input('appCode') appCode: string = '';
  @Input('commentID') commentID: string = '';
  @Input('replyCommentID') replyCommentID: string = '';

  @Input('isEdit') set editing(isEdit: boolean) {
    this.isEdit$.next(isEdit);
  }
  private isEdit$ = new BehaviorSubject<boolean>(false);
  @Input('isFocus$') isFocus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Input('editCommentModel') commentModelDto?: CommentDTO;
  @Output() NotifyComentEvent = new EventEmitter<any>();
  @Output('isEditEvent') isEditEvent = new EventEmitter<boolean>();
  isloadingrepost: boolean = false
  showPopupEmoji!: boolean;
  isClickIconEmoji!: boolean;
  showSpanCancelFocus!: boolean;
  showSpanCancelNoFocus!: boolean;
  errorcoment: boolean = false
  imagesUrl!: string[];
  videosUrl!: any[];
  filesUrl!: any[];
  filesName: string[] = [];
  inputTextArea!: string;
  listUser!: any[];
  subjectSreachTag = new BehaviorSubject<string>('');
  sreachTag$: Observable<string> = this.subjectSreachTag.asObservable();
  @ViewChild('txtarea') txtarea!: ElementRef;
  @ViewChild(QuillEditorComponent, { static: true })
  editor!: QuillEditorComponent;
  modules = {
    toolbar: false,
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          // shiftKey: true,
          handler: (range: any, ctx: any) => {
            // this.sendMessage()
          }
        }
      }
    },

    mention: {
      mentionListClass: "ql-mention-list mat-elevation-z8",
      // allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      allowedChars: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+/,
      showDenotationChar: false,
      // mentionDenotationChars: ["@", "#"],
      spaceAfterInsert: false,

      onSelect: (item: any, insertItem: any) => {
        const editor = this.editor.quillEditor;
        let index = this._lstTag.findIndex(x => x.Username == item.id);
        if (index < 0) {
          var tag = new TagComment();
          tag.Display = item.value;
          tag.Username = item.id;
          this._lstTag.push(tag);
        }
        insertItem(item);
        editor.insertText(editor.getLength() - 1, "", "user");
      },
      renderItem: function (item: any, searchTerm: any) {

        if (item.AvartarImgURL) {



          return `
      <div >

      <img  style="    width: 30px;
      height: 30px;
      border-radius: 50px;" src="${item.AvartarImgURL}">
      ${item.value}


      </div>`;
        }
        else {
          return `
      <div style="    display: flex;
      align-items: center;" >

        <div  style="     height: 30px;
        border-radius: 50px;    width: 30px; ;background-color:#F3D79F">
        </div>
        <span style=" position: absolute;     left: 22px;  color: white;">${item.value.slice(0, 1)}</span>
        <span style=" padding-left: 5px;">${item.value}</span>

      </div>`;
        }
      },
      source: (searchTerm: any, renderItem: any) => {
        const values = this.listUser;


        if (searchTerm.length === 0) {
          renderItem(values, searchTerm);

        } else {
          const matches: any = [];
          values.forEach(entry => {
            if (
              entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
            ) {
              matches.push(entry);
            }
          });
          renderItem(matches, searchTerm)

        }
      }
    }
  };

  //tag zone
  reg =
    /@\w*(\.[A-Za-záàạãảâẩấầẫậăặắằẳôốồộổỗõỏòóọủũụùủúỉìịỉíĩơởỡờớợđêểềểệễÁÀẠÃẢÂẨẤẪẬẨẦẪĂẶẲẴẶẮÔỐỒỘỔỖÕÒÓỌỎÚÙŨỦỤỦỈÌỊÍỈĨƠỞỠỢỚỜÊỂỀỆỄEẾĐ_ ]*$\w*)|\@[A-Za-záàạãảâẩấầẫậăặắằẳôốồộổỗõỏòóọủũụùủúỉìịỉíĩơởỡờớợđêểềểệễÁÀẠÃẢÂẨẤẪẬẨẦẪĂẶẲẴẶẮÔỐỒỘỔỖÕÒÓỌỎÚÙŨỦỤỦỈÌỊÍỈĨƠỞỠỢỚỜÊỂỀỆỄEẾĐ_ ]*$\w*/gm;

  @ViewChild('tagcommentshow') tagcommentshow!: ElementRef;
  private _matchReg: string[] = [];
  private _posCursorInTextarea: number = 0;
  private _currentPosCursorInTextarea: number = 0;
  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _lstTag: TagComment[] = [];

  get isLoading$() {
    return this._isLoading$.asObservable();
  }

  ngOnInit() {
    this.service.getAvatar(this.UserCurrent_lib)
    this.imagesUrl = [];
    this.videosUrl = [];
    this.filesUrl = [];
    this.inputTextArea = '';
    this.showPopupEmoji = false;
    this.isClickIconEmoji = false;
    this.showSpanCancelFocus = false;
    this.showSpanCancelNoFocus = false;
    this.listUser = this.service.lstUser.map(item => {
      return {
        id: item.Username,
        AvartarImgURL: item.AvartarImgURL,
        value: item.FullName
      }
    });

  }

  ngAfterViewInit(): void {
    if (this.commentModelDto) {
      this.initData();
    }
    setTimeout(() => {
      this.FocusTextarea();

    }, 500);
    this.isFocus$
      .pipe(
        tap((res) => {
          if (res) {

            setTimeout(() => {
              this.FocusTextarea();

            }, 500);
          }
        }),
        takeUntil(this.onDestroy)
      )
      .subscribe();

    // this.hideCommentTag();
  }
  onPaste(event: any) {

    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let blob = null;
    var filesAmount = event.clipboardData.files.length;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
      }
    }

    // load image if there is a pasted image
    if (blob !== null) {
      let base64Str: any;
      var file_name = blob;
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (evt: any) => {
        this.imagesUrl.push(evt.target.result);
        this.cd.detectChanges();
      };

    }
  }
  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL();

    return dataURL;
  }
  ConvertBase64(url: string) {
    this.imagesUrl = [];
    this.getBase64ImageFromURL(url).subscribe((base64data: any) => {
      this.imagesUrl.push(base64data)
      // this.base64Image = "data:image/jpg;base64," + base64data;
      // save image to disk

    });
  }
  initData() {
    this.inputTextArea = this.commentModelDto!.Text;
    this._currentPosCursorInTextarea = this.inputTextArea.length - 1;
    this._posCursorInTextarea = this.inputTextArea.length - 1;
    this.imagesUrl = this.commentModelDto!.Attachs.Images;
    this.videosUrl = this.commentModelDto!.Attachs.Videos;
    this.filesUrl = this.commentModelDto!.Attachs.Files;
    if (this.imagesUrl.length > 0) {
      this.imagesUrl.forEach(element => {
        this.ConvertBase64(element)

      })

    }
    this.commentModelDto!.Attachs.Files.forEach((file) => {
      this.filesName.push(file.split('/')[file.split('/').length - 1]);
    });
    this.isEdit$
      .pipe(
        tap((res) => {
          this.isEditEvent.emit(res);
        }),
        takeUntil(this.onDestroy)
      )
      .subscribe();

    this.cd.detectChanges();
    this.isFocus$.next(true);
  }

  FocusTextarea() {
    // this.txtarea.nativeElement.focus();
    this.editor.quillEditor.focus()
  }

  getContent($event: any) {
    console.log($event.target.innerHTML);
  }
  RePostComment() {
    this._isLoading$.next(false);

    this.signalrService.stopHubConnectionComment();
    setTimeout(() => {
      this.signalrService.connectToken(this.objectID);
    }, 1000);

    setTimeout(() => {


      if (!this._isLoading$.value) {
        const model = this.prepareComment();
        if (this.checkCommentIsEqualEmpty(model)) {
          return;
        }
        if (this.isEdit$.value) {
          this.updateComment(model);
          this.isEdit$.next(false);
        } else {
          this.errorcoment = false;
          this.isloadingrepost = true;
          this.postComment(model);
        }

      }
    }, 3000);
  }
  validateCommentAndPost() {
    if (this.signalrService.CheckconnectComent() == true) {

      if (!this._isLoading$.value) {
        const model = this.prepareComment();
        if (this.checkCommentIsEqualEmpty(model)) {
          return;
        }
        if (this.isEdit$.value) {
          this.updateComment(model);
          this.isEdit$.next(false);
        } else {
          this.postComment(model);
        }
      }
    }
    else {
      this.errorcoment = true;
      if (this.objectID) {
        this.signalrService.stopHubConnectionComment();
        setTimeout(() => {
          this.signalrService.connectToken(this.objectID);
        }, 1000);
      }
    }
  }

  prepareComment(): PostCommentModel {
    const model = new PostCommentModel();
    model.AppCode = this.appCode
    model.TopicCommentID = this.objectID ? this.objectID : '';
    model.CommentID = this.commentID ? this.commentID : '';
    model.ReplyCommentID = this.replyCommentID ? this.replyCommentID : '';
    model.Text = this.inputTextArea;
    model.Tag = this.getTagFromInput(model.Text);
    model.Attachs.FileNames = this.filesName;
    this.imagesUrl.forEach((imageUrl) => {
      const base64 = imageUrl.split(',')[1];
      model.Attachs.Images.push(base64);
    });
    this.videosUrl.forEach((videoURL) => {
      const base64 = videoURL.split(',')[1];
      model.Attachs.Videos.push(base64);
    });
    this.filesUrl.forEach((fileUrl) => {
      const base64 = fileUrl.split(',')[1];
      model.Attachs.Files.push(base64);
    });
    return model;
  }

  getTagFromInput(input: string) {
    var lstTag: any = [];
    this._lstTag.forEach((element) => {
      if (input.search('@' + element.Display) >= 0) lstTag.push(element);
    });
    console.log(this._lstTag);
    return lstTag;
  }

  checkCommentIsEqualEmpty(model: PostCommentModel): boolean {
    const empty = new PostCommentModel();
    return this.isEqual(model, empty);
  }

  isEqual(object: PostCommentModel, otherObject: PostCommentModel): boolean {
    let checkValue = object.Text === otherObject.Text;
    let checkList = false;
    if (
      object.Attachs.Files.length === otherObject.Attachs.Files.length &&
      object.Attachs.Images.length === otherObject.Attachs.Images.length &&
      object.Attachs.Videos.length === otherObject.Attachs.Videos.length
    )
      checkList = true;
    if (checkValue && checkList) return true;
    return false;
  }

  updateComment(model: PostCommentModel) {
    this._isLoading$.next(true);
    this.service
      .updateCommentModel(model)
      .pipe(
        tap(
          (res) => { },
          catchError((err) => {
            console.log(err);
            return of();
          }),
          () => {
            this.ngOnInit();
            this.cd.detectChanges();
            setTimeout(() => {
              this._isLoading$.next(false);
            }, 750);
          }
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }

  postComment(model: PostCommentModel) {

    this.errorcoment = false;
    this._isLoading$.next(true);
    this.service
      .postCommentModel(model)
      .pipe(
        tap(
          (res) => {
            this.isloadingrepost = false;
            //        if (resufalt.LstCreate.length > 0 || result.LstEdit.length > 0 || result.LstDelete.length > 0) {
            //   if (result.LstCreate.length > 0) {
            //     this.pushItemCommentInTopicComemnt(this.item, result.LstCreate);
            //   }
            //   if (result.LstEdit.length > 0) {
            //     this.editItemCommentInTopicComemnt(this.item, result.LstEdit);
            //   }
            //   if (result.LstDelete.length > 0) {
            //     this.deleteItemCommentInTopicComemnt(this.item, result.LstDelete);
            //   }
            //   this.filterDate = new Date();
            //   this.isDeteachChange$.next(true);
            // }
            // TODO: viết api notify trong này
            this.NotifyComentEvent.emit(model)
            this.service.notifyComment(model);
            // // dùng cho jeemeeting
            // if (model.AppCode) {
            //   if (model.AppCode.includes('MEETING')) {
            //     this.store.notify = model
            //   }
            // }

            // // dùng cho jeerequest
            // if (model.AppCode) {
            //   if (model.AppCode.includes('REQUEST')) {
            //     this.store.notifyRequest = model
            //   }
            // }

            // //dungf cho jeeteam
            // if (model.AppCode) {
            //   if (model.AppCode.includes('TEAM')) {
            //     let item = {
            //       itemjeeteam: model,
            //       listTag: this._lstTag
            //     }
            //     this.store.notifyteam = item
            //   }
            // }
            // // Đếm lại số lượng comment cho JeeWork
            // if (model.AppCode) {
            //   if (model.AppCode.includes('WORK')) {
            //     const objSave: any = {};
            //     objSave.id_topic = res.Id;
            //     objSave.comment = model.Text ? model.Text : 'has comment';
            //     objSave.id_parent = 0;
            //     objSave.object_type = 0;
            //     objSave.object_id_new = model.TopicCommentID;
            //     this.Luulogcomment(objSave);
            //   }
            // }
          },
          catchError((err) => {

            console.log(err);
            return of();
          }),
          () => {
            this.cancleComment();
            this.cd.detectChanges();
            setTimeout(() => {
              this._isLoading$.next(false);
            }, 750);
          }
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe();
  }

  onKeydown($event: any) {
    // tag zone
    this._currentPosCursorInTextarea = $event.target.selectionStart;
    if (this._posCursorInTextarea > this._currentPosCursorInTextarea) this._posCursorInTextarea = this._currentPosCursorInTextarea;
    let input = this.inputTextArea.substr(this._posCursorInTextarea, this.inputTextArea.length - this._posCursorInTextarea);
    this._matchReg = input.match(this.reg)!;
    if (this._matchReg) {
      this.splitMatchAndSreachTagUser(this._matchReg);
      // this.showCommentTag();
    } else {
      // this.hideCommentTag();
    }
    //  check cancel keyword
    if (($event.ctrlKey && $event.keyCode == 13) || ($event.altKey && $event.keyCode == 13)) {
      this.inputTextArea = this.inputTextArea + '\n';
    } else if ($event.keyCode == 13) {
      $event.preventDefault();
    }
    this.focusFunction();
  }

  splitMatchAndSreachTagUser(match: string[]) {
    if (match != null && match.length > 0) {
      let tagValue = match[match.length - 1].split('@')[1];
      this.subjectSreachTag.next(tagValue);
    }
  }

  toggleEmojiPicker() {
    this.showPopupEmoji = true;
    this.isClickIconEmoji = true;
  }

  addEmoji(event: any) {
    const data = this.inputTextArea + `${event.emoji.native}`;
    this.inputTextArea = data;

    this.showPopupEmoji = false;

  }

  previewFileInput(files: FileList) {
    const filesAmount = files.length;
    if (filesAmount > 0) this.showSpanCancelNoFocus = true;
    for (let i = 0; i < filesAmount; i++) {
      const name = files[i].name;
      if (this.isImage(name)) {
        this.addImage(files.item(i));
      } else if (this.isVideo(name)) {
        this.addVideo(files.item(i));
      } else {
        this.filesName.push(name);
        this.addFile(files.item(i));
      }
    }
  }

  addFile(item: any) {
    let reader = new FileReader();
    reader.readAsDataURL(item);
    reader.onload = () => {
      this.filesUrl.push(reader.result as string);
      this.cd.detectChanges();
    };
  }

  addImage(item: any) {
    let reader = new FileReader();
    reader.readAsDataURL(item);
    reader.onload = () => {
      this.imagesUrl.push(reader.result as string);
      this.cd.detectChanges();
    };
  }

  addVideo(item: any) {
    let reader = new FileReader();
    reader.readAsDataURL(item);
    reader.onload = () => {
      this.videosUrl.push(reader.result);
      this.cd.detectChanges();
    };
  }

  getExtension(filename: string) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }

  isImage(filename: string) {
    const ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
      case 'heic':
      case 'heif':
        return true;
    }
    return false;
  }

  isVideo(filename: string) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
      case 'ts':
      case 'mkv':
      case 'webm':
      case 'wmv':
      case '3gpp':
      case 'mpeg':
      case 'ogv':
        return true;
    }
    return false;
  }

  deletePreviewImage(index: any) {
    this.imagesUrl.splice(index, 1);
    this.cd.detectChanges();
  }

  deletePreviewVideo(index: any) {
    this.videosUrl.splice(index, 1);
    this.cd.detectChanges();
  }
  deletePreviewFile(index: any) {
    this.filesUrl.splice(index, 1);
    this.filesName.splice(index, 1);
    this.cd.detectChanges();
  }

  cancleComment() {
    this.inputTextArea = '';
    this.imagesUrl = [];
    this.videosUrl = [];
    this.filesUrl = [];
    this.filesName = [];
    this.showSpanCancelFocus = false;
    this.showSpanCancelNoFocus = false;
    // this.hideCommentTag();
    this.isEdit$.next(false);
    this.cd.detectChanges();
  }

  onSelectionChanged = (event: any) => {
    if (event.oldRange == null) {
      this.showSpanCancelFocus = true;
    }
    if (event.range == null) {
      this.showSpanCancelFocus = false;
    }
  }

  focusFunction() {
    if (this.checkValueExistCommentModel()) {
      this.showSpanCancelFocus = true;
      this.showSpanCancelNoFocus = false;
    } else {
      this.showSpanCancelFocus = false;
    }
  }

  focusOutFunction() {
    if (this.checkValueExistCommentModel()) {
      this.showSpanCancelFocus = false;
      this.showSpanCancelNoFocus = true;
    } else {
      this.showSpanCancelNoFocus = false;
    }
    setTimeout(() => {
      // this.hideCommentTag();
    }, 100);
  }

  checkValueExistCommentModel(): boolean {
    if (this.inputTextArea.length > 0 || this.imagesUrl.length > 1) {
      return true;
    }
    return false;
  }

  clickOutSideEmoji() {
    if (this.showPopupEmoji && this.isClickIconEmoji) {
      this.showPopupEmoji = true;
      this.isClickIconEmoji = false;
    } else {
      this.showPopupEmoji = false;
      this.isClickIconEmoji = false;
    }
  }

  ItemSelected(user: UserCommentInfo) {
    // this.hideCommentTag();
    let i = this.inputTextArea.lastIndexOf('@');
    this.inputTextArea = this.inputTextArea.substr(0, i) + '@' + user.FullName + ' ';
    this._posCursorInTextarea = this.inputTextArea.length;
    this.txtarea.nativeElement.focus();
    var tag = new TagComment();
    tag.Display = user.FullName;
    tag.Username = user.Username;
    this._lstTag.push(tag);
    this.cd.detectChanges();
  }

  // showCommentTag() {
  //   this.tagcommentshow.nativeElement.style.display = 'block';
  // }

  // hideCommentTag() {
  //   this.tagcommentshow.nativeElement.style.display = 'none';
  // }

  //=====================BỔ SUNG LƯU LOG COMMENT JEEWORK==============
  @Output() valuecomment = new EventEmitter<string>();
  Luulogcomment(model: any) {
    this.service.LuuLogcomment(model)
      .subscribe(() => {
        this.isEditEvent.emit(model.id_topic);
      });
  }
}
