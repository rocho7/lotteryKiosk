import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss'],
})
export class FiltroComponent implements OnInit {

  @Output() dataFiltered = new EventEmitter<string>()

  constructor() { }

  ngOnInit() {}
  searchData( ev ) {
    this.dataFiltered.emit( ev.target.value )
  }

}
