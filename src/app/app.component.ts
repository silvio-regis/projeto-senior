import { Component, NgModule } from '@angular/core';

import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/primeng';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@NgModule({
  imports: [
    MenuModule
  ]
})

export class AppComponent {
  private items: MenuItem[];

  constructor(private title: Title) {}

  /**
   * Metodo onInit, seta titulo e menu
   */
  ngOnInit() {
    this.title.setTitle('Gerenciamento de Itens - Silvio Regis');

    this.items = [{
        label: 'Cadastro de itens',
        items: [
          {label: 'Dashboard', icon: 'pi pi-home', routerLink: 'dash'},
          {label: 'Novo item', icon: 'pi pi-plus', routerLink: 'create'},
          {label: 'Listagem', icon: 'pi pi-pencil', routerLink: 'list'}
        ]
    }];
  }

}
