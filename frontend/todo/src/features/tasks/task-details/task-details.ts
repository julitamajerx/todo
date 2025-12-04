import { Component, OnInit, ViewChild, ElementRef, inject, effect } from '@angular/core';
import Quill from 'quill';
import { TaskService } from '../../../services/task-service';
import { Task } from '../../../shared/models/task';
import { DatePipe } from '@angular/common';
import { List } from '../../../shared/models/list';
import { ListService } from '../../../services/list-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  imports: [DatePipe, FormsModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  public editor!: Quill;

  protected lists: List[] = [];
  protected task: Task = new Task();
  protected taskList: number | null = null;

  private taskService = inject(TaskService);
  private listService = inject(ListService);

  constructor() {
    effect(() => {
      this.task = this.taskService.getTask(this.taskService.selectedTaskId());

      this.taskList = this.task.list ? this.task.list.id : null;

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

    this.lists = this.listService.getAllLists();
  }

  getEditorContent() {
    return this.editor.root.innerHTML;
  }
}
