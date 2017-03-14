import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { QRCodeModule } from 'angular2-qrcode';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { DataService } from './shared/data.service';

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    QRCodeModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
