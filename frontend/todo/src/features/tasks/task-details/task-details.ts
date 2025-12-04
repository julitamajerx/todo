import { Component, OnInit, ViewChild, ElementRef, inject, effect } from '@angular/core';
import Quill from 'quill';
import { TaskService } from '../../../services/task-service';
import { Task } from '../../../shared/models/task';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-details',
  imports: [DatePipe],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  public editor!: Quill;

  protected task: Task = new Task();

  private taskDisplayService = inject(TaskService);

  constructor() {
    effect(() => {
      this.task = this.taskDisplayService.getTask(this.taskDisplayService.selectedTaskId());

      if (this.task.description != null || '') {
        this.editor.setText(this.task.description);
      }
    });
  }

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
