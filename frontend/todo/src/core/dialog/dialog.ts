import { Component, inject, input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { DialogData } from '../../shared/interfaces/dialog-data.interface';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class Dialog {
  private data: DialogData = inject(DIALOG_DATA);
  
  public title: string = this.data.title;
  public contentTemplate: TemplateRef<any> = this.data.contentTemplate;
}
