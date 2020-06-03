import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupLotteryPage } from './group-lottery.page';

describe('GroupLotteryPage', () => {
  let component: GroupLotteryPage;
  let fixture: ComponentFixture<GroupLotteryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupLotteryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupLotteryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
