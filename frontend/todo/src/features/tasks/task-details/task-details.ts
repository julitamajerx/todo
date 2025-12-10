import { Component, OnInit, ViewChild, ElementRef, inject, effect, OnDestroy } from '@angular/core';
import Quill from 'quill';
import { TaskService } from '../../../services/task-service';
import { Task } from '../../../shared/models/task';
import { DatePipe } from '@angular/common';
import { List } from '../../../shared/models/list';
import { ListService } from '../../../services/list-service';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { Spinner } from '../../../core/spinner/spinner';

@Component({
  selector: 'app-task-details',
  imports: [DatePipe, FormsModule, Spinner],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  public editor!: Quill;

  protected lists: List[] = [];
  protected task: Task = new Task();
  protected taskList: string | null = null;

  private taskService = inject(TaskService);
  private listService = inject(ListService);
  private destroy = new Subject<void>();

  constructor() {
    effect(() => {
      const taskId = this.taskService.selectedTaskId();

      if (!taskId) return;

      const taskDetails$ = this.taskService.getTask(taskId);
      const lists$ = this.listService.getAllLists();

      forkJoin({
        task: taskDetails$,
        lists: lists$,
      })
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: ({ task, lists }) => {
            this.lists = lists;
            this.task = task;

            if (this.task.list) {
              const found = this.lists.find((l) => l._id === this.task.list!._id);
              this.taskList = found ? found._id : null;
            } else {
              this.taskList = null;
            }

            if (this.editor && this.task.description) {
              this.editor.setText(this.task.description);
            }
          },
          error: (err: Error) => {
            console.error('Error fetching task details or lists:', err.message);
          },
        });
    });
  }

  ngOnInit() {
    this.editor = new Quill(this.editorContainer.nativeElement, {
      modules: {
        toolbar: [[{ header: [1, 2, 3, false] }], [{ list: 'bullet' }]],
      },
      theme: 'snow',
    });

    if (this.task.description) {
      this.editor.setText(this.task.description);
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
