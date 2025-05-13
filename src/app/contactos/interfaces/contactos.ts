export interface Contactos {
    id: number,
    nombre: string,
    email: string,
    direccion:string,
    telefono: string,
    notas: string,
    fecha_nacimiento?:Date,
    creado_por: number | null
    identificacion: string
    entidad_id: number
}
