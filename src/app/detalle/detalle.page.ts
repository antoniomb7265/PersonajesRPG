import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { Personaje } from '../personaje';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

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
  constructor(
              private callNumber: CallNumber ,// Llamar por telefono
              private socialSharing: SocialSharing, // Compartir por redes sociales
              private loadingController: LoadingController, // Controla el tiempo de carga
              private toastController: ToastController, // Muestra mensajes en la parte de abajo
              private imagePicker: ImagePicker, // Selector de imagenes en la galeria
              public alertController: AlertController,
              private activatedRoute: ActivatedRoute,
              private firestoreService: FirestoreService,
              private router: Router) {
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
        document.getElementById("botonModificar").innerHTML = "Añadir";
        document.getElementById("botonImagen").innerHTML = "Añadir imagen";
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

  configurar() {
    this.router.navigate(["/configurar/"]);
  }

  mapa() {
    this.router.navigate(["/mapa/"]);
  }

  volver(){
    this.router.navigate(["/home"]);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: '',
      message: 'Por favor, confirme que quiere <strong>borrar de forma permanente</strong> el registro',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            console.log('Confirm Okay');
            this.clicBotonBorrar();
          }
        }
      ]
    });
    await alert.present();
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

  async uploadImagePicker(){
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Espere un momento...'
    });
    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'La imagen se ha subido correctamente',
      duration: 3000
    });
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
    // Si no tiene permiso de lectura se solicita al usuario
    if(result == false){
      this.imagePicker.requestReadPermission();
    }
    else {
      // Abrir selector de imágenes (ImagePicker)
      this.imagePicker.getPictures({
        maximumImagesCount: 1,  // Permitir sólo 1 imagen
        outputType: 1           // 1 = Base64
      }).then(
      (results) => {  // En la variable results se tienen las imágenes seleccionadas
        // Carpeta del Storage donde se almacenará la imagen
        let nombreCarpeta = "imagenes";
        // Recorrer todas las imágenes que haya seleccionado el usuario
        //  aunque realmente sólo será 1 como se ha indicado en las opciones
        for (var i = 0; i < results.length; i++) {      
          // Mostrar el mensaje de espera
          loading.present();
          // Asignar el nombre de la imagen en función de la hora actual para
          //  evitar duplicidades de nombres        
          let nombreImagen = `${new Date().getTime()}`;
          // Llamar al método que sube la imagen al Storage
          this.firestoreService.subirImagen(nombreCarpeta, nombreImagen, results[i])
          .then(snapshot => {
            snapshot.ref.getDownloadURL()
            .then(downloadURL => {
              // En la variable downloadURL se tiene la dirección de descarga de la imagen
              console.log("downloadURL:" + downloadURL);
              this.document.data.imagen = downloadURL;
              // Mostrar el mensaje de finalización de la subida
              toast.present();
              // Ocultar mensaje de espera
              loading.dismiss();
            })
          })
        }
        },
        (err) => {
          console.log(err)
        }
        );
      }
    }, (err) => {
      console.log(err);
    });
    }

    async deleteFile(fileURL) {
      const toast = await this.toastController.create({
        message: 'File was deleted successfully',
        duration: 3000
      });
      this.firestoreService.borrarImagen(fileURL)
        .then(() => {
          toast.present();
        }, (err) => {
          console.log(err);
        });
    }
   
  mensajeCompartir():string{
    return "Compartido con Myapp\n\nNombre: "+this.document.data.nombre+"\nDescripción: "+this.document.data.descripcion+"\n\n"+this.document.data.imagen;
  }

  whatsappShare(){
    var msg  = this.mensajeCompartir();
    this.socialSharing.shareViaWhatsApp(msg, null, null);
  }

  llamar() {
    this.callNumber.callNumber("684073639", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}