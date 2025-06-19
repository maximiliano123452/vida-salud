import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosSaludPage } from './datos-salud.page';

describe('DatosSaludPage', () => {
  let component: DatosSaludPage;
  let fixture: ComponentFixture<DatosSaludPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosSaludPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
