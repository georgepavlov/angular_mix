import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadFile(url: string, file?: File, name?: string, email?: string, text?: string): Observable<HttpEvent<any>> {

    let formData = new FormData();

    if (file) {
      formData.set('myfile', file);
    }
    if (name) {
      formData.set('name', name);
    }
    if (email) {
      formData.set('email', email);
    }
    if (text) {
      formData.set('text', text);
    }
        
    let params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest('POST', url, formData, options);
    return this.http.request(req);
  }

}
