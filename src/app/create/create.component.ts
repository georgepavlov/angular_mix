import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';
import { UploadService } from '../upload.service';
import { ApiService} from '../api.service';
import { Lstfls } from '../lstfls';
import Swal from 'sweetalert2';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
library.add(fas);
declare var $;

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [UploadService, ApiService] 
})
export class CreateComponent implements OnInit {
  progr: boolean = false;
  faSpinner = faSpinner;
  listFiles: Lstfls[]=[];
  @ViewChild('fileInput', { static: false }) fileInput;
  newWindow: any;
  @ViewChild('filesTable', { static: false }) Table: { nativeElement: any; };
  public dataTable: any;
  constructor(private http: HttpClient, private UploadService: UploadService, private httpService: ApiService) { }
 
  ngOnInit() {
    this.getListFiles();
  }
  
  upload() {
    
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      if ( fileBrowser.files[0].size > 9437184 ) {
        return Swal.fire({
          type: 'error',
          title: 'Ошибка',
          html: '<b>Размер файла не должен превышать 9М</b>'  
        }) 
      }
      this.progr = true;
      this.UploadService.uploadFile('http://192.168.1.70/phones/ajax/loadAnyFile_a.php', fileBrowser.files[0])
        .subscribe(
          response => {
            //console.log( JSON.stringify(response.type) );
            //console.log( JSON.stringify(response) );
            if (response.type == 4) {
              this.progr = false;
              if (!response['body']['success']) {
                return Swal.fire({
                  type: 'error',
                  title: 'Ответ сервера',
                  html: '<b>'+response['body']['message']+'</b>'  
                }) 
              } else {
                this.dataTable.DataTable().destroy();
                this.getListFiles();
                return Swal.fire({
                  type: 'success',
                  title: 'Успех',
                  html: '<strong><i>Файл загружен!</i></strong>' 
                }) 
              }
            }
          }, error => {
            this.progr = false;
            return Swal.fire({
              type: 'error',
              title: 'Ошибка',
              html: '<b>Ошибка при загрузке файла</b>'  
            }) 
          }
        )
    }
  }  
  getListFiles() {

    this.httpService.getListFiles().subscribe(
      (response: any) => {
      this.listFiles = response;
      //console.log( JSON.stringify(this.listFiles) );
      this.dataTable = $(this.Table.nativeElement);
      setTimeout(()=>{
        this.dataTable.DataTable({
          scrollY: 345,
          //scrollX: true,
          select: { items: 'cell' },
          processing: true,
          //retrieve: true,
          language: {
            "processing": "Подождите...",
            "search": "Поиск:",
                     "lengthMenu": 'Показать <select>'+
                        '<option value="5">5</option>'+
                        '<option value="6">6</option>'+
                        '<option value="10">10</option>'+
                        '<option value="50">20</option>'+
                        '<option value="-1">Все</option>'+
                        '</select> записей',
            "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
            "infoEmpty": "Записи с 0 до 0 из 0 записей",
            "infoFiltered": "(отфильтровано из _MAX_ записей)",
            "infoPostFix": "",
            "loadingRecords": "Загрузка записей...",
            "zeroRecords": "Записи отсутствуют.",
            "emptyTable": "В таблице отсутствуют данные",
            "paginate": {
              "first": "Первая",
              "previous": "Предыдущая",
              "next": "Следующая",
              "last": "Последняя"
            },
            "aria": {
              "sortAscending": ": активировать для сортировки столбца по возрастанию",
              "sortDescending": ": активировать для сортировки столбца по убыванию"
            }
          },
         
  
        })
        },500)

     }, error => {
      console.log('Ошибка при попытке чтения списка файлов')
     }
    )

  }
  /*
  view_doc(path: string) {
    this.newWindow = window.open("http://192.168.1.70://phones/ajax/view_doc_a.php?path="+path,"Download",
     "name='Download',width=400,height=200");
   
  }
  */
  view_doc1(path: string, filename: string) {

    this.http.get("http://192.168.1.70://phones/ajax/view_doc_a.php?path="+path,
    {responseType: 'blob' as 'json'}).subscribe(
        (response: any) =>{
            let dataType = response.type;
            let binaryData = [];
            binaryData.push(response);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            if (filename)
                downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.parentNode.removeChild(downloadLink);
        }
    )
  } 

  del_doc(path: string) {
    let dataObject = {
      file_name : path
    };
    Swal.fire({
      title: 'Подтвердите',
      html: '<h6>Удалить файл: ' + path +'?!</h6>',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Отмена',
      confirmButtonText: 'Да, удалить'
    }).then((result) => {
        if (result.value) {

                          this.httpService.delFile(dataObject).subscribe(
                            response => {
                              if (response['success']) {
                                this.dataTable.DataTable().destroy();
                                this.getListFiles();
                                return Swal.fire({
                                  type: 'success',
                                  title: 'Успех',
                                  html: '<strong><i>Файл удален.</i></strong>' 
                                }) 
                              } else {
                                return Swal.fire({
                                  type: 'error',
                                  title: 'Ответ сервера',
                                  html: '<b>'+response['message']+'</b>'  
                                }) 
                              }
                      
                          }, error => {
                            return Swal.fire({
                              type: 'error',
                              title: 'Ошибка',
                              html: '<b>'+'Что-то не туда пошло.'+'</b>'  
                            }) 
                            //console.log('Ошибка при попытке удаления файла')
                          }
                         )
                        } 
                      } 
              )  
      } 
      showIp() {
        const ipAPI = 'https://api.ipify.org?format=json';
        
          Swal.queue([{
            title: 'Ваш публичный IP',
            confirmButtonText: 'Показать мой внешний IP',
            text:
              'Ваш публичный IP будет определен ' +
              'с помощью AJAX запроса',
            showLoaderOnConfirm: true,
            preConfirm: () => {
              return fetch(ipAPI)
                .then(response => response.json())
                .then(data => Swal.insertQueueStep(data.ip))
                .catch(() => {
                  Swal.insertQueueStep({
                    type: 'error',
                    title: 'Unable to get your public IP'
                  })
                })
            }
          }])
      }
}
