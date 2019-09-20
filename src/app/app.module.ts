import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ViewComponent, NgbdModalContent } from './view/view.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './create/create.component';
import { UpdateComponent, NgbdModalDate } from './update/update.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MailComponent } from './mail/mail.component';
import { GeolocateComponent } from './geolocate/geolocate.component';



@NgModule({
  declarations: [
    AppComponent,
    ViewComponent,
    NgbdModalContent,
    CreateComponent,
    UpdateComponent,
    NgbdModalDate,
    MailComponent,
    GeolocateComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [NgbdModalContent, NgbdModalDate]   
})
export class AppModule { }
