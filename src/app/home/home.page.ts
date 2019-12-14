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
  
  // arrayConfiguracion: any = {
  // aqui se establecerian las variables locales que guardaria el array de configuracion
  // };

  PersonajeRPG: Personaje;
  idPersRPG: string;
  anchoMayor: boolean;

  constructor(private firestoreService: FirestoreService, private router: Router) {
    this.PersonajeRPG = {} as Personaje;
    this.obtenerListaPersonaje();

    if(window.screen.width>window.screen.height){
      this.anchoMayor = true;
    } else {
      this.anchoMayor = false;
    }
  }

  clicBotonInsertar() {
    this.router.navigate(["/detalle/nuevo"]);
  }
  
  configurar() {
    this.router.navigate(["/configurar/"]);
  }
  
  mapa() {
    this.router.navigate(["/mapa/"]);
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

  // obtenerConfiguracion(){
  //   this.firestoreService.consultar("configuracion").subscribe((resultadoConsultaConfiguracion) => {
  //     this.arrayConfiguracion = [];
  //     resultadoConsultaConfiguracion.forEach((datosConf: any) => {
  //       this.arrayConfiguracion.push({
  //         aqui se recogerian los datos del servidor individualmente y añadiendolos al array
  //       });
  //     })
  //   });
  // }

  selecPers(persSelec) {
    console.log("Personaje seleccionada: ");
    console.log(persSelec);
    this.idPersRPG = persSelec.id;
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
  
  volver(){
    this.router.navigate(["/home"]);
  }
}
