import { Component, OnInit, ViewChild, Injectable, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, ModalDismissReasons}  from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import { NgbDatepickerI18n, NgbDateStruct,  NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const I18N_VALUES = {
  'ru': {
    weekdays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
    months: ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.',
    'сент.', 'окт.', 'нояб.', 'дек.'],
  }
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'ru';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

@Component({
  selector: 'ngbd-modal-date',
  
  template: `
  <div class="modal-header">
    <h5 class="modal-title" id="modal-basic-title">Запросить на дату</h5>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <form class="form-inline">
      <div class="form-group">
        <div class="input-group">
          <input class="form-control" placeholder="yyyy-mm-dd"
                 name="dp" [(ngModel)]="model" ngbDatepicker #d="ngbDatepicker">
          <div class="input-group-append">
            <button class="btn btn-outline-info calendar" (click)="d.toggle()" type="button">
            <fa-icon [icon]="faCalendar"></fa-icon></button>
          </div>
          &nbsp;&nbsp;
            <button type="button" class="btn btn-primary" (click)="setToday()">Сегодня</button>
        </div>
      </div>
    </form> 
  </div>
  <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close(model)">Сохранить</button>
  </div>`,
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class NgbdModalDate {
  faCalendar = faCalendar;
  model: any;
  closeResult: string;
  constructor(public activeModal: NgbActiveModal, private http: HttpClient, private calendar: NgbCalendar) {
    
  }
  setToday() {
    this.model = this.calendar.getToday();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}  
declare var $;
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
  providers: []

})

export class UpdateComponent {
  model: any;
  public xmlItems: any; 
  public date_rq: string; 
  date_rq_xml: any;
  @ViewChild('filesTable', { static: false }) Table: { nativeElement: any; };
  public dataTable: any;

  constructor(private modalService: NgbModal, private http: HttpClient, private calendar: NgbCalendar,
    private router: Router) {
    
  }

  loadXML(date_r: string) { 
    var data = {
      date_rq: date_r
    }
    this.http.post('http://192.168.1.70/phones/ajax/gxml.php', data).subscribe( 
      response => {
        this.xmlItems = response;
        //console.log( JSON.stringify(response) );
        this.date_rq_xml = response[0]['date_rq'];
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
                          '<option value="7">7</option>'+
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
        console.log('Ошибка при попытке чтения курсов валют')
       }
      )
  }  
  

  showValute() {
    this.model.day = (this.model.day < 10 ? '0' : '') + this.model.day;
    this.model.month = (this.model.month < 10 ? '0' : '') + this.model.month;
    this.date_rq=this.model.day+'/'+this.model.month+'/'+this.model.year;
    this.dataTable.DataTable().destroy();
    this.loadXML(this.date_rq);
  }
  setToday() {
    this.model = this.calendar.getToday();
  }
  
  ngOnInit() {
    this.loadXML('');

  }

  openInputDate() {
  const modalRef = this.modalService.open(NgbdModalDate);
  modalRef.componentInstance.model = this.calendar.getToday();
  modalRef.result.then((result) => {
    if (result) {
      this.model = result;
      this.showValute();
    } 
  }, (reason) => {
    
  }
  );
}

}