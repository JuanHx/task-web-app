import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskAddComponent } from '../task-add/task-add.component';
import { ConfirmModalCustomComponent } from '../../shared/confirm-modal-custom/confirm-modal-custom.component';


@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskAddComponent, ConfirmModalCustomComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  selectedTasks: number[] = []; // Almacena los IDs de tareas seleccionadas

  constructor(private tareasService: TaskService,) {}

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.tareasService.getTareas().subscribe((data) => {
      this.tasks = data;
      this.selectedTasks = []; // Resetear selección después de actualizar la lista
    });
  }

   getEstado(estado: number): string {
    switch (estado) {
      case 0:
        return 'Pendiente';
      case 1:
        return 'En Progreso';
      case 2:
        return 'Completado';
      default:
        return 'Desconocido';
    }
  }

  onTaskAdded() {
    this.fetchTasks();
  }

  // Método para alternar la selección de tareas
  toggleSelection(taskId: number) {
    if (this.selectedTasks.includes(taskId)) {
      this.selectedTasks = this.selectedTasks.filter(id => id !== taskId);
    } else {
      this.selectedTasks.push(taskId);
    }
  }

  // Método para eliminar las tareas seleccionadas
  deleteSelectedTasks() {
    console.log('Tareas seleccionadas:', this.selectedTasks);

    if (this.selectedTasks.length === 0) {
      return;
    }

    this.tareasService.deleteMultipleTareas(this.selectedTasks).subscribe({
      next: () => {
        this.fetchTasks();
      },
      error: (err) => {
        console.error('Error eliminando tareas:', err);
      }
    });
  }

  get modalTitle(): string {
    return this.selectedTasks.length === 1 ? 'Eliminar Tarea' : 'Eliminar Tareas';
  }

  get modalMessage(): string {
    return this.selectedTasks.length === 1
      ? '¿Estás seguro de que deseas eliminar la tarea seleccionada?'
      : '¿Estás seguro de que deseas eliminar las tareas seleccionadas?';
  }

}


