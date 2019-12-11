import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  configurar() {
    this.router.navigate(["/configurar/"]);
  }

  mapa() {
    this.router.navigate(["/mapa/"]);
  }
  
  volver(){
    this.router.navigate(["/home"]);
  }
}
