import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DataService } from 'src/app/providers/data-service.service';

@Component({
  selector: 'app-kind-of-calendar',
  templateUrl: './kind-of-calendar.component.html',
  styleUrls: ['./kind-of-calendar.component.scss'],
})
export class KindOfCalendarComponent implements OnInit {
  events: Array<any> = [
    { id: 0, type: 'day', translated: 'KINDOFCALENDAR.DAY'},
    { id: 1, type: 'week', translated: 'KINDOFCALENDAR.WEEK'},
    { id: 2, type: 'month', translated: 'KINDOFCALENDAR.MONTH'},
    { id: 3, type: 'events', translated: 'KINDOFCALENDAR.EVENTS'}
  ]
  eventSelected: string = ''
  constructor( private popoverCtrl: PopoverController, private dataService: DataService ) { }

  ngOnInit() {
    this.eventSelected = this.dataService.getData('viewCalendar')
  }

  select( typeEvent ){
    this.eventSelected = typeEvent.type
    this.dataService.setData('viewCalendar', this.eventSelected)
    this.popoverCtrl.dismiss( typeEvent )
  }

}
