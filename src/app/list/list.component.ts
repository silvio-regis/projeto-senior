import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],  
  providers: [MessageService]
})
export class ListComponent implements OnInit {

  list: [{
    id: Number,
    nome: String,
    unidade: String,
    unidadeDesc: String,
    quantidade: String,
    preco: String,
    perecivel: Boolean,
    perecivelDesc: String,
    validade: Date,
    vencido: String,
    fabricacao: Date    
  }];

  constructor(private messageService: MessageService, private router: Router) {}

  ngOnInit() {
    
    this.prepareList();

    localStorage.removeItem('itemEdit');

    this.messageService.clear();
    this.msgResultForm();
  }

  /**
   * Metodo que faz o tratamento dos dados para exibir na lista
   */
  prepareList(){
    this.list = JSON.parse(localStorage.getItem('cadastroLocal'));    
        
    let i,
        today = new Date();

    for (i in this.list) {
      let dataValidade = new Date(this.list[i].validade);

      this.list[i].id = i;

      if (this.list[i].validade) {
        if (dataValidade < today ) 
          this.list[i].vencido = 'Item vencido';      
      }else {
        this.list[i].vencido = 'Validade não cadastrada';
      }     

      if (this.list[i].perecivel) 
        this.list[i].perecivelDesc = 'Perecível';
      else
        this.list[i].perecivelDesc = 'Não Perecível';
      
      if (this.list[i].unidade == 'un')
        this.list[i].unidadeDesc = 'Unidades';
      else if (this.list[i].unidade == 'lt')
        this.list[i].unidadeDesc = 'Litros';
      else 
        this.list[i].unidadeDesc = 'Quilogramas';
    }
  }

  /**
   * Metodo que faz a exibicao do Toast
   * 
   * String msg
   */
  showMsg(msg) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: msg });
  }

  /**
   * Metodo que valida e manda para showMsg a msg a ser exibida
   */
  msgResultForm() {
    let msgAcaoResult = localStorage.getItem('acaoResult'),
        preserveThis = this;

    if (msgAcaoResult) {
      setTimeout(function () {
        preserveThis.showMsg(msgAcaoResult);
      }, 500);
      localStorage.removeItem('acaoResult');
    }
  }

  /**
   * Metodo que seta como acao de edicao e manda para
   * a pagina do formulario, onde ira exibir os dados
   * salvos no localStorage conforme ID passado.
   * 
   * Number i
   */
  goEdit(i) {
    localStorage.setItem('itemEdit', i);
    
    this.router.navigate(['/edit']);  
  }

  /**
   * Metodo que chama o Toast prompt (onConfirm or onReject)
   * 
   * Number i
   */
  goDelete(i) {
    localStorage.setItem('itemDelete', i);
    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'error', summary: 'Você deseja realmente deletar o item ' + i + '?', detail: 'Para excluir, confirme abaixo' });
  }

  /**
   * Metodo chamado ao confirmar o Toast 
   * de onDelete, que exclui o item do localStorage
   * e atualiza a page
   */
  onConfirm() {
    let itemDelete = localStorage.getItem('itemDelete'),
        itens = JSON.parse(localStorage.getItem('cadastroLocal')),
        itemName: String;

    itemName = itens[itemDelete].nome;

    itens.splice(itemDelete, 1);
    localStorage.setItem('cadastroLocal', JSON.stringify(itens)); 

    localStorage.removeItem('itemDelete');
    localStorage.setItem('acaoResult', 'Item "' + itemName + '" excluído com sucesso!');

    this.ngOnInit();    
  }
  
  /**
   * Caso negado o Toast onDelete, remove a
   * requisicao de deletar o item especificado
   */
  onReject() {
    localStorage.removeItem('itemDelete');    
    this.messageService.clear();
  }
}
