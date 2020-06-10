import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'


@Component({
  selector: 'app-modal-personal-balance',
  templateUrl: './modal-personal-balance.page.html',
  styleUrls: ['./modal-personal-balance.page.scss'],
})

export class ModalPersonalBalancePage implements OnInit {
  user: any
  validations_form: FormGroup;

  constructor( private navParams: NavParams, private formBuilder: FormBuilder, private modalCtrl: ModalController ) { 
    this.user = this.navParams.data.user;
    console.log("user ", this.user)
    
  }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      amount: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ])),
      date: new FormControl(new Date().toISOString(), Validators.compose([
        Validators.required
      ]))
    })
  }
  
  Accept( data ) {
    this.user.amount = data.amount;
    if ( data.amount ) {
      this.modalCtrl.dismiss( this.user ) 
    }
  }
  cancel(){
    this.modalCtrl.dismiss(null) 
  }
  

}
