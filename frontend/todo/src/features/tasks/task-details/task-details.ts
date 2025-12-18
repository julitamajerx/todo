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
import { List } from '../../../shared/models/list';
import { ListService } from '../../../services/list-service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { Spinner } from '../../../core/spinner/spinner';
import { UpdateTaskPayload } from '../../../shared/interfaces/task-response.interface';

@Component({
  selector: 'app-task-details',
  imports: [FormsModule, Spinner],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails implements OnInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  public editor!: Quill;

  protected lists = signal<List[]>([]);
  protected taskList: string | null = null;
  protected formDate = '';
  protected formDescription = '';
  protected submitted = false;

  private taskService = inject(TaskService);
  private listService = inject(ListService);
  private destroy = new Subject<void>();

  protected task = this.taskService.selectedTask;

  constructor() {
    effect(() => {
      const currentTask = this.task();
      if (!currentTask) return;

      this.formDate = String(currentTask.dueDate).split('T')[0];

      this.formDescription = currentTask.description ?? '';

      this.lists.set(this.listService.lists());

      const currentListId =
        typeof currentTask.list === 'object' && currentTask.list !== null
          ? (currentTask.list as List)._id
          : currentTask.list;

      const found = this.lists().find((l) => l._id === currentListId);

      this.taskList = found ? found._id : (currentListId as string) || null;

      if (this.editor) {
        if (currentTask && currentTask.description) {
          this.editor.setText(currentTask.description);
        } else {
          this.editor.setText('');
        }
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

    this.editor.on('text-change', () => {
      this.formDescription = this.editor.getText();
    });

    if (this.task()?.description) {
      this.editor.setText(this.task()!.description);
    }
  }

  protected deleteTask() {
    const taskId = this.task()?._id;
    if (!taskId) {
      console.error('No task selected or task has no ID');
      return;
    }

    this.taskService.deleteTask(taskId);
    this.taskService.hideTaskDescription();
  }

  protected completeTask(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      const taskId = this.task()?._id;

      if (!taskId) {
        console.error('No task selected or task has no ID');
        return;
      }

      this.taskService.completeTask(taskId);
      this.taskService.hideTaskDescription();
    }
  }

  protected openDatePicker() {
    const input = this.dateInput.nativeElement;

    if (input.showPicker) {
      input.showPicker();
    } else {
      input.click();
    }
  }

  protected onSubmit() {
    const formTask = this.task();

    if (!formTask) {
      return;
    }

    const payload: UpdateTaskPayload = {
      _id: formTask._id,
      dueDate: this.formDate ? new Date(this.formDate) : undefined,
      description: this.formDescription ?? '',
      list: this.taskList ?? null,
      tags: formTask.tags?.map((t) => t._id) ?? [],
    };

    this.taskService.updateTask(payload);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
