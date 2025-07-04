import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { GaleriaPage } from './galeria.page';

describe('GaleriaPage', () => {
  let component: GaleriaPage;
  let fixture: ComponentFixture<GaleriaPage>;
  let mockModalController: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    // Mock del ModalController
    const modalSpy = jasmine.createSpyObj('ModalController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [GaleriaPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GaleriaPage);
    component = fixture.componentInstance;
    mockModalController = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
    fixture.detectChanges();
  });

  // Prueba básica  (que el componente se cree)
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Prueba del array de imágenes
  it('should have 18 images in the array', () => {
    expect(component.images).toBeDefined();
    expect(component.images.length).toBe(18);
  });

  // Prueba de algunas imágenes específicas
  it('should have correct image paths', () => {
    expect(component.images[0]).toBe('/assets/img/Pilates.jpg');
    expect(component.images[1]).toBe('/assets/img/Yoga.jpg');
    expect(component.images[17]).toBe('/assets/img/JugosNaturales.jpg');
  });

  // Prueba que todas las imágenes tengan la ruta correcta
  it('should have all images with correct path format', () => {
    component.images.forEach(image => {
      expect(image).toContain('/assets/img/');
      expect(image).toContain('.jpg');
    });
  });

  // Prueba del renderizado
  it('should render images in the template', () => {
    const compiled = fixture.nativeElement;
    const imageElements = compiled.querySelectorAll('.gallery-image');
    expect(imageElements.length).toBe(18);
  });
});