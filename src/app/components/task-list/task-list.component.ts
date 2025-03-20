import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];

  constructor(private tareasService: TaskService,) {}

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.tareasService.getTareas().subscribe((data) => {
      this.tasks = data;
    });
  }

  getDaysSinceCreation(fecha_creacion: string): number {
    const creationDate = new Date(fecha_creacion);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - creationDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }


}
