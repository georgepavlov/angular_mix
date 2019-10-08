import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ApiService} from '../api.service';
import { User } from '../user';
import { Dptcls } from '../dptcls';
import Swal from 'sweetalert2';
import {Router} from "@angular/router";
//import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
//import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, NgModel } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'ngbd-modal-content',
  templateUrl: './modal.component.html',
  providers: [ApiService] 
})
export class NgbdModalContent {
  @Input() Empl: User;
  
  rankList: any = [{'dolgnost': 'Большой специалист'}, {'dolgnost': 'Средний специалист'},
                   {'dolgnost': 'Самый главный специалист-эксперт'},
                   {'dolgnost': 'Гланый бухгалтер - начальник всех бухгалтеров в ОПФР и УПФР'}];
  selDolgnost: any;
  otdList: any = [{'otdel': 'Большие специалисты'}, {'otdel': 'Средние специалисты'},
  {'otdel': 'Самые главные специалисты-эксперты'},
  {'otdel': 'Гланый бухгалтер - начальник всех бухгалтеров в ОПФР и УПФР'}];
  selOtdel: any;



  constructor(public activeModal: NgbActiveModal, private httpService: ApiService) {

   setTimeout(()=>{
    this.showRank(this.Empl.dptcod);
    this.selDolgnost=this.Empl.dolgnost;
    this.showOtdel(this.Empl.dptcod);
    this.selOtdel=this.Empl.otdel;
   }, 500);

  }
  
  showRank(dptcod: string) {
    var dataObject = {
      upfr_code : dptcod
    }
    this.httpService.getRank(dataObject).subscribe(
      response => {
      this.rankList = response;
      //console.log( JSON.stringify(response) );
     }, error => {
      console.log('Ошибка при попытке чтения списка должностей')
     }
    )
  }
  showOtdel(dptcod: string) {
    var dataObject = {
      upfr_code : dptcod
    }
    this.httpService.getOtdel(dataObject).subscribe(
      response => {
      this.otdList = response;
      //console.log( JSON.stringify(response) );
     }, error => {
      console.log('Ошибка при попытке чтения списка отделов')
     }
    )
  }
  submit(form: NgForm, dolgnost: any) {
    this.Empl.dolgnost = dolgnost;
    this.Empl.otdel = this.selOtdel;
    this.Empl.phone_city = form.value.phonecity;
    this.Empl.phone_kspd = form.value.phonekspd;
    this.Empl.fam = form.value.fam;
    this.Empl.nam = form.value.nam;
    this.Empl.ptr = form.value.ptr;
    this.activeModal.close(this.Empl);
  }
  save(dolgnost: any, phone_city:NgModel) {
    //console.log(phone_city.model);
    this.Empl.dolgnost = dolgnost;
    this.activeModal.close(this.Empl);
  }
  
}
//end---------------------------

//declare var $: any;

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers: [ApiService]
})

export class ViewComponent implements OnInit {
  users: User[] = [];
  address: string = '';
  dptdsc: Dptcls[] = [];
  youSelect: string = '44000';
  blank: User;
  len1: number = 0;
  len2: number = 0;
  //faEdit = faEdit;
  //faTrash = faTrash;
  tmprow: any;
  cell: any;
  message = '';
  idx: number = -1;
  indx: number = 0;
  selFam: string = '';
 
  @ViewChild('usersTable', { static: false }) Table: { nativeElement: any; };
  public dataTable: any;
  dptcod: string = '11111';
  office: any = '1';
  contact: string = '';
  currPage: number;
  constructor(private httpService: ApiService, private router: Router, private modalService: NgbModal){
    this.blank = new User();
    
  }

  someClickHandler(uid: string): void {
      this.idx = -1;
      if (uid=='') this.indx = 0;
      for (let j = 0; j < this.users.length; j++) {
        if (this.users[j].id === uid) {
          this.idx = j;
          break;
        }
      }
      if (this.idx>=0 || this.indx == 0) {
        this.indx = +this.users[this.idx].id;
        this.selFam = this.users[this.idx].fam;
      } else {
        this.indx = 0;
        this.selFam = '';
      }
  }
 
  ngOnInit() { 
    this.loadData();
  }  
     
