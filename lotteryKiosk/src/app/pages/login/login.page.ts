import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { NavController } from '@ionic/angular'
import { AuthenticationService } from '../../services/authentication.service'
import { StorageService } from 'src/app/services/store/storage.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';
  userInfo: any

  constructor( private navCtrl: NavController, private authService: AuthenticationService, private formBuilder: FormBuilder,
    private storage: StorageService, private loader: LoadingService) { }
  
  ngOnInit() {

    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ]))
    })
    this.storage.get("userInfo")
    .then( user => {
      this.userInfo = user;
      if ( this.userInfo ) this.validations_form.controls['email'].setValue(this.userInfo.userInfoFireBase.providerData[0].email)
    })
  }
  validation_messages = {
    'email':[
      {type: 'required', message: 'Email is required'},
      {type: 'pattern', message: 'Please enter a valid email'}
    ],
    'password': [
      {type: 'required', message: 'Password is required'},
      {type: 'minlength', message: 'Password must be at least 6 characters long.'}
    ]
  }
  loginUser( value ) {
    this.loader.presentLoading()
    this.authService.loginUser( value )
    .then( res => {
      this.loader.hideLoading()
      this.errorMessage = '';
      this.navCtrl.navigateRoot('/menu/tabs/group-list')
    }, err =>{
      this.loader.hideLoading()
      this.errorMessage = err.message
    })
  }
  
  goToRegisterPage(){
    this.navCtrl.navigateForward('/register')
  }
}
