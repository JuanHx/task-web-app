import { Component, EventEmitter, Output } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Tarea } from '../../interface/tarea';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./task-add.component.scss']
})
export class TaskAddComponent {
  @Output() taskAdded = new EventEmitter<void>();

  title: string = '';
  description: string = '';
  status: string = 'pending';

  taskForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  isError = false;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: [0]
    });
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Evita recarga de la página

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    // Reiniciar estados
    this.isLoading = true;
    this.isSuccess = false;
    this.isError = false;

    const nuevaTarea: Tarea = {
      titulo: this.taskForm.value.title,
      descripcion: this.taskForm.value.description,
      estado: this.taskForm.value.status, // Ahora es un número (0, 1, 2)
    };


    this.taskService.addTarea(nuevaTarea).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;

        // Reiniciar formulario tras éxito
        setTimeout(() => {
         this.resetForm();
        }, 2000);
      },
      error: () => {
        this.isLoading = false;
        this.isError = true;

        // Ocultar error después de unos segundos
        setTimeout(() => {
          this.isError = false;
        }, 300);
      }
    });
  }

  resetForm() {
    this.taskForm.reset({
      title: '',
      description: '',
      status: 0 // Valor por defecto
    });

    // Emitir evento para actualizar la lista de tareas
    this.taskAdded.emit();

    // Cerrar la modal si estás usando Bootstrap
    const modalElement = document.querySelector('.modal.show');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

}
