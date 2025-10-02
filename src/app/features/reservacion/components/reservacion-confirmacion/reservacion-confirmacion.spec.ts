import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionConfirmacion } from './reservacion-confirmacion';

describe('ReservacionConfirmacion', () => {
  let component: ReservacionConfirmacion;
  let fixture: ComponentFixture<ReservacionConfirmacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservacionConfirmacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservacionConfirmacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
