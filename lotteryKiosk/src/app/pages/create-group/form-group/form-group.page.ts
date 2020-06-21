import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms'
import { GroupService } from 'src/app/providers/group.service';
import { NavController } from '@ionic/angular'
import { NavigationExtras } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.page.html',
  styleUrls: ['./form-group.page.scss'],
})
export class FormGroupPage implements OnInit {


  constructor( private fb: FormBuilder, private groupService: GroupService, private navCtrl: NavController,
      private authService: AuthenticationService, private loader: LoadingService) { }
  
  form_validations: FormGroup
  codeList = []
  user: object

  ngOnInit() {
    this.form_validations = this.fb.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9a-zA-Z ]{3,30}$')
      ])),
      description: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9a-zA-Z ]{3,50}$')
      ]))
    })
    this.groupService.getAllCodes()
    .subscribe( codes => {
      codes.forEach( line => {
        this.codeList.push( line.payload.doc.data()['code'] )      
      });
    })
  }
  onSubmit( value ) {
    this.loader.presentLoading()
    this.user = this.authService.userDetails()
    let code: any
    do{
      code = this.groupService.generateRandomCode()
    }
    while( this.codeList.includes( code ) )

    if ( !this.codeList.includes( code ) ){
      let navigationExtras: NavigationExtras = {
        queryParams:{
          code
        }
      }
    this.groupService.createGroup( value, code, this.user['uid'] )
      .then( res => {
        this.loader.hideLoading()
        this.navCtrl.navigateForward('/group-code', navigationExtras) 
      })
      .catch( err => {
        this.loader.hideLoading()
      })
    }
  }
}
