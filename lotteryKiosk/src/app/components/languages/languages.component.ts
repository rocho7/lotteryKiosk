import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LanguagesService } from 'src/app/services/languages.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
})
export class LanguagesComponent implements OnInit {

  languages = [];
  selected = []
  validations_form: FormGroup
  @Output() idiom = new EventEmitter()

  constructor( private languagesService: LanguagesService, private fb: FormBuilder) { }

  ngOnInit() {
    this.languages = this.languagesService.getLanguages()
    this.selected = this.languages.filter( line => line.value === this.languagesService.selected)
    this.select( this.selected[0] )
    this.validations_form = this.fb.group({
      selectLanguage: new FormControl(this.selected, Validators.compose([
        Validators.required
     ]))
    })
  }
  
  select ( lng ) {
    this.idiom.emit( lng.value )
    console.log("lng ", lng)
    this.languagesService.setLanguage( lng.value )
  }

}
