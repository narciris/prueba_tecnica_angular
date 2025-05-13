import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { EntidadesService } from './services/entidades.service';
import { Entidad, EntityRequest } from './interfaces/entidad';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-entidades',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule, 
  ReactiveFormsModule,
  DialogModule,
  InputTextModule,
  InputTextareaModule

],
  templateUrl: './entidades.component.html',
  styleUrl: './entidades.component.css',
  providers: [MessageService]
})
export default class EntidadesComponent implements OnInit
 {


  public entidadesService = inject(EntidadesService);
  total = computed(() => this.entidadesService.entidades().length);
  selectedEntidades: Entidad[]=[];
  
   public constructor (private router: Router){

  }

  
  openNew() {
      console.log("Abriendo formulario");
    this.entidadForm.reset();
   this.entidadDialog = true;
  }
 
  edit(entidad:Entidad):void{
    this.entidadId = entidad.id;
    this.entidadForm.setValue
    (
     {
      nombre: entidad.nombre,
      nit: entidad.nit,
      telefono: entidad.telefono,
      direccion: entidad.direccion,
      email: entidad.email || ''
     }
    );
    this.entidadDialog = true;


   
  }
   
    entidadForm!: FormGroup;
    private fb= inject(FormBuilder);
    entidadId: number | null = null
    entidadDialog: boolean = false;
    detailsDialog : boolean = false;
    entidad: Entidad = {
    id: 0,
    nombre: '',
    nit: '',
    telefono: '',
    direccion: '',
    email: ''
  };


 
  ngOnInit(): void {
      this.entidadForm = this.fb.group(
        {
          nombre:['',[Validators.required]],
          nit:['',[Validators.required]],
          telefono:['',[Validators.required]],
          direccion:['',[Validators.required]],
          email: ['',[Validators.required, Validators.email]]
        }
      )
    }

saveEntity(){
  if(this.entidadForm.invalid){
    this.entidadForm.markAllAsTouched();
    return
  }

  const data = this.entidadForm.value;

  if(this.entidadId){
    this.entidadesService.edit(this.entidadId,data).subscribe(
      {
        next: () => {
          this.entidadesService.refresh();
          this.entidadDialog = false;
          this.entidadForm.reset();
          this.entidadId = null;

        },
        error: (error) => {
          console.error("error al actualizar entidad", error);
        }
      } 
    )
  } else{
 this.entidadesService.create(data).subscribe(
    {
      next: () => {
        console.log("entidad creada corrrectamente");
        this.entidadDialog =false;
        this.entidadForm.reset();
        this.entidadesService.refresh();
      }, 
      error: (error) => {
        console.error("error al crear entidad",error);
      }
    }
  )
  }
 

}

details(id:number):void{
  this.entidadesService.getById(id).subscribe({
    next:(data) =>{
     this.entidad = data;
     this.detailsDialog = true;
    },
    error: (err) => {
      console.error("error al cargar entidades");
    }
  })
}

 

}
