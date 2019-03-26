import { Component, OnInit, NgModule } from '@angular/core';
import {SelectButtonModule} from 'primeng/selectbutton';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { Unidade } from '../unidade';
import {Router} from '@angular/router'


@Component({  
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})


export class CreateComponent implements OnInit {

  litro: Unidade = {
    nome: 'Litro',
    abrev: 'lt'
  };

  quilograma: Unidade = {
    nome: 'Quilo',
    abrev: 'kg'
  }; 

  unidade: Unidade = {
    nome: 'Unidade',
    abrev: 'un'
  };

  titleCreate: String;
  tipoUnidade: SelectItem[];
  tipoUnidadeSelected = this.litro.abrev;

  form_create: FormGroup;

  form_pattern: {
    nome: '',
    unidade: 'lt',
    quantidade: '',
    preco: '',
    perecivel: Boolean,
    validade: null,
    fabricacao: null    
  };

  mask: String;  
  perecivel: boolean;
  validade: Date;
  fabricacao: Date;
  vencido: String;
  isValidFabricacao : String;
  isSubmit: Boolean;
  obrigatorio: String;

  constructor(private fb: FormBuilder, private router: Router) { 
    this.perecivel = false;
    this.form_pattern = {
      nome: '',
      unidade: 'lt',
      quantidade: '',
      preco: '',
      perecivel: this.perecivel,
      validade: null,
      fabricacao: null    
    };
  }

  
  /**
   * Metodo onInit, que verifica se esta 
   * editando (caso sim, pega os dados para editar)
   * ou cadastrando (caso sim, pega os defaults e seta)
   */
  ngOnInit() {

    let isEdit = localStorage.getItem('itemEdit');

    this.tipoUnidade = [
      {label: this.litro.nome, value: this.litro.abrev},
      {label: this.quilograma.nome, value: this.quilograma.abrev},
      {label: this.unidade.nome, value: this.unidade.abrev}
    ];

    if (isEdit){

      let item = JSON.parse(localStorage.getItem('cadastroLocal'))[isEdit];

      this.perecivel = item.perecivel;

      if (item.unidade == 'un') {
        this.mask = '999';
      }else {
        this.mask = '999,99';
      }
 
      this.titleCreate = 'Editando o item: ' + item.nome;
      
      item.validade = (item.validade) ? new Date(item.validade) : null;
      item.fabricacao = (item.fabricacao) ? new Date(item.fabricacao) : null;

      this.form_create = this.fb.group({
        nome:        [item.nome, [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-Z]+')]],
        unidade:     [item.unidade, [Validators.required]],
        quantidade:  [item.quantidade],
        preco:       [item.preco, [Validators.required]],
        perecivel:   [item.perecivel, [Validators.required] ],
        validade:    [item.validade],
        fabricacao:  [item.fabricacao, [Validators.required]]
      })

    }else {
      this.mask = '999,99';
      this.titleCreate = 'Cadastro de Itens';

      this.form_create = this.fb.group({
        nome:        [this.form_pattern.nome, [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-Z]+')]],
        unidade:     [this.form_pattern.unidade, [Validators.required]],
        quantidade:  [this.form_pattern.quantidade],
        preco:       [this.form_pattern.preco, [Validators.required]],
        perecivel:   [this.form_pattern.perecivel, [Validators.required] ],
        validade:    [this.form_pattern.validade],
        fabricacao:  [this.form_pattern.fabricacao, [Validators.required]]
      })
    }

  }

  /**
   * Metodo que onChange chamado quando alterado unidade
   * e troca a mascara dependendo da unidade selecionada
   */
  changeUnd(e) {
    this.tipoUnidadeSelected = e.value;

    if (this.tipoUnidadeSelected == 'un')
      this.mask = '999';
    else 
      this.mask = '999,99'; 

  }

  /**
   * Metodo que seta icon de obrigatorio
   * caso for perecivel
   */
  changePerecivel() {
    this.perecivel = this.form_create.value.perecivel;

    if (this.perecivel) 
      this.obrigatorio = '*';
    else 
      this.obrigatorio = '';
  }

  /**
   * Metodo que faz as validacoes onSubmit do form
   */
  onSubmit() {
    this.isSubmit = true;
  
    let hoje = new Date(),
        auxValidade = this.form_create.value.validade,
        auxFabricacao = this.form_create.value.fabricacao,
        retorno = true,
        cadastroLocal = JSON.parse(localStorage.getItem('cadastroLocal')),
        newElem = this.form_create.value,
        isEdit = localStorage.getItem('itemEdit');
        
    if (cadastroLocal == null)
      cadastroLocal = [];

    if (auxValidade && auxValidade < hoje) {
      this.vencido = 'O item está vencido!';
      retorno = false;
    }else {
      this.vencido = '';
      retorno = true; 
    }    

    if (this.perecivel){
      if (auxFabricacao > auxValidade) {
        this.isValidFabricacao = 'A data de fabricação não pode ser maior que a Data de Validade do produto!';
        retorno = false;
      }else  {
        this.isValidFabricacao = '';
        retorno = true;
      }
    }

    if (this.vencido) 
      retorno = false;

    if (this.form_create.valid && retorno) {

        if (isEdit) {
          cadastroLocal[isEdit] = newElem;
          localStorage.setItem('acaoResult', 'Item "' + newElem.nome + '" atualizado com êxito!');
        }else {
          cadastroLocal.push(newElem);
          localStorage.setItem('acaoResult', 'Item cadastrado com êxito!');
        }

        localStorage.setItem('cadastroLocal', JSON.stringify(cadastroLocal));

        
        this.router.navigate(['/list']);  
    }
  }

  /**
   * Metodo onCancel, redireciona para listagem
   */
  onCancel() {    
    this.router.navigate(['/list']);  
  }

  /**
   * Metodo que faz as checagem no campo validade
   */
  checkValidade() {
    let auxValidade = this.form_create.value.validade;

    if (this.perecivel && auxValidade)
      return false;

    return this.perecivel;
  }

  /**
   * Metodo que faz as validacoes no campo validade
   */
  changeValidade() {
    let hoje = new Date(),
        auxValidade = this.form_create.value.validade;
    
    if (auxValidade && auxValidade < hoje) {
      this.vencido = 'O Produto está vencido!';
    }else {      
      this.vencido = '';
    }

  }

  /**
   * Metodo que faz as checagens no campo fabricacao
   */
  checkFabricacao() {
    
    let auxValidade = this.form_create.value.validade,
        auxFabricacao = this.form_create.value.fabricacao;

    if (this.perecivel){
      if (auxFabricacao > auxValidade) {
        this.isValidFabricacao = 'A data de fabricação não pode ser maior que a Data de Validade do produto!';
        return true;
      }else {
        this.isValidFabricacao = '';
        return false;
      }
    }

    if (auxFabricacao)
      return false;

    return true;
  }

  /**
   * Metodo retorna se o campo passado esta valido
   * 
   * String campo
   */
  checkError(campo: string) {
    return this.form_create.get(campo).errors;
  }


}
