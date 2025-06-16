import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EjercicioPage } from './ejercicio.page';

describe('EjercicioPage', () => {
  let component: EjercicioPage;
  let fixture: ComponentFixture<EjercicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EjercicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
