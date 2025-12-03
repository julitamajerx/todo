import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Quill from 'quill';

@Component({
  selector: 'app-task-details',
  standalone: true,
  templateUrl: './task-details.html',
  styleUrls: ['./task-details.css'],
})
export class TaskDetails implements OnInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  public editor!: Quill;

  ngOnInit() {
    this.editor = new Quill(this.editorContainer.nativeElement, {
      modules: {
        toolbar: [[{ header: [1, 2, 3, false] }], [{ list: 'bullet' }]],
      },
      theme: 'snow',
    });
  }

  getEditorContent() {
    return this.editor.root.innerHTML;
  }
}
