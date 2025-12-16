import { Component, computed, effect, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { ListService } from '../../services/list-service';
import { List } from '../../shared/models/list';
import { Dialog } from '@angular/cdk/dialog';
import { Dialog as DialogWindow } from '../../core/dialog/dialog';
import { ListManagement } from '../../core/dialog/list-management/list-management';

@Component({
  selector: 'app-list',
  imports: [ListManagement],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists {
  @ViewChild('dialogContent') dialogContentTemplate!: TemplateRef<unknown>;

  protected lists = signal<List[]>([]);

  private listService = inject(ListService);
  private taskService = inject(TaskService);
  private dialog = inject(Dialog);

  constructor() {
    this.listService.getAllLists();

    const sidebarLists = computed(() => this.listService.lists().slice(0, 3));

    effect(() => {
      this.lists.set(sidebarLists());
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
}
