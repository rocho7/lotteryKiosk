import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { AuthenticationService } from '../../services/authentication.service'
import { NavController } from '@ionic/angular'
import { UserListClass } from '../../classes/userClassModel'
import { UsersService } from '../../providers/users.service'
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup
  errorMessage = ''
  successMessage = ''

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };

  constructor( private authService: AuthenticationService, private fb: FormBuilder, private navCtrl: NavController,
    private userService: UsersService, private loader: LoadingService) { }

  ngOnInit() {

    this.validations_form = this.fb.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$')
      ])),
      nick: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9 ]+$')
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      language: new FormControl(''),
      acceptedProtectionLaw: new FormControl(false, Validators.compose([
        Validators.requiredTrue
      ]))
    })
  }
  getIdiomFromChild( language ){
    this.validations_form.get('language').setValue( language )
  }
  tryRegister( value ) {
    console.log("value ", value)
    this.loader.presentLoading()

    this.authService.registerUser(value)
    .then( res => {
      let user = new UserListClass();
      user.uid = res.user.uid.trim()
      user.email = res.user.email.trim()
      user._nick = value.nick.trim()
      user.name = value.name.trim()
      user.acceptedProtectionLaw = value.acceptedProtectionLaw
      user.idrole = user.idrole.trim()
      user.language = value.language.trim()
      user.avatar = value.avatar
      
      this.registerNewAccount( user, value )
    }, err =>{
      this.errorMessage = err.message;
      this.successMessage = ''
    })
  }
  registerNewAccount( user: UserListClass, value ){

    this.userService.registerAccountDB( user )
    .then( userRegistered => {
      
    this.errorMessage = '';
    this.successMessage = "Your account has been created. Please long in."

    this.login( value )

    }).catch( err =>{
      this.errorMessage = err.message;
      this.successMessage = ''
      this.loader.hideLoading()
    })
  }
  login( value ){
    
    this.authService.loginUser( value )
    .then( res => this.navCtrl.navigateRoot('/menu/tabs/group-list'))
    this.loader.hideLoading()
  }
  goLoginPage(){
    this.navCtrl.navigateBack('')
  }
}
