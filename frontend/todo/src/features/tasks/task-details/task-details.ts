import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
  effect,
  OnDestroy,
  signal,
} from '@angular/core';
import Quill from 'quill';
import { TaskService } from '../../../services/task-service';
import { Task } from '../../../shared/models/task';
import { List } from '../../../shared/models/list';
import { ListService } from '../../../services/list-service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { Spinner } from '../../../core/spinner/spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-details',
  imports: [FormsModule, Spinner, DatePipe],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  public editor!: Quill;

  protected lists = signal<List[]>([]);
  protected task: Task = new Task();
  protected taskList: string | null = null;

  private taskService = inject(TaskService);
  private listService = inject(ListService);
  private destroy = new Subject<void>();

  constructor() {
    effect(() => {
      const taskId = this.taskService.selectedTaskId();
      if (!taskId) return;

      this.taskService.getTask(taskId).subscribe({
        next: (task) => {
          this.task = task;

          const found = this.lists().find((l) => l._id === this.task.list?._id);
          this.taskList = found ? found._id : null;

          if (this.editor && this.task.description) {
            this.editor.setText(this.task.description);
          }
        },
        error: (err: Error) => console.error('Error fetching task:', err.message),
      });

      this.lists.set(this.listService.lists());
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
