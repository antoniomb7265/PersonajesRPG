import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Map, tileLayer, marker } from "leaflet";

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  map: Map;
  newMarker: any;

  constructor(
            private router: Router,
            private callNumber: CallNumber ,// Llamar por telefono
  ) {
  }
  ionViewDidEnter() {
    this.loadMap();
  }

  ngOnInit() {
  }

  llamar() {
    this.callNumber.callNumber("684073639", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  configurar() {
    this.router.navigate(["/configurar/"]);
  }

  mapa() {
    this.router.navigate(["/mapa/"]);
  }
  
  volver() {
    this.router.navigate(["/home"]);
  }

  loadMap() {
    this.map = new Map("mapId").setView([36.6768853, -5.4469035], 19);
    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution:
      'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(this.map);
  }
}
