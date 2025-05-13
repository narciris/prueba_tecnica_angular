import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/dev-environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, single, switchMap, tap, throwError } from 'rxjs';
import { StateEntidad } from '../../entidades/interfaces/state-entidad';
import { StateContacto } from '../interfaces/state-contacto';
import { Contactos } from '../interfaces/contactos';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  // enfoque signal first

  
  private BASE_URL = environment.BASE_URL;
  private http = inject(HttpClient);
 _state = signal<StateContacto>({
  loading:true,
  contactos: [],
  error: null,
  successMessage: null

  
 })

 contactos = computed(() => this._state().contactos);
 loading = computed(()=> this._state().loading);
 error= computed(() => this._state().error );
 successMessage= computed(()=> this._state().successMessage);

 public constructor(){
  this.refresh();
 }

//  refresh(){
//   this._state.set({loading:true, contactos: [], error:null})
//   this.http.get<Contactos[]>(`${this.BASE_URL}/entidades`)
//   .subscribe(
//     {
//       next : (res) => {
//         this._state.set({
//           loading:false,
//           contactos: res,
//           error:null
//         });
//       },
//       error: (err) => {
//         console.error("error al cargar contactos",err);
//       }
//     }
//   )
//  }

refresh(): Observable<Contactos[]> {
    this._state.update((state) => ({
      ...state,
      loading: true,
      error: null,
    }))

    return this.http.get<Contactos[]>(`${this.BASE_URL}/entidades`).pipe(
      tap((contactos) => {
        this._state.update((state) => ({
          ...state,
          loading: false,
          contactos,
          error: null,
        }))
      }),
      catchError((err) => {
        console.error("Error al cargar contactos", err)
        this._state.update((state) => ({
          ...state,
          loading: false,
          error: err.message || "Error al cargar contactos",
        }))
        return throwError(() => err)
      }),
    )
  }


  delete(contacto: Contactos): void {
    
    this.http.delete<void>(`${this.BASE_URL}/entidades/${contacto.id}`)
    
      .subscribe({
        next: () => {
          this._state.update(state => ({
            ...state,
            contactos: state.contactos.filter(c => c.id !== contacto.id),
            successMessage: 'Contacto eliminado exitosamente'
          }));
        },
        error: (error) => {
          this._state.update(state => ({
            ...state,
            error: error.message || "error eliminando el contacto"
          }));
        }
      });
  }

 create(contacto: Contactos): void {
      
    this.http.post<Contactos>(`${this.BASE_URL}/entidades`, contacto)
     
      .subscribe({
        next: (nuevoContacto) => {
          this._state.update(state => ({
            ...state,
            contactos: [...state.contactos, nuevoContacto],
            successMessage: 'Contacto creado exitosamente'
          }));
        },
        error: (error) => {
          this._state.update(state => ({
            ...state,
        error: error.message || 'Error al crear contacto'
          }));
        }
      });
  }

  update(contacto: Contactos): void {
      this.setLoading(true)
    this.http.put<Contactos>(`${this.BASE_URL}/entidades/${contacto.id}`, contacto)
      .subscribe({
        next: (contactoActualizado) => {
          this._state.update(state => ({
            ...state,
            contactos: state.contactos.map(c => 
              c.id === contactoActualizado.id ? contactoActualizado : c
            ),
            successMessage: 'Contacto actualizado exitosamente'
          }));
        },
        error: (error) => {
          this._state.update(state => ({
            ...state,
            error: error.message || "Error al actualizar contacto"
          }));
        }
      });
  }

 getById(contacto:Contactos):void{
  this.setLoading(true)
this.http.get<Contactos>(`${this.BASE_URL}/contactos/${contacto.id}`)

.subscribe(
  {
    next:(response) =>{
      this._state.update(
        state => ({
          ...state,
          loading:false,
          selected: response
        })
      )

    },
    error: (error) =>{
      this._state.update(state => ({
            ...state,
            error: error.message || "Error al recuperar contacto"
          }));
    }
  }
)

 }
 private setLoading(isLoading: boolean): void {
    this._state.update(state => ({
      ...state,
      loading: isLoading
    }));
  }
}

