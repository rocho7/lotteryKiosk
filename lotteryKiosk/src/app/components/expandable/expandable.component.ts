import { Component, Input, OnInit  } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms'

@Component({
  selector: 'app-expandable',
  templateUrl: './expandable.component.html',
  styleUrls: ['./expandable.component.scss'],
})
export class ExpandableComponent implements OnInit {
  @Input("expanded") expanded: boolean = false
  @Input() user: any
  checkParent: boolean = false
  validations_form: FormGroup
  checkBoxGroup: FormArray
  hiddenControl: FormControl

  constructor( private fb: FormBuilder ) { }

  ngOnInit(){
    console.log( "this.user expandable ", this.user)
    this.checkBoxGroup = new FormArray( 
      this.user.value.user.map( item => new FormGroup({
        uid: new FormControl( item.uid ),
        name: new FormControl( item.name ),
        participant: new FormControl( item.participant )
    })));

    this.handleCheckBox()  

    this.validations_form = new FormGroup({
      users: this.checkBoxGroup,
      selectedUser: this.hiddenControl
    })
    console.log("this.user ", this.user)
  }
 

  handleCheckBox(){
    this.hiddenControl = new FormControl( this.getUidChecked( this.checkBoxGroup.value ), Validators.required )
    this.checkBoxGroup.valueChanges.subscribe( v => {
      this.hiddenControl.setValue( this.getUidChecked( v ) )      
      this.getUidChecked( v )
    })
  }
  handleCheckBoxItem( index ){
    this.user.controls['user'].value[index].participant = !this.user.controls['user'].value[index].participant
    let isParticipant = this.getUidChecked( this.user.controls['user'].value ) ? true : false;

    this.user.controls.atLeastOneUserParticipant.setValue( isParticipant )
    this.user.controls.expanded.setValue( true )
  }
  getUidChecked( checkBoxGroup ){
    let selected = checkBoxGroup.filter( item => item.participant ).map( item => item )
    return selected.length ? selected : null
  }

  checkBoxAll( ev ){
    this.checkParent = !this.checkParent
    let users = <FormArray>this.validations_form.get('users')
    for( let i = 0; i < users.controls.length; i ++ ) {
      users.controls[i]['controls'].participant.setValue(  !ev.target.checked )
      this.user.controls['user'].value[i].participant =  !ev.target.checked
    }
    let isParticipant = this.getUidChecked( this.user.controls['user'].value ) ? true : false;
    if ( isParticipant ){
      this.user.controls.atLeastOneUserParticipant.setValue( isParticipant )
    }else{
      this.user.controls.atLeastOneUserParticipant.setValue( false )
    }
  }
}
