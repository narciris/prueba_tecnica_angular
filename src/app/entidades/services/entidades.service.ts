import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { StateEntidad } from '../interfaces/state-entidad';
import { Entidad, EntityRequest } from '../interfaces/entidad';
import { delay, Observable } from 'rxjs';
import { environment } from '../../../environments/dev-environment';

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {
  private http = inject(HttpClient)
  url: string = environment.BASE_URL
  #state = signal<StateEntidad>({
    loading: true,
    entidades: []
  })

  entidades = computed(() => this.#state().entidades);
  loading = computed(() => this.#state().loading);
  constructor() {
    this.refresh();
  }

  /** Método para refrescar los datos */
  refresh(): void {
    this.#state.set({ loading: true, entidades: [] }) // Actualiza el estado a "cargando" y vacia las entidades
    this.http.get<Entidad[]>(`${this.url}/entidades`).subscribe({
      next: (res) => {
        this.#state.set({
          loading: false,
          entidades: res,
        });
      },
      error: (error) => {
        console.error('Error al cargar entidades:', error);
      }
    });

  }
  delete(entidad: Entidad): void {
    this.http.delete<Entidad>(`${this.url}/entidades/${entidad.id}`).subscribe({
      next: (res) => {
        this.refresh();
      },
      error: (error) => {
        console.error('Error al eliminar la entidad:', error);
      }
    });
  }

  create(request:EntityRequest) : Observable<Entidad>{
    return this.http.post<Entidad>(`${this.url}/entidades`,request)
    
  }

  edit(id:number,request: EntityRequest) : Observable<Entidad>{
    return this.http.put<Entidad>(`${this.url}/entidades/${id}`,request)
  }

  getById(id:number):Observable<Entidad>{
     return this.http.get<Entidad>(`${this.url}/entidades/${id}`);

  }
  deleteMultiple(entidades: Entidad[]): void {
  const ids = entidades.map(e => e.id);
  
  this.http.post(`${this.url}/entidades/delete-multiple`, { ids }).subscribe({
    next: () => {
      this.refresh();
    },
    error: (error) => {
      console.error('Error al eliminar múltiples entidades:', error);
    }
  });
}


}
