import { Component, OnInit } from '@angular/core';
import { LotteryBet, Bet } from '../../classes/bet'
import { UserListClass } from '../../classes/userClassModel'
import { FormGroup, FormBuilder, FormControl, FormArray, Validators} from '@angular/forms'
import { AlertController } from '@ionic/angular'
import { BetsService } from '../../providers/bets.service'
import { ConfigLotteriesService } from '../../providers/config-lotteries.service'
import { MessagesService } from '../../providers/messages.service'
import { DataService } from 'src/app/providers/data-service.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/store/storage.service';
import { UsersService } from 'src/app/providers/users.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-bets',
  templateUrl: './bets.page.html',
  styleUrls: ['./bets.page.scss'],
})
export class BetsPage implements OnInit {

  lotteryBet = new LotteryBet();
  listCombination = [];
  selectItem: object
  usersList = []
  
  form_validations: FormGroup
  
  indexSelected: number = 0
  idBets: Array<string>
  idBetList: string = ''
  
  constructor( private fb: FormBuilder, private betService: BetsService, private lotteryService: ConfigLotteriesService,
    private alertCtrl: AlertController, private messageService: MessagesService, private dataService: DataService,
    private translate: TranslateService, private store: StorageService, private userService: UsersService,
    private router: ActivatedRoute) {
    (<any>window).lotteryBet = this.lotteryBet;
   }

  ngOnInit() {
    this.router.queryParams.subscribe( params =>{
      this.idBets = params.betsList
      this.getConfigLotteries()
    })
    this.form_validations = this.fb.group({
      select: new FormControl('', Validators.compose([
        Validators.required
      ])),
      descriptionBet: new FormControl(this.idBets['data'].description || '', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9 ]+$')
      ])),
      eachLottery: this.fb.array([])
    })
    this.store.get('lastGroupCodeSelected')
    .then( codeGroup => this.getUsers( codeGroup ) )

    this.messageService.getMessages()
    .subscribe( messages => {
      messages.forEach( message => {
        this.lotteryBet.messagesList.push( message.payload.doc.data() )
      });
    })
  }

  getConfigLotteries(){
    this.lotteryService.getConfigLottery()
    .subscribe( res => {
      res.forEach(element => {
        if ( element.payload.doc.exists ) {
          this.lotteryBet.kindOfBets.push( element.payload.doc.data() )
        }
      });
      this.getBets()
    })
  }

