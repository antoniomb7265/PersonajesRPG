import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-configurar',
  templateUrl: './configurar.page.html',
  styleUrls: ['./configurar.page.scss'],
})
export class ConfigurarPage implements OnInit {

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
