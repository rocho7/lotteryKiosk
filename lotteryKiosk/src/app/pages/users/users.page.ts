import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../providers/users.service'
import { User } from '../../classes/user'
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  
  user = new User();
  list = []
  roleList = [];
  constructor( private userService: UsersService ) {
  (<any>window).user = this.user;

    console.log("pages Users")
   }

  ngOnInit() {
    this.userService.getUsers().subscribe( data => {
      
    this.list = []
      data.forEach( ( line : any ) => {
        this.list.push({
          id: line.payload.doc.id,
          data: line.payload.doc.data()
        });
      })
      this.user.UsersList = [];
      this.user.UsersList = this.list;
    })

    this.userService.getRoles().subscribe( data => {
      this.roleList = [];
      data.forEach( ( role: any ) =>{
        this.roleList.push({
          id: role.payload.doc.id,
          data: role.payload.doc.data()
        });
        this.user.RoleList = []
        this.user.RoleList = this.roleList
        console.log("role ", role.payload.doc.data())
      } )
    })
  }

}
