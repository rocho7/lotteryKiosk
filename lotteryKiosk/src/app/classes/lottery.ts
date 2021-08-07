import { UserListClass, roleClassModel, balanceClassModel } from './userClassModel'

export class Lottery {
    id: string
    uid: string
    _name: string
    nick: string
    email: string
    role: string
    _UsersList = []
    _RoleList = []
    _BalanceList = []
    roleModel = roleClassModel
    balanceModel = balanceClassModel

    _totalBalance = 0

    get UsersList(){
        return this._UsersList
    }
    set UsersList ( arr ) {
        this._UsersList = [];
        arr.forEach( line => {
            let newUserLine = Object.assign( new UserListClass(), line.data)
            newUserLine.uid = line.id;
            this.UsersList.push( newUserLine );
        })
    }
    get RoleList(){
        return this._RoleList;
    }
    set RoleList( roles ){
        this._RoleList = [];
        roles.forEach( role =>{
            let newRoleLine = Object.assign( new this.roleModel(), role.data);
            newRoleLine.idrole = role.id;
            this.RoleList.push( newRoleLine )
        })
        this.getRoleEachUser()
    }
    get BalanceList(){
        return this._BalanceList
    }
    set BalanceList( balance ) {
        this._BalanceList = []
        balance.forEach( line =>{
            let data = line.data ? line.data : line
            let newBalanceLine = Object.assign( new balanceClassModel, data )
            newBalanceLine.idbalance = data.id;
            this.BalanceList.push( newBalanceLine );
        })
        this.getRoleEachUser()
    }
    get totalBalance(){
        if ( this.UsersList.length > 0 ) return this._totalBalance = this.UsersList.reduce( (sum, { total } ) => sum + total, 0 ) 
    }
    
    getRoleEachUser(){
        if ( this.UsersList.length > 0 ){
            this.UsersList.forEach( userLine => {

                this.RoleList.forEach( roleLine => {
                    if ( roleLine.idrole === userLine.idrole ){
                        userLine.role = roleLine.role;
                    }
                })
            this.getTotalBalance( userLine )
            })
        }
    }
    getTotalBalance( userLine: UserListClass ){
        let totalPersonalBalance = 0;
        userLine.dateAndAmount = []
        this.BalanceList.forEach( balanceLine =>{
            if ( balanceLine.uid === userLine.uid ){
                totalPersonalBalance += balanceLine.amount
                userLine.total = totalPersonalBalance
                userLine.storeDateAndAmountEachPlayer( balanceLine )
            }
        })
    }
}
