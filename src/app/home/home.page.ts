import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Personaje } from '../personaje';
import { Router } from "@angular/router";
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

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

  idPersRPG: string;
  anchoMayor: boolean;

  constructor(private firestoreService: FirestoreService,
              private callNumber: CallNumber ,// Llamar por telefono
              private router: Router,
              private screenOrientation: ScreenOrientation) {
    this.obtenerListaPersonaje();

    if(window.screen.width>window.screen.height)
    {
      this.anchoMayor = true;
      console.log("La orientación ha cambiado");
    } else {
      this.anchoMayor = false;
      console.log("La orientación ha cambiado");
    }

    this.screenOrientation.onChange().subscribe(
      () => {
        console.log("Orientación cambiada");
        this.anchoMayor=!this.anchoMayor;
      }
    );
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
  
  volver(){
    this.router.navigate(["/home"]);
  }

  llamar() {
    this.callNumber.callNumber("684073639", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}
