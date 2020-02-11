import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-configurar',
  templateUrl: './configurar.page.html',
  styleUrls: ['./configurar.page.scss'],
})
export class ConfigurarPage implements OnInit {

  constructor(
              private callNumber: CallNumber ,// Llamar por telefono
              private router: Router) { }

  ngOnInit() {
  }

  configurar() {
    this.router.navigate(["/configurar/"]);
  }

  llamar() {
    this.callNumber.callNumber("684073639", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  
  mapa() {
    this.router.navigate(["/mapa/"]);
  }
  
  volver(){
    this.router.navigate(["/home"]);
  }
}
