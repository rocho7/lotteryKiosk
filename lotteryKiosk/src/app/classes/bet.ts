import { isArray } from 'util'

export class Lottery {
    kindOfBets = []
   messagesList: any = []

   type : string
   idType : number
   combinationLength : number
   date : Date
   extraNumber : number
   colorStyle : string
   description1 : string

     
      listCombination = {
         combinationCell : []
      }
      _betLines: any[] = []
      _combinationCell: any
      get betLines(){
         return this._betLines;
      }
      set betLines( arr ){
         this._betLines = [];
         arr.forEach( line => {
            let newLine = Object.assign( new Bet(), line )
            this.betLines.push( newLine )
         });
      }
}
export class Bet{
   codes:string
   referenciaDB: string
   idType: number
   _combination1: any
   combination2:string
   description1: string
   description2: string
   date: string
   extranumber: any
   reintegro1: number
   reintegro2: number
   reintegro3: number
   horse: number
   _type: string
   start: number

   get type() {
      return this._type;
   }
   set type( value ) {
      this._type = value;
   }
   get combination1(){
      return this._combination1;
   }
   set combination1( value ){
      if ( isArray( value ) ){
         this._combination1 = value;
      }else{
         throw `${value} is not an array`
      }
   }
}
