export interface Contactos {
    id: number,
    nombre: string,
    telefono: string,
    asunto: string,
    notas: string,
    fecha_nacimiento?:Date
    creado_por: string
}
