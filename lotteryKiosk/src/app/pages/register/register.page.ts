import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { AuthenticationService } from '../../services/authentication.service'
import { NavController } from '@ionic/angular'
import { UserListClass } from '../../classes/userClassModel'
import { UsersService } from '../../providers/users.service'

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
    private userService: UsersService ) { }

  ngOnInit() {
    this.validations_form = this.fb.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z ]+$')
      ])),
      nick: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z ]+$')
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]))
    })
  }
  tryRegister( value ) {
    console.log("value ", value)
    this.authService.registerUser(value)
    .then( res => {
      console.log("auth register ", res);
      let user = new UserListClass();
      user.uid = res.user.uid
      user.email = res.user.email
      user._nick = value.nick
      user.name = value.name

      this.registerNewAccount( user, value )
    }, err =>{
      console.log("err ", err);
      this.errorMessage = err.message;
      this.successMessage = ''
    })
  }
  registerNewAccount( user: UserListClass, value ){

    this.userService.registerAccountDB( user )
    .then( userRegistered => {
      console.log("userRegistered ", userRegistered)
      
    this.errorMessage = '';
    this.successMessage = "Your account has been created. Please long in."

    this.login( value )

    }).catch( err =>{
      console.log("err ", err);
      this.errorMessage = err.message;
      this.successMessage = ''
    })
  }
  login( value ){
    
    this.authService.loginUser( value )
    .then( res => this.navCtrl.navigateRoot('/menu/users'))
  }
  goLoginPage(){
    this.navCtrl.navigateBack('')
  }

}
