import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {DadataConfig, DadataParty, DadataSuggestion, DadataType} from '@kolkov/ngx-dadata';
import { UploadService } from '../upload.service';
import { ApiService} from '../api.service';
import Swal from 'sweetalert2';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Parcel } from '../parcel';
library.add(fas);


@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css'],
  providers: [UploadService, ApiService]
})
export class MailComponent implements OnInit {
  pack: Parcel;
  
  progr: boolean = false;
  //one_send: boolean = false;
  faSpinner = faSpinner;
  @ViewChild('fileInput', { static: false }) fileInput;
  
  constructor(private http: HttpClient, private UploadService: UploadService, private httpService: ApiService){

  }

  ngOnInit() {
    this.pack = new Parcel({namesender:'Начальник', email_out:'yashin_gp@mail.ru', 
    sendtext:'Прошу принять к сведению эту информацию. Необходимо ее изучить и использовать в работе.'})
  }
  clearForm(form: NgForm) {
    this.progr = false;
    form.reset();
  }
  outTime() {
    this.progr = false;
    Swal.fire({
      type: 'error',
      title: 'Ошибка',
      html: '<b>Превышен лимит времени на ожидание ответа</b>'
    })
  }
  send(form: NgForm) {
    //if (this.one_send) return;
    const fileBrowser = this.fileInput.nativeElement;
    let timerId = setTimeout(this.outTime, 120000);
    if (fileBrowser.files && fileBrowser.files[0]) {
      //есть файл вложений
      if ( fileBrowser.files[0].size > 5*1048576 ) {
        clearTimeout(timerId);
        return Swal.fire({
          type: 'error',
          title: 'Ошибка',
          html: '<b>Размер файла не должен превышать 5 Мбайт</b>'  
        }) 
      }
      //let timerId = setTimeout(this.outTime, 180000);
      this.progr = true;
      this.UploadService.uploadFile('http://localhost/phones/ajax/send.php', fileBrowser.files[0],form.value.namesender,
      form.value.email_out, form.value.sendtext)
        .subscribe(
          response => {
            //console.log( JSON.stringify(response.type) );
            //console.log( JSON.stringify(response) );
            if (response.type == 4) {
              this.progr = false;
              clearTimeout(timerId);
              if (!response['body']['success']) {
                return Swal.fire({
                  type: 'error',
                  title: 'Ответ сервера',
                  html: '<b>'+response['body']['message']+'</b>'  
                }) 
              } else {
                this.progr = false;
                clearTimeout(timerId);
                //this.one_send = true;
              
                //console.log(fileBrowser.files[0]);
                return Swal.fire({
                  type: 'success',
                  title: 'Успех',
                  html: '<strong><i>Файл отправлен!</i></strong>' 
                }) 
              }
            }
            
          }, error => {
            this.progr = false;
            clearTimeout(timerId);
            return Swal.fire({
              type: 'error',
              title: 'Ошибка',
              html: '<b>Ошибка при загрузке файла</b>'  
            }) 
          }
        )
    } else {
      this.progr = true;
      this.UploadService.uploadFile('http://localhost/phones/ajax/send.php', fileBrowser.files[0],form.value.namesender,
      form.value.email_out, form.value.sendtext)
        .subscribe(
          response => {
            //console.log( JSON.stringify(response.type) );
            //console.log( JSON.stringify(response) );
            if (response.type == 4) {
              this.progr = false;
              clearTimeout(timerId);
              if (!response['body']['success']) {
                return Swal.fire({
                  type: 'error',
                  title: 'Ответ сервера',
                  html: '<b>'+response['body']['message']+'</b>'  
                }) 
              } else {
                this.progr = false;
                return Swal.fire({
                  type: 'success',
                  title: 'Успех',
                  html: '<strong><i>Сообщение отправлено!</i></strong>' 
                }) 
              }
            }
          }, error => {
            this.progr = false;
            clearTimeout(timerId);
            return Swal.fire({
              type: 'error',
              title: 'Ошибка',
              html: '<b>Ошибка при отправке сообщения</b>'  
            }) 
          }
        )     

    }
  }  
  configFio: DadataConfig = {
    apiKey: '078b9de120f7c2669984977c9da6c3748913acf0',
    type: DadataType.fio,
  };
  configEmail: DadataConfig = {
    apiKey: '078b9de120f7c2669984977c9da6c3748913acf0',
    type: DadataType.email,
  };
}