async getBets() {
    let storeBets = []
    let carga = []
    let controls = <FormArray> this.form_validations.controls.eachLottery;
    console.log("controls ", < FormArray > this.form_validations.controls.eachLottery)

    if (this.idBets && this.idBets['data']['idBets'].length > 0) {
      for (var i = 0; i < this.idBets['data']['idBets'].length; i++) {
        storeBets.push(await this.betService.getBetsFromBetsList(this.idBets['data']['idBets'][i]))
    }
    console.log("store ", storeBets)
        for (let i = 0; i < storeBets.length; i++) {
            let newBet = Object.assign(new Bet(), storeBets[i]);
            newBet.referenciaDB = storeBets[i].id
            carga.push(newBet)
        }
        if (carga) {
            console.log("carga ", carga)

            controls.clear()
            for (let i = 0; i < carga.length; i++) {
                controls.push(this.fb.group({
                    combination1: this.setCombinationNumber(carga[i].combination1),
                    extranumber: this.setCombinationNumber(carga[i].extras),
                    idType: carga[i].idType,
                    referenciaDB: carga[i].referenciaDB,
                    expanded: false,
                    user: this.setUserEachBet(this.usersList, carga[i]),
                    atLeastOneUserParticipant: new FormControl(false, Validators.requiredTrue),
                }))
            }
            console.log("controls ", controls)
            this.lotteryBet.betLines = controls.value
            this.checkIfExistAlLeatsOneParticipante(this.usersList, carga)
        }
    }else{
      controls.clear()
      this.form_validations.reset()
    }
}

  checkIfExistAlLeatsOneParticipante( usersList, carga ){
    for ( var i = 0; i < carga.length; i ++ ) {
      for ( var j = 0; j < usersList.length; j ++ ) {
        if ( carga[i].participants.includes( usersList[j].uid ) ) {
          let controls = <FormArray>this.form_validations.controls.eachLottery
          if ( controls && controls.length > 0 ){
            controls.controls[i]['controls'].atLeastOneUserParticipant.setValue(true)
          }
        }
      }
    }
  }

  setUserEachBet( userList, carga? ) {
    let user = new FormArray([])
    userList.forEach( line => {
      let newBet = Object.assign( new UserListClass(), line)
      if ( carga && carga.participants.includes( newBet.uid ) ) {
        newBet.participant = true
      }
      user.push( this.fb.group({
        name: new FormControl( newBet._name ),
        nick: new FormControl( newBet.nick ),
        uid: new FormControl( newBet.uid ),
        participant: new FormControl( newBet.participant )
      }))
    });
    return user
  }
  
  setCombinationNumber( numberOfBet ){
    let arr = new FormArray([]);
    numberOfBet.forEach( number => {
      arr.push( new FormControl( number, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(99),
        Validators.pattern('^[0-9]{0,2}$')
      ])))
    });
    return arr;
  }
  
  createBet( newBet ){    

    let controls = <FormArray>this.form_validations.controls.eachLottery;
    controls.push(
      this.fb.group({
      combination1: this.setCombinationNumber( Array( newBet.combinationLength ).fill( null )),
      extranumber: this.setCombinationNumber( Array( newBet.extraNumber ).fill( null ) ),
      idType: newBet.idType,
      referenciaDB: '',
      expanded: false,
      user: this.setUserEachBet( this.usersList ),
      atLeastOneUserParticipant: new FormControl(false, Validators.requiredTrue)
      })
    )    
  }
  Accept( data ) {
    let controls = (<FormArray>this.form_validations.get('eachLottery')).at( this.indexSelected )
    console.log("controls in bet page ", controls.value)
    console.log("controls in bet page ", controls['controls'].user.value)

    let newBet: Bet
    if ( controls.status === "VALID" ){
      newBet = Object.assign( new Bet(), controls.value ) 
      newBet.descriptionBet = this.form_validations.controls.descriptionBet.value     
    }    
    this.betService.setBetToDB( newBet )
    .then( res => {
      newBet.referenciaDB = res.newBet
      controls.get('referenciaDB').setValue(newBet.referenciaDB)
      let id: string = this.idBets ? this.idBets['id'] : this.idBetList
      this.betService.setBetList( id, res.res.id ).then( res => this.idBetList = res.id )
    })
  }
  deleteBet( id ) {
    this.presentAlertConfirm()
    .then( isBetDeleted => {
      if ( isBetDeleted.role === 'accept' ){
        let controls = (<FormArray>this.form_validations.get('eachLottery')).at( id )
        let newBet: Bet
        newBet = Object.assign( new Bet(), controls.value )      
        
        this.betService.removeBet( newBet )
        .then( res => {
          (<FormArray>this.form_validations.get('eachLottery')).removeAt( id )
          console.log(res)
        })
      }      
    })    
  }

  handleTypeOfBetInTemplate( idType ) {
    return this.lotteryBet.kindOfBets.filter( line => line.idType === idType )
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant( 'BETS.HEADER' ),
      message: this.translate.instant( 'BETS.MESSAGE' ),
      buttons: [
        {
          text: this.translate.instant( 'BETS.CANCELBUTTON' ),
          role:'cancel',
          handler: ()=>{}
        },
        {
          text: this.translate.instant( 'BETS.ACCEPTBUTTON' ),
          role: 'accept',
          handler: ( )=> {            
            return true;
          }
        }
      ]
    });
    await alert.present();
    const result = await alert.onDidDismiss();  
    return result
  }

  displayMessageInTemplate( type ) {
     return this.lotteryBet.messagesList.filter( message => Object.keys( message )[0] === type )
  }

  getUsers( codeGroup ) {
    this.userService.getUsers( codeGroup )
        .then( userList => {
          console.log("userList ", userList)
          this.usersList = [];
          userList.forEach( line => {
            let newUser = Object.assign( new UserListClass(), line.data )
            this.usersList.push({
              ...newUser,
              participant: false
            })
          });
        })
        .catch( err => {
          })
  }
  
  expandItem( id ): void{
    let controls = (<FormArray>this.form_validations.get('eachLottery')).at( id )
    controls.value.expanded = !controls.value.expanded
  }

}
