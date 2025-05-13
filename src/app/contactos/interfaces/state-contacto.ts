import { Contactos } from "./contactos";

export interface StateContacto {
    contactos: Contactos[],
    loading : boolean
    error: string | null,
    successMessage : string | null,
    selected?: Contactos | null
    
}
