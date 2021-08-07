import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarPageRoutingModule } from './calendar-routing.module';

import { CalendarPage } from './calendar.page';
import { NgCalendarModule } from 'ionic2-calendar'
import { TranslateModule } from '@ngx-translate/core';
import { KindOfCalendarComponent } from './kind-of-calendar/kind-of-calendar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarPageRoutingModule,
    NgCalendarModule,
    TranslateModule
  ],
  declarations: [CalendarPage, KindOfCalendarComponent]
})
export class CalendarPageModule {}
