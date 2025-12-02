import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from '../features/user/user';
import { Tags } from '../features/tags/tags';
import { Tasks } from '../features/tasks/tasks';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, User, Tags, Tasks],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('todo');
}
