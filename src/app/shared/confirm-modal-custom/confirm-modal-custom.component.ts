import { Component, EventEmitter, Output, Input } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-confirm-modal-custom',
  imports: [],
  templateUrl: './confirm-modal-custom.component.html',
  styleUrl: './confirm-modal-custom.component.scss'
})
export class ConfirmModalCustomComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirm() {
    this.closeModal();
    this.onConfirm.emit();
  }

  cancel() {
    this.closeModal();
    this.onCancel.emit();
  }

  closeModal(){
    const modalElement = document.querySelector('.modal.show');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
}
