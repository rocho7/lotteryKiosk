// export function userClassModel() {
//     this.id = "";
//     this.name = "";
//     this.nick = "";
//     this.email = "";
//     this.idrole = "ROLE_PL";//PLAYER ROLE
//     this.role = "";
//     this.amount = null;
// }
export class UserListClass {
    id: string
    uid: string
    _name: string
    password: string
    _nick: string
    _email: string
    _role: string
    _idrole: string = "ROLE_PL"
    amount: number = 0
    _total: number = 0
    _date: string
    registerDate: Date
    
    get name(){
        return this._name
    }
    set name ( value ) {
        console.log("name ", value)
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
}
export function roleClassModel() {
    this.idrole = "";
    this.role = "";
}
export function balanceClassModel() {
    this.idbalance = "";
    this.amount = null;
}