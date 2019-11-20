import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Personaje } from '../personaje';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  arrayColeccionPersonajes: any = [{
    id: "",
    data: {} as Personaje
   }];

  PersonajeRPG: Personaje;
  idPersRPG: string;

  constructor(private firestoreService: FirestoreService, private router: Router) {
    this.PersonajeRPG = {} as Personaje;
    this.obtenerListaPersonaje();
  }

  // navigateToDetalle() {
  //   this.router.navigate(["/detalle/"+this.idPersRPG]);
  // }

  clicBotonInsertar() {
    this.firestoreService.insertar("personaje", this.PersonajeRPG).then(() => {
      console.log('Tarea creada correctamente!');
      this.PersonajeRPG= {} as Personaje;
    }, (error) => {
      console.error(error);
    });
  }
  
  obtenerListaPersonaje(){
    this.firestoreService.consultar("personaje").subscribe((resultadoConsultaPersonaje) => {
      this.arrayColeccionPersonajes = [];
      resultadoConsultaPersonaje.forEach((datosPersonaje: any) => {
        this.arrayColeccionPersonajes.push({
          id: datosPersonaje.payload.doc.id,
          data: datosPersonaje.payload.doc.data()
        });
      })
    });
  }

  selecPers(persSelec) {
    console.log("Personaje seleccionada: ");
    console.log(persSelec);
    this.idPersRPG = persSelec.id;
    this.PersonajeRPG.nombre = persSelec.data.nombre;
    this.PersonajeRPG.descripcion = persSelec.data.descripcion;
    this.router.navigate(["/detalle/"+this.idPersRPG]);
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("personaje", this.idPersRPG).then(() => {
      // Actualizar la lista completa
      this.obtenerListaPersonaje();
      // Limpiar datos de pantalla
      this.PersonajeRPG = {} as Personaje;
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("personaje", this.idPersRPG, this.PersonajeRPG).then(() => {
      // Actualizar la lista completa
      this.obtenerListaPersonaje();
      // Limpiar datos de pantalla
      this.PersonajeRPG = {} as Personaje;
    })
  }
}
