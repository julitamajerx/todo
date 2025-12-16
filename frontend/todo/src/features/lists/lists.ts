import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ListService } from '../../services/list-service';
import { List } from '../../shared/models/list';
import { Observable, Subject } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { Dialog as DialogWindow } from '../../core/dialog/dialog';
import { ListManagement } from '../../core/dialog/list-management/list-management';

@Component({
  selector: 'app-list',
  imports: [ListManagement],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit, OnDestroy {
  @ViewChild('dialogContent') dialogContentTemplate!: TemplateRef<unknown>;

  protected lists: List[] = [];

  private destroy = new Subject<void>();
  private listService = inject(ListService);
  private taskService = inject(TaskService);
  private dialog = inject(Dialog);

  ngOnInit(): void {
    const listsObservable: Observable<List[]> = this.listService.getLists();

    listsObservable.subscribe({
      next: (listsDbItem) => {
        this.lists = listsDbItem;
      },
      error: (err: Error) => {
        console.log('Error fetching lists:', err.message);
      },
    });
  }

  protected sortByList(list: string) {
    this.taskService.setList(list);
    this.taskService.hideTaskDescription();
  }

  protected resetLists() {
    this.taskService.setList(null);
    this.taskService.hideTaskDescription();
  }

  protected openModal() {
    if (this.dialogContentTemplate) {
      this.dialog.open(DialogWindow, {
        data: {
          title: 'Lists Management',
          contentTemplate: this.dialogContentTemplate,
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
