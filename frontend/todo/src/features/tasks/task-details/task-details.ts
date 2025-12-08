import { Component, OnInit, ViewChild, ElementRef, inject, effect, OnDestroy } from '@angular/core';
import Quill from 'quill';
import { TaskService } from '../../../services/task-service';
import { Task } from '../../../shared/models/task';
import { DatePipe } from '@angular/common';
import { List } from '../../../shared/models/list';
import { ListService } from '../../../services/list-service';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-task-details',
  imports: [DatePipe, FormsModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  public editor!: Quill;

  protected lists: List[] = [];
  protected task: Task = new Task();
  protected taskList: number | null = null;

  private taskService = inject(TaskService);
  private listService = inject(ListService);
  private destroy = new Subject<void>();

  constructor() {
    effect(() => {
      const taskObservable: Observable<Task> = this.taskService.getTask(
        this.taskService.selectedTaskId(),
      );

      const listsObservable: Observable<List[]> = this.listService.getAllLists();

      listsObservable.subscribe((listsDbItem) => {
        this.lists = listsDbItem;

        taskObservable.subscribe((taskDbItem) => {
          this.task = taskDbItem;

          if (this.task.list) {
            const found = this.lists.find((l) => l.id === this.task.list!.id);
            this.taskList = found ? found.id : null;
          } else {
            this.taskList = null;
          }

          if (this.task.description) {
            this.editor.setText(this.task.description);
          }
        });
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
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
