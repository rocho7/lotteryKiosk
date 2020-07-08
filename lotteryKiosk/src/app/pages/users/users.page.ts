import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { UsersService } from '../../providers/users.service'
import { Lottery } from '../../classes/lottery'
import { UserListClass, balanceClassModel } from '../../classes/userClassModel'
import { ModalController, ToastController, AlertController, NavController } from '@ionic/angular'
import { ModalPersonalBalancePage } from './modal-personal-balance/modal-personal-balance.page'
import { AuthenticationService } from '../../services/authentication.service'
import { DataService } from '../../providers/data-service.service'
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/store/storage.service';
import { LoadingService } from 'src/app/services/loading.service';
import { TranslateService } from '@ngx-translate/core';
import anime from 'animejs/lib/anime.es';
import { read } from 'fs';
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  
  lottery = new Lottery();
  list: any
  roleList = [];
  codeGroup:string = ''
  userObserver: any
  currentUser = []
  @ViewChild('headerUser', { read: ElementRef }) header: ElementRef
  @ViewChild('searchBar', { read: ElementRef }) searchBar : ElementRef
  @ViewChild('stickyFooter', { read: ElementRef }) stickyFooter: ElementRef
  @ViewChild('totalBox', { read: ElementRef }) totalBox: ElementRef
  @ViewChild('textBalance', { read: ElementRef }) textBalance: ElementRef

  userFiltered: string
  scrollLastY: number = 0

  constructor( private userService: UsersService, public modalCtrl: ModalController, private toastCtrl: ToastController,
    private authService: AuthenticationService, private dataService: DataService, private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController, private navCtrl: NavController, private storage: StorageService,
    private loader: LoadingService, private translate: TranslateService, private elRef: ElementRef, private renderer: Renderer2 ) {
    (<any>window).lottery = this.lottery;
      this.userObserver = this.userService.userWatcher$
      this.userObserver.subscribe( user => {
        this.currentUser = user[0]
      })
   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe( group =>{

      this.codeGroup = group.code || this.dataService.getData('codeGroup')
      if ( this.codeGroup ) {
        
        this.storage.set('lastGroupCodeSelected', this.codeGroup)
        this.dataService.setData('codeGroup', this.codeGroup)
        this.getUsers()
      }else{
        let message = 'USERS.NOPLAYERS'
        let type = 'warning'
        this.showToast( message, type )
        this.navCtrl.navigateRoot('/menu/tabs/group-list')
      }
    })
  }
  getUsers() {
    this.loader.presentLoading()
    this.userService.getUsers( this.codeGroup )
        .then( userList => {
          this.lottery.UsersList = [];
          this.lottery.UsersList = userList
          this.setUsersList()
        })
        .catch( err => {
          this.loader.hideLoading()
          })
  }
  setUsersList(){
    this.userService.getRoles().subscribe( data => {
      this.roleList = [];
      data.forEach( ( role: any ) =>{
        this.roleList.push({
          id: role.payload.doc.id,
          data: role.payload.doc.data()
        });
        this.lottery.RoleList = []
        this.lottery.RoleList = this.roleList
      } )
    })

    this.userService.getBalance( this.codeGroup )
    .then( balance => {
      this.lottery.BalanceList = []
      this.lottery.BalanceList = balance;
      this.dataService.setData('userList', this.lottery.UsersList)
      this.loader.hideLoading()
    })
  }
  animeOnUserSelected( index: number, userListClassArray: Array<string> ){
    this.renderer.setStyle(this.searchBar.nativeElement, 'display', 'none') 
    const headerHeight = this.header.nativeElement.offsetHeight
    const userItemY = document.querySelector(`.item-user${index}`).getBoundingClientRect().y

    anime({
      targets: userListClassArray,
      duration: 300,
      opacity: 0,
      easing: 'linear'
    })
   
    const itemUser = anime.timeline({
      targets: `.content .item-user${index}`,
      duration: 400,
      easing: 'easeOutExpo',
      zIndex: [{value: 2, duration: 500, round: true}]
    });
    itemUser.add({
      translateY: - userItemY - (- headerHeight),
      position: 'absolute',
      easing: 'spring',
    })
    itemUser.add({
      border: '3px solid yellow',
      easing: 'easeInOutQuad'
    }, '-=200');
    
  }
  animeOffUserSelected( index: number, userListClassArray: Array<string> ){
    anime({
      targets: userListClassArray,
      duration: 300,
      opacity: 1,
      easing: 'linear'
    })
    const itemUserOff = anime.timeline({
    targets: `.content .item-user${index}`,
      translateY: 0,
      easing: 'easeOutExpo'
    });
    itemUserOff.add({
      border: 0,
      easing: 'easeInOutQuad'
    }, '-=200');
  this.renderer.setStyle(this.searchBar.nativeElement, 'display', 'block') 
  }

  async openPersonalBalanceModel( user: UserListClass, index: number ) {
    const userListClassArray = this.lottery.UsersList.map( ( userLine, userIndex ) => {
      if( userIndex !== index ){
        return `.content .item-user${userIndex}`
      }else{
        return 'ghost-element'
      }
    })
    this.animeOnUserSelected( index, userListClassArray )
    user._amount = 0
    const modal = await this.modalCtrl.create({
      component: ModalPersonalBalancePage,
      cssClass:'positionUserModal',
      showBackdrop: false,
      backdropDismiss: false,
      componentProps: {
        user: user
      }
    });
    modal.onDidDismiss().then((newBalance) => {
      if (newBalance.data !== null) {
        this.setBalance( newBalance.data )
      }
      this.animeOffUserSelected( index, userListClassArray )

    });
    return await modal.present();
  }
  setBalance( newBalance: UserListClass ){
    this.loader.presentLoading()
    let newUser = Object.assign( new UserListClass(), newBalance )
    let balance = new balanceClassModel();
    balance.amount = newBalance.amount
    balance.codes = this.codeGroup
    balance.uid = newBalance.uid
    balance.date.seconds = Math.floor(<any>new Date(newBalance.date) / 1000)
    this.lottery.BalanceList.push( balance );
    this.lottery.BalanceList = this.lottery.BalanceList

    let data = {
      amount: newUser.amount,
      date: new Date( newUser.date ),
      uid: newUser.uid,
      codes: this.codeGroup
    }

    this.userService.addBalance( data )
     .then( res => {
       if ( res.id ) {
         this.loader.hideLoading()
         let message ="USERS.ADDMONEY"
         let color = 'success'
        this.showToast( message, color );
       }
    })
  }

  async deleteUser( user: UserListClass ){
    
    let isDeleted = null
    if ( this.currentUser['uid'] === user.uid ) {
          isDeleted = await this.deleteUserAndConfirm( user )

          if ( isDeleted ){
            this.storage.remove('userInfo')
            this.storage.remove('lastGroupCodeSelected')
            this.navCtrl.navigateRoot('/login')
          }
    }else {
      if ( this.currentUser['idrole'] === 'ROLE_AD' ){
        isDeleted = await this.deleteUserAndConfirm( user)
        if ( isDeleted ) this.getUsers()
      }
      let message = "USERS.CANNOTDELETEUSER"
      let color = 'warning'
      this.showToast( message, color );

    }    
  }
  async deleteUserAndConfirm(user : UserListClass) {
      let isUserDeleted = await this.presentAlertConfirm()

      if (isUserDeleted.role === 'remove') {
          let authUser = await this.deleteAuthUser(user)
          return authUser
      }
  }

  async deleteAuthUser(user : UserListClass) {
      let removeUser = await this.authService.removeUser(user.uid)
      return removeUser
  }


  async presentAlertConfirm(){
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('USERS.CONFIRM'),
      message: this.translate.instant('USERS.MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('USERS.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('USERS.REMOVE'),
          role: 'remove'
        }
      ]
    });
    await alert.present()
    let result = await alert.onDidDismiss()
    return result
  }

  async showToast( message: string, color ){
    const toast = await this.toastCtrl.create({
      message: this.translate.instant( message ),
      color: color,
      duration: 2000
    });
    toast.present()
  }

  searchUser( user: string ) {
    this.userFiltered = user
  }
  
   logScrolling( ev ){    
    if ( ev.detail.scrollTop > this.scrollLastY ){
      this.renderer.removeClass(this.stickyFooter.nativeElement, 'sticky-footer')
      this.renderer.setStyle(this.totalBox.nativeElement, 'width', '100%')

      this.renderer.addClass(this.stickyFooter.nativeElement, 'positionated-footer-scroll')        
      this.renderer.addClass(this.totalBox.nativeElement, 'positionated-total-box')
      this.renderer.setStyle(this.textBalance.nativeElement, 'display', 'inline')
     }else{
      this.renderer.removeClass(this.stickyFooter.nativeElement, 'positionated-footer-scroll')
      this.renderer.removeClass(this.totalBox.nativeElement, 'positionated-total-box')        

      this.renderer.addClass(this.stickyFooter.nativeElement, 'sticky-footer')
      this.renderer.setStyle(this.totalBox.nativeElement, 'width', '18%')
      this.renderer.setStyle(this.textBalance.nativeElement, 'display', 'none')
    }
    this.scrollLastY = ev.detail.scrollTop
  }
}
