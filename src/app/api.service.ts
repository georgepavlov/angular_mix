import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }
  //part_url = 'http://192.168.1.70/phones/';
  part_url = 'http://localhost/phones/';
  dptcod: string;
  getData() {
    return this.http.get(this.part_url + 'ajax/all_list_a.php');
  }
  getDptdsc() {
    return this.http.get(this.part_url + 'ajax/getDptdsc_a.php');
  }
  getAddress(data) {
    return this.http.post(this.part_url + 'ajax/view_office_a.php', data);
  };
  getGosuslugi(data) {
    return this.http.post(this.part_url + 'ajax/getGosuslugi_a.php', data);
  };
  updateData(data) {
    return this.http.post(this.part_url + 'ajax/updateRecordUpfr_a.php', data);
  } 
  insertData(data) {
    return this.http.post(this.part_url + 'ajax/insertRecordUpfr_a.php', data);
  } 
  delRecord(data) {
    return this.http.post(this.part_url + 'ajax/delOne_a.php', data);
  } 
  getRank(data) {
    return this.http.post(this.part_url + 'ajax/getRankUpfr_a.php', data);
  };
  getOtdel(data) {
    return this.http.post(this.part_url + 'ajax/getOtdelUpfr_a.php', data);
  };
  getListFiles() {
    return this.http.get(this.part_url + 'ajax/list_files_a.php');
  }
  delFile(data) {
    return this.http.post(this.part_url + 'ajax/delete_doc_a.php', data);
  }
}


