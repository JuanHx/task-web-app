import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskAddComponent } from '../task-add/task-add.component';
import { ConfirmModalCustomComponent } from '../../shared/confirm-modal-custom/confirm-modal-custom.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    TaskAddComponent,
    ConfirmModalCustomComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateX(-20px)' })
        ),
      ]),
    ]),
  ],
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  selectedTasks: number[] = [];
  showDropdownTaskId: number | null = null;
  taskToEdit: any = null;
  selectedStatus: number | null = null;
  filteredTasks: any[] = [];

  searchControl = new FormControl('');

  @ViewChild(TaskAddComponent) taskAddComponent!: TaskAddComponent;

  constructor(private tareasService: TaskService) {}

  ngOnInit() {
    this.fetchTasks();

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.applyFilter();
    });
  }

  fetchTasks() {
    this.tareasService.getTareas().subscribe((data) => {
      if (this.tasks.length === 0) {
        this.tasks = data;
      } else {
        const existingIds = new Set(this.tasks.map((t) => t.id));
        data.forEach((task) => {
          if (!existingIds.has(task.id)) {
            this.tasks.push(task);
          }
        });
      }

      this.selectedTasks = [];
      this.applyFilter();
    });
  }

  filterTasksByStatus(status: number) {
    this.selectedStatus = this.selectedStatus === status ? null : status;
    this.applyFilter();
  }

  applyFilter() {
    let filtered = [...this.tasks];

    if (this.selectedStatus !== null) {
      filtered = filtered.filter((task) => task.estado === this.selectedStatus);
    }

    const searchText = this.searchControl.value?.trim().toLowerCase();
    if (searchText) {
      filtered = filtered.filter(
        (task) =>
          task.titulo.toLowerCase().includes(searchText) ||
          task.descripcion.toLowerCase().includes(searchText)
      );
    }

    this.filteredTasks = filtered;
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

  getEstadoClass(estado: number): string {
    switch (estado) {
      case 0:
        return 'badge text-bg-primary';
      case 1:
        return 'badge text-bg-warning';
      case 2:
        return 'badge text-bg-success';
      default:
        return 'badge text-bg-secondary';
    }
  }

  onTaskAdded() {
    this.fetchTasks();
  }

  toggleSelection(taskId: number) {
    if (this.selectedTasks.includes(taskId)) {
      this.selectedTasks = this.selectedTasks.filter((id) => id !== taskId);
    } else {
      this.selectedTasks.push(taskId);
    }
  }

  deleteSelectedTasks() {
    if (this.selectedTasks.length === 0) {
      return;
    }

    this.filteredTasks = this.filteredTasks.filter(task => !this.selectedTasks.includes(task.id));

    setTimeout(() => {
      this.tasks = this.tasks.filter(task => !this.selectedTasks.includes(task.id));

      this.tareasService.deleteMultipleTareas(this.selectedTasks).subscribe({
        next: () => {
          this.selectedTasks = [];
          this.applyFilter();
        },
        error: (err) => {
          console.error('Error eliminando tareas:', err);
        },
      });
    }, 300);
  }

  deleteTaskSelected(taskId: number) {
    this.selectedTasks = [taskId];
    this.deleteSelectedTasks();
  }

  get modalTitle(): string {
    return this.selectedTasks.length === 1
      ? 'Eliminar Tarea'
      : 'Eliminar Tareas';
  }

  get modalMessage(): string {
    return this.selectedTasks.length === 1
      ? '¿Estás seguro de que deseas eliminar la tarea seleccionada?'
      : '¿Estás seguro de que deseas eliminar las tareas seleccionadas?';
  }

  editTask(task: any) {
    this.taskToEdit = task;
    this.taskAddComponent.openEditModal(task);
    this.showDropdownTaskId = null;
  }

  updateTaskInList(updatedTask: any) {
    const index = this.tasks.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...updatedTask };
    }
  }

  trackByTaskId(index: number, task: any): number {
    return task.id;
  }

  toggleDropdown(taskId: number) {
    if (this.showDropdownTaskId === taskId) {
      this.showDropdownTaskId = null;
    } else {
      this.showDropdownTaskId = taskId;
    }
  }

  isDropdownOpen(taskId: number): boolean {
    return this.showDropdownTaskId === taskId;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.task-item')) {
      this.showDropdownTaskId = null;
    }
  }
}
