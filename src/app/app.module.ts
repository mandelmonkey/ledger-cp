import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { DataService } from './shared/data.service';
import 'hammerjs';
import { RawsignComponent } from './rawsign/rawsign.component';
import { FaqComponent } from './faq/faq.component';
@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    RawsignComponent,
    FaqComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot()
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
