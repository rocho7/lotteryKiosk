import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  data = []

  getData( id ) {
    return this.data[id]
  }

  setData( id, value ) {
    console.log("setData ", value)
    this.data[id] = value
  }

}
