import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

//  Interfaces para tipado
export interface DatoSalud {
  id?: number;
  userId: number;
  tipo: 'peso' | 'presion' | 'imc' | 'medicion';
  valor: number;
  fecha: string;
  notas?: string;
}

export interface PresionArterial {
  id?: number;
  userId: number;
  sistolica: number;
  diastolica: number;
  fecha: string;
  notas?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //  URL base de la API
  private apiUrl = 'https://jsonplaceholder.typicode.com';
  
  //  Opciones HTTP con headers
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  //  BehaviorSubjects para gestión de estado (observables)
  private datosSaludSubject = new BehaviorSubject<DatoSalud[]>([]);
  public datosSalud$ = this.datosSaludSubject.asObservable();

  private presionArterialSubject = new BehaviorSubject<PresionArterial[]>([]);
  public presionArterial$ = this.presionArterialSubject.asObservable();

  //  Estado de carga
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    //  Inicialización en constructor 
    this.inicializarDatos();
    console.log('✅ ApiService inicializado correctamente');
  }

  //  Inicialización asíncrona de datos
  private async inicializarDatos(): Promise<void> {
    try {
      console.log('🔄 Inicializando datos de salud...');
      // Aquí se podrían cargar datos iniciales si fuera necesario
    } catch (error) {
      console.error('❌ Error al inicializar datos:', error);
    }
  }

  //  GET: Obtener todos los datos de salud del usuario
  getDatosSalud(userId: number): Observable<DatoSalud[]> {
    this.setLoading(true);
    
    return this.http.get<any[]>(`${this.apiUrl}/posts?userId=${userId}`)
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  //  GET: Obtener un dato específico por ID
  getDatoSaludById(id: number): Observable<DatoSalud> {
    return this.http.get<any>(`${this.apiUrl}/posts/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  //  POST: Crear nuevo registro de salud
  crearDatoSalud(dato: DatoSalud): Observable<DatoSalud> {
    this.setLoading(true);
    
    const datoAdaptado = {
      userId: dato.userId,
      title: `${dato.tipo}: ${dato.valor}`,
      body: `Fecha: ${dato.fecha}. Notas: ${dato.notas || 'Sin notas'}`
    };

    return this.http.post<any>(`${this.apiUrl}/posts`, datoAdaptado, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  //  PUT: Actualizar registro existente
  actualizarDatoSalud(id: number, dato: DatoSalud): Observable<DatoSalud> {
    this.setLoading(true);
    
    const datoAdaptado = {
      id: id,
      userId: dato.userId,
      title: `${dato.tipo}: ${dato.valor}`,
      body: `Fecha: ${dato.fecha}. Notas: ${dato.notas || 'Sin notas'}`
    };

    return this.http.put<any>(`${this.apiUrl}/posts/${id}`, datoAdaptado, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  //  DELETE: Eliminar registro
  eliminarDatoSalud(id: number): Observable<any> {
    this.setLoading(true);
    
    return this.http.delete(`${this.apiUrl}/posts/${id}`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  // POST: Registrar presión arterial
  registrarPresionArterial(presion: PresionArterial): Observable<any> {
    const presionAdaptada = {
      userId: presion.userId,
      title: `Presión Arterial: ${presion.sistolica}/${presion.diastolica}`,
      body: `Fecha: ${presion.fecha}. Notas: ${presion.notas || 'Sin notas'}`
    };

    return this.http.post<any>(`${this.apiUrl}/posts`, presionAdaptada, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  //  GET: Obtener historial de presión arterial
  getHistorialPresion(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts?userId=${userId}`)
      .pipe(
        retry(2),
        catchError(this.handleError.bind(this))
      );
  }

  //  Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    this.setLoading(false);
    
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    
    console.error('❌ Error en API:', errorMessage);
    
    // Retornar observable con error
    throw new Error(errorMessage);
  }

  //  Gestión de estado de carga
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
    if (!loading) {
      // Auto-ocultar loading después de 1 segundo
      setTimeout(() => this.loadingSubject.next(false), 1000);
    }
  }

  //  Método para simular datos locales de salud
  getDatosSaludLocal(): DatoSalud[] {
    return [
      {
        id: 1,
        userId: 1,
        tipo: 'peso',
        valor: 75.5,
        fecha: '2025-06-18',
        notas: 'Peso después del desayuno'
      },
      {
        id: 2,
        userId: 1,
        tipo: 'imc',
        valor: 23.8,
        fecha: '2025-06-18',
        notas: 'IMC normal'
      }
    ];
  }

}
