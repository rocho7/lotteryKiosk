import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/providers/group.service';
import { AlertController, NavController } from '@ionic/angular';
import { take } from 'rxjs/operators'
import { UsersService } from 'src/app/providers/users.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavigationExtras } from '@angular/router'

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.page.html',
  styleUrls: ['./group-list.page.scss'],
})
export class GroupListPage implements OnInit {

  groupList = []
  userList = []
  userObserver: any
  
  constructor( private groupService: GroupService, private alertCtrl: AlertController, private userService: UsersService, 
    private authService: AuthenticationService, private navCtrl: NavController ) { 
    this.userObserver = this.userService.userWatcher$
    // console.log("current ", this.authService.currentUser)
    // console.log("details ", this.authService.userDetails())

  }


  ngOnInit() {
    this.userObserver
    .subscribe( res => {
      console.log("observable ", res)
      this.userList = []
      this.userList = res
      
    this.getUserGroups()
    })
  }
 

  getUserGroups(){
    this.groupService.getAllGroups()
    .subscribe( groups => {
      this.groupList = []
      
      groups.forEach( group => {
        this.userList.forEach( lineUser => {
          if ( lineUser.hasOwnProperty('codes') ){
            lineUser.codes.forEach( ( codeUser , index ) => {
              if ( codeUser === group.payload.doc.data().code ){
                this.groupList.push( {
                  data: group.payload.doc.data(),
                  id: group.payload.doc.id
                 })
              }
            });
          }
        });  
      });
    })
  }

  deleteGroup( group ) {
    this.userService.userWatcher$.pipe( take( 1 ) )
    .subscribe( m => console.log("observable ", m))
    this.presentAlertConfirm()
    .then( isDeleted => {
      if ( isDeleted.role === 'accpet' ){
        let uid = group.id
        this.groupService.removeGroup( uid )
        .then( res => res)
        .catch( err => err )
      }      
    })
  }

  goToUserList( group ) {
    let navigationExtras: NavigationExtras = {
      queryParams:{
        ...group
      }
    }
    this.navCtrl.navigateForward('/menu/users', navigationExtras)
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Do you really want to delete this group?',
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: ()=>{}
        },
        {
          text: 'Accept',
          role: 'accept',
          handler: ()=> {
            return true
          }
        }
      ]
    })
    await alert.present();
    const result = await alert.onDidDismiss();  
    return result
  }

}
