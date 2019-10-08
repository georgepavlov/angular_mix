import { Component } from '@angular/core';
import {DadataConfig, DadataParty, DadataSuggestion, DadataType} from '@kolkov/ngx-dadata';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kladr',
  templateUrl: './kladr.component.html',
  styleUrls: ['./kladr.component.css']
})
export class KladrComponent {

  configAddress: DadataConfig = {
    apiKey: '078b9de120f7c2669984977c9da6c3748913acf0',
    type: DadataType.address,
  };
  configFio: DadataConfig = {
    apiKey: '078b9de120f7c2669984977c9da6c3748913acf0',
    type: DadataType.fio,
  };
  configEmail: DadataConfig = {
    apiKey: '078b9de120f7c2669984977c9da6c3748913acf0',
    type: DadataType.email,
  };
  configParty: DadataConfig = {
    apiKey: '078b9de120f7c2669984977c9da6c3748913acf0',
    type: DadataType.party,
    partyAddress: 'full',
  };
  
  onPartySelect(event: DadataSuggestion) {
    const partyData = event.data as DadataParty;
    console.log(partyData);
  }
 
  showCity() {      const ipAPI1 = 'https://api.ipify.org?format=json';
      //const ipAPI2 = 'https://geo.ipify.org/api/v1?apiKey=at_RWDk86MAm8Yqr3zskoW8UfSPZzgAw&ipAddress=';
      const ipAPI2 = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=';
      let ip = '';
      let link = '';
      Swal.fire({
        title: 'Определение IP и по IP координат',
        onBeforeOpen: () => {
          Swal.showLoading();
        }
      })
            fetch(ipAPI1)
            .then(response=> response.json())
            .then(data => ip = data.ip)
            .then(() => {
              fetch(ipAPI2 + ip, {
              headers: {
                Accept: 'application/json',
                Authorization: 'Token 078b9de120f7c2669984977c9da6c3748913acf0'
              }
              })
            .then(response => response.json())
            .then((data) => {
             //console.log(ip+' '+data.location.value);
              Swal.fire({
              type: 'success',
              title: 'Информация',
              html: '<strong><i>IP: '+ip+ ', место: '+data.location.value+'</i></strong>' 
              })

             link = `https://nakarte.me/#m=16/`+data.location.data.geo_lat+'/'+data.location.data.geo_lon;
             window.open(link, "_blank");

            })
            })
            .catch(() => {
              Swal.fire({
                type: 'error',
                title: 'Ошибка',
                html: '<b>Ошибка при попытке определения IP</b>'  
              }) 

            })
           
          

      
  } 

}
