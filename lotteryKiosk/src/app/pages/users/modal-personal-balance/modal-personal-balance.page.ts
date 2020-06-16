import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { UsersService } from 'src/app/providers/users.service';


@Component({
  selector: 'app-modal-personal-balance',
  templateUrl: './modal-personal-balance.page.html',
  styleUrls: ['./modal-personal-balance.page.scss'],
})

export class ModalPersonalBalancePage implements OnInit {
  user: any
  validations_form: FormGroup;
  message: string
  userObserver: any
  currentUser = []

  constructor( private navParams: NavParams, private formBuilder: FormBuilder, private modalCtrl: ModalController,
    private userService: UsersService ) { 
    this.user = this.navParams.data.user;
    console.log("user ", this.user)
    this.userObserver = this.userService.userWatcher$
    this.userObserver.subscribe( res => this.currentUser = res[0])
    
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
    if ( this.currentUser['idrole']=== "ROLE_AD" ){
      this.user.amount = data.amount;
      this.user.date = data.date
      if ( data.amount ) {
        this.modalCtrl.dismiss( this.user ) 
      }
    }else{
      this.message = "You cannot modify any field. You are not ADMIN."
    }
  }
  cancel(){
    this.modalCtrl.dismiss(null) 
  }
  

}
