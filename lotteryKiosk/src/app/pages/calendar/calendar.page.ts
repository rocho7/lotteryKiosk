import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'

import { Lottery } from '../../classes/user'
import { DataService } from '../../providers/data-service.service'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  eventSource;
  viewTitle;
//   lottery = new Lottery();
  dateUser = []

  isToday:boolean;
  calendar = {
      mode: 'month',
      currentDate: new Date(),
      locale: 'en-GB',
      dateFormatter: {
          formatMonthViewDay: function(date:Date) {
              return date.getDate().toString();
          },
          formatMonthViewDayHeader: function(date:Date) {
              return 'MonMH';
          },
          formatMonthViewTitle: function(date:Date) {
              return 'testMT';
          },
          formatWeekViewDayHeader: function(date:Date) {
              return 'MonWH';
          },
          formatWeekViewTitle: function(date:Date) {
              return 'testWT';
          },
          formatWeekViewHourColumn: function(date:Date) {
              return 'testWH';
          },
          formatDayViewHourColumn: function(date:Date) {
              return 'testDH';
          },
          formatDayViewTitle: function(date:Date) {
              return 'testDT';
          }
      }
  };
 
  constructor(private navController:NavController, private dataService: DataService) {
    
  }
  ngOnInit() {
    console.log("user ", this.dataService.getData('userList'))
    
    if ( this.dataService.getData('userList') ){
      this.dataService.getData('userList').forEach( dateLine => {
        if ( dateLine.dateAndAmount ){
          dateLine.dateAndAmount.forEach( line => {
            this.dateUser.push( line )
          });
        }
      });
     }
    console.log("dateUser ", this.dateUser)

  }

    
    
  

  loadEvents() {
      this.eventSource = this.createRandomEvents();
  }

  onViewTitleChanged(title) {
      this.viewTitle = title;
  }

  onEventSelected(event) {
      console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

  changeMode(mode) {
      this.calendar.mode = mode;
  }

  today() {
      this.calendar.currentDate = new Date();
  }

  onTimeSelected(ev) {
      console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
          (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
  }

  onCurrentDateChanged(event:Date) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      event.setHours(0, 0, 0, 0);
      this.isToday = today.getTime() === event.getTime();
  }

  createRandomEvents() {
      var events = [];
      this.dataService.getData('userList').forEach( userLine => {
        userLine.dateAndAmount.forEach( dateLine => {
          
          var date = new Date( dateLine.date.seconds * 1000)
          console.log("date ", date)
          var startTime;
          var endTime;
          
          // var startMinute = Math.floor(Math.random() * 24 * 60);
          var endMinute =  1;
          startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() );
          endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + endMinute);
          events.push({
              title: userLine.name + ' aportación => ' +dateLine.amount,
              startTime: startTime,
              endTime: endTime,
              allDay: false
          });    
        });
        
      });
      return events;
  }

  onRangeChanged(ev) {
      console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }

  markDisabled = (date:Date) => {
      var current = new Date();
      current.setHours(0, 0, 0);
      return date < current;
  };
}
