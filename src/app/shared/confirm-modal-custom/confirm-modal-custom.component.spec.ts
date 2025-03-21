import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModalCustomComponent } from './confirm-modal-custom.component';

describe('ConfirmModalCustomComponent', () => {
  let component: ConfirmModalCustomComponent;
  let fixture: ComponentFixture<ConfirmModalCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmModalCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
