import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { DataService } from './data-service.service';
import * as firebase from 'firebase'
@Injectable({
  providedIn: 'root'
})
export class BetsService {

  bet: Observable<any[]>
  betListCollection: string = 'betsList'


  constructor( private fb: AngularFirestore, private dataService: DataService ) { }

  setBetToDB( newBet ){
    let dataToSend = {
      combination1: newBet.combination1,
      extras: newBet.extranumber,
      idType: newBet.idType,
      codes: this.dataService.getData('codeGroup'),
      participants: newBet.user.filter( user => user.participant ).map( line => line.uid )
    }
    console.log("dataToSend ", dataToSend)
    if ( newBet.referenciaDB ){
      return this.fb.collection('bets').doc( newBet.referenciaDB )
      .set( dataToSend, { merge: true } )
      .then( res => {
        console.log( "res ", res )
        return { newBet: newBet.referenciaDB, res: res } 
      })
      .catch( err => err )
    }else{
      dataToSend['date'] = new Date()
      return this.fb.collection('bets')
      .add( dataToSend )
      .then( res => {
        console.log( "res ", res )
        return { newBet: newBet.referenciaDB, res: res } 
      })
      .catch( err => err )
    }
  }
  removeBet( bet ) {
    return this.fb.collection('bets').doc( bet.referenciaDB ).delete()
    .then( res => res )
    .catch( error => error )
  }
  getBetFromDB(){
    return new Promise<any>((resolve, reject) =>{
      firebase.firestore().collection('bets')
      .where('codes', '==', this.dataService.getData('codeGroup'))
      .get()
      .then( snapShot =>{
        let bets = []
        snapShot.forEach( betLine => {
          bets.push({
            id: betLine.id,
            ...betLine.data()
          })
          console.log("betS ", bets)
        });
        resolve( bets )
      })

    })
  }
  setBetList( idBetsList: string, idBets: string, name: string ){
    let dataToSend = {
      code: this.dataService.getData('codeGroup'),
      dateCreation: new Date(),
      comments: '',
      name: name,
      idBets: null
     }
     let arrayBets = []
    if ( !idBetsList ){
      arrayBets.push( idBets )
      dataToSend['idBets'] = arrayBets
      return this.fb.collection( this.betListCollection )
      .add( dataToSend ).then( res => res )
      .catch( err => err )
    }else{
      dataToSend['idBets'] = firebase.firestore.FieldValue.arrayUnion( idBets ) 
      return this.fb.collection( this.betListCollection ).doc(  idBetsList  )
      .update( dataToSend )
      .then( res => {
        console.log("set betlist ", res)
        return res['id'] = idBetsList
      })
      .catch( err => err )
    }
    
  }
  getBetsList(){
    return this.fb.collection( this.betListCollection ).snapshotChanges()
  }
  removeBetsList( id ) {
    return this.fb.collection( this.betListCollection ).doc( id ).delete()
    .then( res => res )
    .catch( err => err )
  }
  async getBetsFromBetsList( idDocument ){
    return await firebase.firestore().collection('bets').doc( idDocument ).get()
    .then( res =>  res.data() )
  }
}
