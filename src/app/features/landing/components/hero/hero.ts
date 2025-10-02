import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { SearchParams } from '../../../../shared/models/mesa';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hero.html',
})
export class Hero {
  private fb = inject(FormBuilder);
  private router = inject(Router)

  minDate: string;
  searchForm: FormGroup;

  constructor() {
    //Fecha minima = mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    this.searchForm = this.fb.group({
      fecha: [this.minDate, [Validators.required]],
      hora: ['19:00:00', [Validators.required]],
      capacidad: [2, [Validators.required, Validators.min(1), Validators.max(20)]]
    });
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      const searchParams: SearchParams = this.searchForm.value;

      console.log('Navegando con parámetros: ', searchParams);

      //Navegar a la página de disponibilidad con parámetros
      this.router.navigate(['/disponibilidad'], {
        queryParams: searchParams
      });
    } else {
      Object.keys(this.searchForm.controls).forEach(key => {
        this.searchForm.get(key)?.markAsTouched();
      })
    }
  }
}
