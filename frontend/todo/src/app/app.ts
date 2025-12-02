import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from '../user/user';
import { Tags } from '../tags/tags';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, User, Tags],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('todo');
}
