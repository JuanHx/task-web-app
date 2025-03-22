import { Component, EventEmitter, Output } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Tarea } from '../../interface/tarea';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./task-add.component.scss'],
})
export class TaskAddComponent {
  @Output() taskAdded = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<Tarea>();

  title: string = '';
  description: string = '';
  status: string = 'pending';

  taskForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  isError = false;
  taskId: number | null = null;
  isEditMode = false;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: [0],
    });

    if (this.isEditMode) {
      this.taskForm.valueChanges.subscribe(() => {
        this.isSuccess = false;
      });
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.isSuccess = false;
    this.isError = false;

    const tarea: Tarea = {
      id: this.taskId || undefined,
      titulo: this.taskForm.value.title,
      descripcion: this.taskForm.value.description,
      estado: this.taskForm.value.status,
    };

    if (this.isEditMode) {
      this.taskService.updateTarea(tarea).subscribe({
        next: () => this.handleEditSuccess(tarea),
        error: () => this.handleError(),
      });
    } else {
      this.taskService.addTarea(tarea).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError(),
      });
    }
  }

  handleEditSuccess(updatedTask: Tarea) {
    this.isLoading = false;
    this.isSuccess = true;
    setTimeout(() => {
      this.taskUpdated.emit(updatedTask);
      this.resetForm();
    }, 500);
  }

  handleSuccess() {
    this.isLoading = false;
    this.isSuccess = true;
    setTimeout(() => this.resetForm(), 500);
  }

  handleError() {
    this.isLoading = false;
    this.isError = true;
    setTimeout(() => (this.isError = false), 500);
  }

  resetForm() {
    this.taskForm.reset({
      title: '',
      description: '',
      status: 0,
    });

    this.taskAdded.emit();

    const modalElement = document.getElementById('modalAgregar');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }

    this.isLoading = false;
    this.isSuccess = false;
    this.isError = false;
    this.taskId = null;
    this.isEditMode = false;
  }

  openEditModal(task: any) {
    this.isEditMode = true;
    this.taskId = task.id;
    this.taskForm.setValue({
      title: task.titulo,
      description: task.descripcion,
      status: task.estado,
    });

    this.openModal();
  }

  openModal() {
    const modalElement = document.getElementById('modalAgregar');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  closeModal() {
    this.resetForm();
    const modalElement = document.getElementById('modalAgregar');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
}
