import { userClassModel, roleClassModel } from './userClassModel'
export class User {
    id: string
    _name: string
    nick: string
    email: string
    role: string
    _UsersList = []
    _RoleList = []
    userModel = userClassModel
    roleModel = roleClassModel

    get UsersList(){
        return this._UsersList
    }
    set UsersList ( arr ) {
        this._UsersList = [];
        console.log("this._UsersList length ", this._UsersList.length)
        arr.forEach( line => {
            let newUserLine = Object.assign( new this.userModel(), line.data)
            newUserLine.id = line.id;
            // let newUserLine = Object.assign( this, line.data)
            this.UsersList.push( newUserLine );
        console.log("newUserLIne ", newUserLine)
        })
        // this._UsersList = arr;
    }
    get RoleList(){
        return this._RoleList;
    }
    set RoleList( roles ){
        this._RoleList = [];
        roles.forEach( role =>{
            let newRoleLine = Object.assign( new this.roleModel(), role.data);
            this.RoleList.push( newRoleLine )
        })
        this.getRoleEachUser()
    }
    get name(){
        return this._name
    }
    set name ( value ) {
        console.log("name ", value)
        this._name = value;
    }
    getRoleEachUser(){
        if ( this.UsersList.length > 0 ){
            this.UsersList.forEach( userLine => {
                this.RoleList.forEach( roleLine => {
                    if ( roleLine.id.includes( userLine.id ) ){
                        userLine.role = roleLine.role;
                    }
                })
            })
        }
    }
}
