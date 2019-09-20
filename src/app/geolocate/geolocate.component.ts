import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-geolocate',
  templateUrl: './geolocate.component.html',
  styleUrls: ['./geolocate.component.css']
})
export class GeolocateComponent implements OnInit {
  location: any;
  link: string;
  constructor() { }

  ngOnInit() {
    
  }
  onNavigate() {
    if(navigator.geolocation) {
      Swal.fire({
        title: 'Определение координат',
        onBeforeOpen: () => {
          Swal.showLoading();
        }
      })
      navigator.geolocation.getCurrentPosition(position => {
        this.location = position.coords;
        Swal.fire({
          type: 'success',
          title: 'Информация',
          html: '<strong><i>Широта: '+this.location.latitude+ ', Долгота: '+this.location.longitude+'</i></strong>' 
        })
        this.link = `https://nakarte.me/#m=16/`+this.location.latitude+'/'+this.location.longitude;
        window.open(this.link, "_blank");
      });
   } else {
    Swal.fire({
      type: 'error',
      title: 'Ошибка',
      html: '<b>Ваш браузер не поддерживает геолокацию.</b>'  
    }) 
   }
  
  }

}
