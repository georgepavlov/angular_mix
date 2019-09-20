import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import { MailComponent } from './mail/mail.component';
import { GeolocateComponent } from './geolocate/geolocate.component';

const routes: Routes = [
  { path: '', component: ViewComponent },
  { path: 'create', component: CreateComponent},
  { path: 'update', component: UpdateComponent },
  { path: 'mail', component: MailComponent },
  { path: 'geoloc', component: GeolocateComponent },
  { path: '**', component: ViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
