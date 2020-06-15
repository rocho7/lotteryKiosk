import { Lottery } from 'src/app/classes/lottery'
export class UserListClass {
    id: string
    uid: string
    _name: string
    password: string
    _nick: string
    _email: string
    _role: string
    _idrole: string = "ROLE_PL"
    _amount: number = 0
    _total: number = 0
    _date: string
    registerDate: Date
    dateAndAmount = []
    acceptedProtectionLaw: boolean = false
    language: string
    
    get name(){
        return this._name
    }
    set name ( value ) {
        this._name = value;
    }
    get email(){
        return this._email
    }
    set email ( value ) {
        this._email = value;
    }
    get idrole(){
        return this._idrole
    }
    set idrole ( value ) {
        this._idrole = value;
    }
    get total(){
        return this._total
    }
    set total ( value ) {
        this._total = value;
    }
    getObjectUser(){
        let obj = {}
            if( this.email ) obj['email'] = this.email
            if( this.idrole ) obj['idrole'] = this.idrole
        return obj
    }
    get amount(){
        return this._amount
    }
    set amount ( value ) {
        this._amount = value;
        this.total += this._amount
    }
    get date(){
        return this._date
    }
    set date ( value ) {
        this._date = value;
    }
    storeDateAndAmountEachPlayer( balanceLine ){
        let user = {
            date:  balanceLine.date,
            amount: balanceLine.amount
        }
        this.dateAndAmount.push( user )
    }

}
export function roleClassModel() {
    this.idrole = "";
    this.role = "";
}
export function balanceClassModel() {
    this.codes = "";
    this.uid = "";
    this.idbalance = "";
    this.amount = null;
    this.date = {seconds: null};
}