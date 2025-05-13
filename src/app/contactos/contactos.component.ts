import { Component, computed, inject, OnInit } from '@angular/core';
import { ContactosService } from './services/contactos.service';
import { Contactos } from './interfaces/contactos';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { EntidadesService } from '../entidades/services/entidades.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    RippleModule,
    ToolbarModule,
    DropdownModule
  ],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.css'
})
export class ContactosComponent implements OnInit {
  
  public contactosService = inject(ContactosService);
  private fb = inject(FormBuilder); 
  private entidatesService = inject(EntidadesService);
  total = computed(()=> this.contactosService.contactos().length);
  selectedContac: Contactos[]=[];
  

  public constructor (){

  }
 
 contactos = this.contactosService.contactos;
  loading = this.contactosService.loading;
  error = this.contactosService.error; 
  successMessage = this.contactosService.successMessage;
  entidades = this.entidatesService.entidades;

  contactDialog: boolean = false;
  contactForm!: FormGroup;
  isEditing: boolean = false;

  

   ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
   this.contactForm = this.fb.group({
 
  nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
  email:['',[Validators.required,Validators.email]],
  telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
  notas: ['', [Validators.required, Validators.minLength(10)]],
  fechaNacimiento: ['', [Validators.required]],
  direccion: ['',[Validators.required]],
  creadoPor: [null],
  entidad_id: [null,Validators.required],
  identificacion: ['',[Validators.required]]
});

  }

  openNew(){
    this.isEditing = false;
    this.contactForm.reset();
    this.contactDialog = true;
  }

  
  edit(contact : Contactos){
   this.isEditing = true;
   this.contactForm.patchValue(contact);
   this.contactDialog = true;

  }

  save(){

    Object.keys(this.contactForm.controls).forEach(key => {
    const control = this.contactForm.get(key);
    console.log(`Campo ${key}: `, {
      valor: control?.value,
      válido: control?.valid,
      errores: control?.errors
    });
  });

    if(this.contactForm.invalid){
      this.contactForm.markAllAsTouched();
    console.log("Formulario inválido:", this.contactForm.errors);
     return
    }

    
  const contacto = this.transformToContactFormData(this.contactForm.value);
      console.log("Contacto transformado:", contacto);
    if(this.isEditing){
      console.log("Actualizando contacto existente");
      this.contactosService.update(contacto);
    } else{
      console.log("Creando nuevo contacto");
      this.contactosService.create(contacto);
    }

    this.hideDialog();

    
  }
  deleteC(contact:Contactos){
    this.contactosService.delete(contact);
  }

  refresh(){
    this.contactosService.refresh();
  }

   hideDialog() {
    this.contactDialog = false;
  }

  transformToContactFormData(formValue: any): Contactos {
  return {
    id: 0,
    nombre: formValue.nombre,
    email: formValue.email,
    telefono: formValue.telefono,
    direccion: formValue.direccion,
    notas: formValue.notas,
    fecha_nacimiento: formValue.fechaNacimiento,
    creado_por: formValue.creadoPor,
    entidad_id: formValue.entidad_id,
    identificacion: formValue.identificacion
  };
}


}