  loadData() {
    Swal.fire({
      title: 'Загрузка информации',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    })
    this.httpService.getDptdsc().subscribe(
      (response: any) => {
        this.dptdsc=response;
        //console.log(JSON.stringify(this.dptdsc));
       }, error => {
        return Swal.fire({
          type: 'error',
          title: 'Ошибка',
          html: '<b>Не загрузился список подразделений</b>'  
        }) 
       }
    )
    this.httpService.getData().subscribe(
      (data:any) => {
      this.users=data;
      
      this.dataTable = $(this.Table.nativeElement);
      setTimeout(()=>{
        this.dataTable.DataTable({
          scrollY: 340,
          //scrollX: true,
          select: { items: 'cell' },
          processing: true,
          //retrieve: true,
          language: {
            "processing": "Подождите...",
            "search": "Поиск:",
                     "lengthMenu": 'Показать <select>'+
                        '<option value="3">3</option>'+
                        '<option value="4">4</option>'+
                        '<option value="5">5</option>'+
                        '<option value="10">10</option>'+
                        '<option value="50">50</option>'+
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
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).unbind('click');
            $('td', row).bind('click', () => {
              this.cell = $('td', row).eq(1).text();
              this.someClickHandler(this.cell);
            });
            return row;
          },
  
        })
        },2000)
        Swal.fire({
          title: 'Загрузка завершена',
          onClose: () => {
          }
        })
      }, error => {
          this.contact = 'Ошибка при запросе';
          return Swal.fire({
            type: 'error',
            title: 'Ошибка',
            html: '<b>Не получены данные с сервера</b>'
          })
        }
    )
  }
  showUpfr1(dptcod: string) {
    var dataObject = {
      upfr_code : dptcod
    }
    Swal.fire({
        title: 'Загрузка информации',
        onBeforeOpen: () => {
          Swal.showLoading();
        }
    })
    this.httpService.getGosuslugi(dataObject).subscribe(
      response => {
      this.contact=response[0]['contact'];
      return Swal.fire({
        type: 'success',
        title: 'Информация',
        html: '<strong><i>' + this.contact + '</i></strong>' 
      })
     }, error => {
      this.contact = 'Ошибка в идентификаторе УПФР(ОПФР)';
      return Swal.fire({
        type: 'error',
        title: 'Ошибка',
        html: '<b>Неверный идентификатор подразделения</b>'  
      }) 
     }
    )
  }
 
  showNew(dptcod: string) {
    this.blank.dptcod = dptcod;
    this.openI(this.blank);
  }
  showOffice(dptcod: string, office: string) {
    var dataObject = {
      upfr_code : dptcod,
      id_office : office
    }
    Swal.fire({
      title: 'Загрузка информации',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    })
    this.httpService.getAddress(dataObject).subscribe(
      response => {
      this.address=response[0]['address'];
      return Swal.fire({
        type: 'success',
        title: 'Адрес офиса',
        html: '<strong><i>' + this.address + '</i></strong>' 
      }) 
     }, error => {
      this.address = 'Ошибка в идентификаторе офиса';
      return Swal.fire({
        type: 'error',
        title: 'Ошибка',
        html: '<b>Неверный идентификатор офиса</b>'
      })
     }
    )
  }
  getNavigation(link, id) {   
    if(id === '') {          
        this.router.navigate([link]);
    } else { 
        this.router.navigate([link + '/' + id]);
    }
  } 
 
  openI(data: User) {
    const modalRef = this.modalService.open(NgbdModalContent,{size:'lg'});
    modalRef.componentInstance.Empl = data;
    modalRef.result.then((result) => {
      if (result) {
          Swal.fire({
            title: 'Работа с базой данных',
            onBeforeOpen: () => {
              Swal.showLoading()
            }
          })
          this.httpService.insertData(result).subscribe(
            response => {  
             /*
              this.len1 = this.users.length+1;
              this.blank.id = response['id'];
              this.blank.citycode = response['citycode'];
              this.blank.office = '1';
              this.users.push(this.blank);
              
              this.dataTable.DataTable().row.add(['<small>' + this.len1 + '</small>',
              '<small>' + response['id'] + '</small>',
              '<small> ' + result.dptcod + '</small>','<small>  ' + this.blank.office + '</small>',
              '<small>' + response['citycode'] + '</small>','<small>' + result.phone_city + '</small>',
              '<small>' + result.phone_kspd + '</small>',
              '<small>' + result.fam + '</small>','<small>' + result.nam+'</small>','<small>' + result.ptr+'</small>',
              '<small>' + result.dolgnost + '</small>','<small>' + result.otdel + '</small>']).draw().node();
             */       
           Swal.fire({
            title: 'Информация',
            html: '<strong><i>' + 'Добавлено. ' +
            'Редактировать или удалить новую запись можно после перезагрузки списка телефонов.' + '</i></strong>',
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Далее',
            confirmButtonText: 'Перезагрузка'
          }).then((result) => {
            if (result.value) {
              
              this.dataTable.DataTable().destroy();
              this.users.splice(0,this.users.length);
              this.idx = -1;
              this.indx = 0;
              
              this.loadData();
             
            }


          })
          

           }, error => {
            return Swal.fire({
              type: 'error',
              title: 'Ошибка',
              html: '<b>Insert: Что-то здесь не так!</b>'  
            }) 
           }
        )   
      }
    }, (reason) => {
      //alert('dismiss?');
    });
  }
  delRecord(i: number) {
    Swal.fire({
      title: 'Подтвердите',
      text: "Удалить запись?:"+ this.users[i].fam,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Отмена',
      confirmButtonText: 'Да, удалить'
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: 'Работа с базой данных',
          onBeforeOpen: () => {
            Swal.showLoading()
          }
        })

        this.httpService.delRecord(this.users[i]).subscribe(
          response => {   
            this.dataTable.DataTable().row(i).remove().draw().node();
            this.users.splice(i, 1);
            this.idx = -1;
            this.indx = 0;
            //this.someClickHandler('');
          return Swal.fire({
            type: 'success',
            title: 'Информация',
            html: '<strong><i>' + 'Cтрока удалена.' + '</i></strong>' 
          })
          this.someClickHandler('');
         }, error => {
          return Swal.fire({
            type: 'error',
            title: 'Ошибка',
            html: '<b>Delete: Неверное что-то!</b>'  
          }) 
         }
        )

      }
    })
  }
  openU(idx: number) {
    const modalRef = this.modalService.open(NgbdModalContent,{size:'lg'});
    modalRef.componentInstance.Empl = this.users[idx];
    modalRef.result.then((result) => {
      if (result) {
          this.indx = +result.id;
          Swal.fire({
            title: 'Работа с базой данных',
            onBeforeOpen: () => {
              Swal.showLoading()
            }
          })
          this.httpService.updateData(result).subscribe(
            response => {
              this.someClickHandler(result.id);
            return Swal.fire({
              type: 'success',
              title: 'Информация',
              html: '<strong><i>' + 'Записано!' + '</i></strong>' 
            })
           }, error => {
            return Swal.fire({
              type: 'error',
              title: 'Ошибка',
              html: '<b>Update: Неверное что-то!</b>'  
            }) 
           }
        )
      } 
    }, (reason) => {
      //alert('dismiss?');
    }
    );
  }

}