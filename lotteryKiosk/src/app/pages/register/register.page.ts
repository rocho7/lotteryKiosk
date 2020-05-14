import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { AuthenticationService } from '../../services/authentication.service'
import { NavController } from '@ionic/angular'

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
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  constructor( private authService: AuthenticationService, private fb: FormBuilder, private navCtrl: NavController ) { }

  ngOnInit() {
    this.validations_form = this.fb.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ]))
    })
  }
  tryRegister( value ) {
    console.log("value ", value)
    this.authService.registerUser(value)
    .then( res => {
      console.log("res ", res);
      this.errorMessage = '';
      this.successMessage = "Your account has been created. Please long in."
      
      this.authService.loginUser( value )
      .then( res => this.navCtrl.navigateForward('dashboard'))
    }, err =>{
      console.log("err ", err);
      this.errorMessage = err.message;
      this.successMessage = ''
    })
  }
  goLoginPage(){
    this.navCtrl.navigateBack('')
  }

}
