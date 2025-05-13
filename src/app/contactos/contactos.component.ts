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
  id: [null],
  nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
  telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
  asunto: ['', [Validators.required, Validators.minLength(5)]],
  notas: ['', [Validators.required, Validators.minLength(10)]],
  fechaNacimiento: ['', [Validators.required]],
  creadoPor: ['', [Validators.required, Validators.pattern(/\S+/)]],
  entidad_id: [null,Validators.required]
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
    if(this.contactForm.invalid){
      this.contactForm.markAllAsTouched();
      return
    }

    const contacts = this.contactForm.value as Contactos;

    if(this.isEditing){
      this.contactosService.update(contacts);
      this.hideDialog();
    } else{
      this.contactosService.create(contacts);
      this.hideDialog();
    }
    
  }
  delete(contact:Contactos){
    this.contactosService.delete(contact);
  }

  refresh(){
    this.contactosService.refresh();
  }

   hideDialog() {
    this.contactDialog = false;
  }


}
