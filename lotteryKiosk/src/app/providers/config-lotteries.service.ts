import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { AngularFirestore } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class ConfigLotteriesService {
  configLotteries: Observable<any[]>

  constructor( private fb: AngularFirestore) { }
  
  getConfigLottery(){
    return this.configLotteries = this.fb.collection('configLotteries').snapshotChanges()
  }
}
