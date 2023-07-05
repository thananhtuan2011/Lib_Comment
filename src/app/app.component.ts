import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import "quill-mention";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'comment-lib';
  topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  ngOnInit(): void {

    this.topicObjectID$.next('62cd44a7be0f42a056f066ac');
    // setTimeout(() => {
    //   this.topicObjectID$.subscribe(res => {
    //     console.log("resss", res)
    //   })
    // }, 1000);

  }
}
