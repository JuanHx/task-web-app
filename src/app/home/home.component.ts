import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaskListComponent } from '../components/task-list/task-list.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TaskListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
