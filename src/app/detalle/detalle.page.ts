import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { Personaje } from '../personaje';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})

export class DetallePage implements OnInit {
  id = null;
  document: any = {
    id: "",
    data: {} as Personaje
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) {
    this.firestoreService.consultarPorId("personaje", this.activatedRoute.snapshot.paramMap.get("id")).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.document.data.titulo);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Personaje;
      } 
      if (this.id == "nuevo") {
        document.getElementById("botonBorrar").setAttribute("class","invisible");
      }
    });
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
  }

  clicBotonBorrar() {
    // if (this.id != "nuevo") {
      this.firestoreService.borrar("personaje", this.id).then(() => {
        this.router.navigate(["/home"]);
      }, (error) => {
        console.error(error);
      });
    // } else{
    //   this.router.navigate(["/home"]);
    // }
  }

  clicBotonModificar() {
    if (this.id != "nuevo") {
      this.firestoreService.actualizar("personaje", this.id, this.document.data).then(() => {
        this.router.navigate(["/home"]);
      }, (error) => {
        console.error(error);
      });
    } else{
      this.firestoreService.insertar("personaje", this.document.data).then(() => {
        console.log('Personaje creado correctamente!');
        this.router.navigate(["/home"]);
      }, (error) => {
        console.error(error);
      });
    }
  }
}