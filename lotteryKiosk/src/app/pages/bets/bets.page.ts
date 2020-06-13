import { Component, OnInit } from '@angular/core';
import { Lottery, Bet } from '../../classes/bet'
import { FormGroup, FormBuilder, FormControl, FormArray, Validators} from '@angular/forms'
import { AlertController } from '@ionic/angular'
import { BetsService } from '../../providers/bets.service'
import { ConfigLotteriesService } from '../../providers/config-lotteries.service'
import { MessagesService } from '../../providers/messages.service'
import { DataService } from 'src/app/providers/data-service.service';
@Component({
  selector: 'app-bets',
  templateUrl: './bets.page.html',
  styleUrls: ['./bets.page.scss'],
})
export class BetsPage implements OnInit {

  lottery = new Lottery();
  listCombination = [];
  selectItem: object
  
  form_validations: FormGroup
  
  indexSelected: number = 0

  constructor( private fb: FormBuilder, private betService: BetsService, private lotteryService: ConfigLotteriesService,
    private alertCtrl: AlertController, private messageService: MessagesService, private dataService: DataService) {
    (<any>window).lottery = this.lottery;
   }

  ngOnInit() {
    this.form_validations = this.fb.group({
      select: new FormControl('', Validators.compose([
        Validators.required
      ])),
      eachLottery: this.fb.array([])
    })
    this.messageService.getMessages()
    .subscribe( messages => {
      messages.forEach( message => {
        this.lottery.messagesList.push( message.payload.doc.data() )
      });
    })
    this.lotteryService.getConfigLottery()
    .subscribe( res => {
      res.forEach(element => {
        if ( element.payload.doc.exists ) {
          this.lottery.kindOfBets.push( element.payload.doc.data() )
        }
      });
      this.getBets()
    })
  }

  getBets(){
    this.betService.getBetFromDB()
    .then( res => {
      let carga = []
      console.log("controls ", <FormArray>this.form_validations.controls.eachLottery)

      if ( res.length > 0 ){
        for( let i = 0; i < res.length; i ++ ){
          let newBet = Object.assign( new Bet(), res[i] );
          newBet.referenciaDB = res[i].id
          carga.push( newBet )
        }
        this.lottery.betLines = carga
        if ( carga ) {
          let controls = <FormArray>this.form_validations.controls.eachLottery;
          controls.clear()

          for ( let i = 0; i < carga.length; i ++ ){
            controls.push( this.fb.group({
              combination1: this.setCombinationNumber( carga[i].combination1 ),
              extranumber: this.setCombinationNumber( carga[i].extras ),
              idType: carga[i].idType,
              ref: carga[i].referenciaDB
            }))
          }
        }
      }
    })
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
      idType: newBet.idType
      })
    )    
  }
  Accept( data ) {
    let controls = (<FormArray>this.form_validations.get('eachLottery')).at( this.indexSelected )
    let newBet: Bet
    if ( controls.status === "VALID" ){
      newBet = Object.assign( new Bet(), controls.value )      
    }
    
    this.betService.setBetToDB( newBet )
    .then( res => console.log("res bet page ", res))
  }
  deleteBet( id ) {
    if ( this.presentAlertConfirm() ){
      let controls = (<FormArray>this.form_validations.get('eachLottery')).at( id )
      let newBet: Bet
      if ( controls.status === "VALID" ){
        newBet = Object.assign( new Bet(), controls.value )      
      }
      this.betService.removeBet( newBet )
      .then( res => console.log(res))  
    }
  }

  handleTypeOfBetInTemplate( idType ) {
    return this.lottery.kindOfBets.filter( line => line.idType === idType )
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Do you really want to delete this bet?',
      buttons: [
        {
          text: 'Cancel',
          role:'cancel',
          handler: ( blah )=> console.log("blah ", blah)
        },
        {
          text: 'Accept',
          handler: ( blah )=> {
            console.log("blah ", blah)
            return true;
          }
        }
      ]
    });
    await alert.present()
  }

  displayMessageInTemplate( type ) {
     return this.lottery.messagesList.filter( message => Object.keys( message )[0] === type )
  }

}
