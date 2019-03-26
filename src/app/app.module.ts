import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {MenuModule} from 'primeng/menu';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ContextMenuModule} from 'primeng/contextmenu';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { DashComponent } from './dash/dash.component';
import {InputTextModule} from 'primeng/inputtext';
import {SelectButtonModule} from 'primeng/selectbutton';
import { ReactiveFormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputMaskModule} from 'primeng/inputmask';
import {CheckboxModule} from 'primeng/checkbox';
import {CalendarModule} from 'primeng/calendar';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {ToastModule} from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http'; 


@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    CreateComponent,
    DashComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenuModule,
    BrowserAnimationsModule,
    ContextMenuModule,
    InputTextModule, 
    SelectButtonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputMaskModule,
    CheckboxModule,
    CalendarModule,
    TableModule,
    ToastModule,
    CardModule,
    HttpClientModule
  ],
  providers: [], 
  bootstrap: [AppComponent]
})
export class AppModule { }
  