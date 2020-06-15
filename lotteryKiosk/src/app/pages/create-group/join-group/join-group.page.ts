import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { GroupService } from 'src/app/providers/group.service'
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router'
import { UsersService } from 'src/app/providers/users.service';
import * as firebase from 'firebase'

@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.page.html',
  styleUrls: ['./join-group.page.scss'],
})
export class JoinGroupPage implements OnInit {
  validations_form: FormGroup
  listCodes = []
  message: string = ''
  userObserver: any
  user: any

  constructor( private fb: FormBuilder, private groupService: GroupService,
    private navCtrl: NavController, private userService: UsersService ) {
      this.userObserver = this.userService.userWatcher$
     }

  ngOnInit() {
    this.validations_form = this.fb.group({
      code: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(8),
        Validators.pattern('^[0-9a-zA-Z]{7,8}$')
      ]))
    })
    this.userObserver.subscribe( user =>{
      this.user = user
    })
  }
  onSubmit( value ) {
    this.groupService.getAllCodes()
    .subscribe( codes =>{
      codes.forEach( line => {
      this.listCodes.push( line.payload.doc.data()['code'] )
      });
    this.codeExist( value.code )
    })
  }
  codeExist( code ){
    if ( this.user[0].hasOwnProperty('codes') ){
      if ( !this.user[0].codes.includes( code ) ) {
        if ( this.listCodes.includes( code ) ){
         this.setUserField( this.user[0].uid, code )
        }else{
          this.message = `This ${code} does not exist`
        }
      } else{
        this.message = `You already have this ${code} in the group list`
      }
    }else {
      this.setUserField( this.user[0].uid, code )
    }
  }
  setUserField( uid, code ){
    let fields = {
      codes: firebase.firestore.FieldValue.arrayUnion( code )
    }
    this.userService.setUser( uid,fields )
    .then( res =>{
      let navigationExtras: NavigationExtras = {
        queryParams:{
          code
        }
      }
      this.navCtrl.navigateForward('/menu/tabs/users', navigationExtras)
    })
    .catch( err => err )
  }

}
