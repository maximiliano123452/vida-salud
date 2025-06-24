import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

// Interfaces para TheMealDB API
export interface Meal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate?: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface MealResponse {
  meals: Meal[] | null;
}

export interface CategoryResponse {
  categories: Category[];
}

// Interface simplificada para mostrar
export interface RecetaSimple {
  id: string;
  nombre: string;
  categoria: string;
  imagen: string;
  area: string;
  instrucciones: string;
  ingredientes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  private apiUrl = 'https://www.themealdb.com/api/json/v1/1';
  
  // Estado para loading
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // Cache de datos para offline
  private recetasCache: RecetaSimple[] = [];
  private categoriasCache: Category[] = [];

  constructor(private http: HttpClient) {
    console.log('✅ MealsService inicializado');
    this.cargarDatosIniciales();
  }

  // Cargar algunas categorías al iniciar
  private async cargarDatosIniciales(): Promise<void> {
    try {
      this.getCategorias().subscribe();
    } catch (error) {
      console.error('❌ Error al cargar datos iniciales:', error);
    }
  }

  // 1. OBTENER TODAS LAS CATEGORÍAS
  getCategorias(): Observable<Category[]> {
    this.setLoading(true);
    
    return this.http.get<CategoryResponse>(`${this.apiUrl}/categories.php`)
      .pipe(
        retry(2),
        map(response => {
          this.setLoading(false);
          this.categoriasCache = response.categories || [];
          console.log('✅ Categorías cargadas:', this.categoriasCache.length);
          return this.categoriasCache;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // 2. OBTENER RECETAS POR CATEGORÍA
  getRecetasPorCategoria(categoria: string): Observable<RecetaSimple[]> {
    this.setLoading(true);
    
    return this.http.get<MealResponse>(`${this.apiUrl}/filter.php?c=${categoria}`)
      .pipe(
        retry(2),
        map(response => {
          this.setLoading(false);
          
          if (!response.meals) {
            return [];
          }
          
          const recetasSimples = response.meals.map(meal => this.convertirARecetaSimple(meal));
          console.log(`✅ Recetas de ${categoria} cargadas:`, recetasSimples.length);
          
          // Guardar en cache
          this.recetasCache = [...this.recetasCache, ...recetasSimples];
          
          return recetasSimples;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // 3. OBTENER DETALLE DE UNA RECETA POR ID
  getDetalleReceta(id: string): Observable<Meal | null> {
    this.setLoading(true);
    
    return this.http.get<MealResponse>(`${this.apiUrl}/lookup.php?i=${id}`)
      .pipe(
        retry(2),
        map(response => {
          this.setLoading(false);
          
          if (!response.meals || response.meals.length === 0) {
            return null;
          }
          
          console.log('✅ Detalle de receta cargado:', response.meals[0].strMeal);
          return response.meals[0];
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // 4. BUSCAR RECETAS POR NOMBRE
  buscarRecetas(nombre: string): Observable<RecetaSimple[]> {
    this.setLoading(true);
    
    return this.http.get<MealResponse>(`${this.apiUrl}/search.php?s=${nombre}`)
      .pipe(
        retry(2),
        map(response => {
          this.setLoading(false);
          
          if (!response.meals) {
            return [];
          }
          
          const recetasEncontradas = response.meals.map(meal => this.convertirARecetaSimple(meal));
          console.log(`✅ Búsqueda "${nombre}" encontró:`, recetasEncontradas.length, 'recetas');
          
          return recetasEncontradas;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // 5. OBTENER RECETA ALEATORIA
  getRecetaAleatoria(): Observable<Meal | null> {
    this.setLoading(true);
    
    return this.http.get<MealResponse>(`${this.apiUrl}/random.php`)
      .pipe(
        retry(2),
        map(response => {
          this.setLoading(false);
          
          if (!response.meals || response.meals.length === 0) {
            return null;
          }
          
          console.log('✅ Receta aleatoria:', response.meals[0].strMeal);
          return response.meals[0];
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // 6. OBTENER RECETAS SALUDABLES (Categorías específicas)
  getRecetasSaludables(): Observable<RecetaSimple[]> {
    const categoriasInteresantes = ['Chicken', 'Seafood', 'Vegetarian', 'Beef'];
    const categoriaAleatoria = categoriasInteresantes[Math.floor(Math.random() * categoriasInteresantes.length)];
    
    console.log(`🥗 Cargando recetas saludables de categoría: ${categoriaAleatoria}`);
    return this.getRecetasPorCategoria(categoriaAleatoria);
  }

  // Método para extraer ingredientes de una receta
  extraerIngredientes(meal: Meal): string[] {
    const ingredientes: string[] = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingrediente = (meal as any)[`strIngredient${i}`];
      const medida = (meal as any)[`strMeasure${i}`];
      
      if (ingrediente && ingrediente.trim()) {
        const textoIngrediente = medida ? `${medida.trim()} ${ingrediente.trim()}` : ingrediente.trim();
        ingredientes.push(textoIngrediente);
      }
    }
    
    return ingredientes;
  }

  // Convertir Meal a RecetaSimple
  private convertirARecetaSimple(meal: Meal): RecetaSimple {
    return {
      id: meal.idMeal,
      nombre: meal.strMeal,
      categoria: meal.strCategory,
      imagen: meal.strMealThumb,
      area: meal.strArea,
      instrucciones: meal.strInstructions?.substring(0, 200) + '...' || '',
      ingredientes: this.extraerIngredientes(meal).slice(0, 5) // Solo primeros 5
    };
  }

  // DATOS OFFLINE - Para cuando no hay internet
  getDatosOffline(): { categorias: Category[], recetas: RecetaSimple[] } {
    if (this.categoriasCache.length === 0 || this.recetasCache.length === 0) {
      // Datos de ejemplo si no hay cache
      return {
        categorias: [
          {
            idCategory: '1',
            strCategory: 'Vegetarian',
            strCategoryThumb: 'https://www.themealdb.com/images/category/vegetarian.png',
            strCategoryDescription: 'Comidas vegetarianas saludables'
          },
          {
            idCategory: '2',
            strCategory: 'Chicken',
            strCategoryThumb: 'https://www.themealdb.com/images/category/chicken.png',
            strCategoryDescription: 'Recetas con pollo bajo en grasa'
          }
        ],
        recetas: [
          {
            id: '1',
            nombre: 'Ensalada Mediterranean',
            categoria: 'Vegetarian',
            imagen: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
            area: 'Mediterranean',
            instrucciones: 'Una deliciosa ensalada con ingredientes mediterráneos...',
            ingredientes: ['Tomates cherry', 'Pepino', 'Aceitunas', 'Queso feta', 'Aceite de oliva']
          },
          {
            id: '2',
            nombre: 'Pechuga de Pollo Grillada',
            categoria: 'Chicken',
            imagen: 'https://www.themealdb.com/images/media/meals/020z181619788503.jpg',
            area: 'American',
            instrucciones: 'Pollo grillado saludable con especias...',
            ingredientes: ['Pechuga de pollo', 'Limón', 'Ajo', 'Romero', 'Aceite de oliva']
          }
        ]
      };
    }
    
    return {
      categorias: this.categoriasCache,
      recetas: this.recetasCache
    };
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<any> {
    this.setLoading(false);
    
    let errorMessage = 'Error al cargar recetas';
    
    if (error.status === 0) {
      errorMessage = 'Sin conexión a internet - mostrando datos guardados';
    } else if (error.status === 404) {
      errorMessage = 'Recetas no encontradas';
    }
    
    console.error('❌ Error en MealsService:', errorMessage, error);
    
    // Retornar datos offline en caso de error
    const datosOffline = this.getDatosOffline();
    return of(datosOffline.recetas.length > 0 ? datosOffline.recetas : []);
  }

  // Gestión del loading
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
    if (!loading) {
      setTimeout(() => this.loadingSubject.next(false), 1000);
    }
  }
}