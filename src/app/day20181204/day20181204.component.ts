import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aofc-day20181204',
  templateUrl: './day20181204.component.html',
  styleUrls: ['./day20181204.component.css']
})
export class Day20181204Component implements OnInit {

  aLines: string[];
  sPartOneAnswer: number;
  sPartTwoAnswer: number;
  inGuardShift: IHashNumberStrings = {};
  inDaysStatus: IHashStringToIHashNumberStrings = {};
  aGurads: Array<Guard> = []; // main table of all guards

  constructor() {



  }


  public runPart1(sTextareaAdventData: string) {
    this.sPartOneAnswer = 0;

    this.importData(sTextareaAdventData);

    let iSleepTime = -1;
    let oGuardSleepyhead: Guard;
    // check who sleep more
    for (const key in this.aGurads) {
      if (this.aGurads.hasOwnProperty(key)) {
        const oGuard = this.aGurads[key];
        const iTmpSleepTime = oGuard.getMinutsSleep();
        if (iTmpSleepTime > iSleepTime) {
          iSleepTime = iTmpSleepTime;
          oGuardSleepyhead = oGuard;
        }
      }
    }


    this.sPartOneAnswer = oGuardSleepyhead.getId() * oGuardSleepyhead.getMostMinuteAsleep();

  }

  public runPart2(sTextareaAdventData: string) {
    this.sPartTwoAnswer = 0;

    this.importData(sTextareaAdventData);

    let iMaxUsedMinute = -1;
    let oGuardSleepyhead: Guard;
    // check who sleep more in one minute
    for (const key in this.aGurads) {
      if (this.aGurads.hasOwnProperty(key)) {
        const oGuard = this.aGurads[key];
        const iTmpSleepTime = oGuard.getMaxOfMinuteAsleep();
        if (iTmpSleepTime > iMaxUsedMinute) {
          iMaxUsedMinute = iTmpSleepTime;
          oGuardSleepyhead = oGuard;
        }
      }
    }


    this.sPartTwoAnswer = oGuardSleepyhead.getId() * oGuardSleepyhead.getMostMinuteAsleep();

  }

  ngOnInit() {
  }

  private importData(sTextareaAdventData: string) {
    this.aLines = sTextareaAdventData.split('\n');

    let tmpLineData: LineData;
    for (let index = 0; index < this.aLines.length; index++) {
      if (this.aLines[index].length) {
        tmpLineData = new LineData(this.aLines[index]);
        if (tmpLineData.getType() === 'Guard') {
          // action for Guard shift log only
          this.putToHash(this.inGuardShift, tmpLineData.getGuardId(), tmpLineData.getMontDay());
          this.aGurads[tmpLineData.getGuardId()] = new Guard(tmpLineData.getGuardId());
        } else {
          this.putToDaysHash(this.inDaysStatus, tmpLineData.getMontDay(), tmpLineData.getType(), tmpLineData.getMinuts());
        }
      }

    }

    // fill Guards of data
    for (let iGuardId = 0; iGuardId < this.aGurads.length; iGuardId++) {
      const tmpGuard = this.aGurads[iGuardId];
      const tmpGuardShift = this.inGuardShift[iGuardId];

      // tslint:disable-next-line:forin
      for (const iterator in tmpGuardShift) { // for each day when Guard works
        const kMonthDay = tmpGuardShift[iterator];
        tmpGuard.addDay(kMonthDay, this.inDaysStatus[kMonthDay]);
      }
    }

  }

  private putToHash(inHash: IHashNumberStrings, key: number, value: string) {
    // if not exist yet
    if (typeof inHash[key] === 'undefined') {
      inHash[key] = [];
    }
    inHash[key].push(value);
  }

  private putToDaysHash(inHash: IHashStringToIHashNumberStrings, key: string, type: string, value: number) {
    // if not exist yet
    if (typeof inHash[key] === 'undefined') {
      // create empty
      let tmpInMinutsStatus: IHashNumberStrings;
      tmpInMinutsStatus = {};

      inHash[key] = tmpInMinutsStatus;
    }

    let inMinutsStatus: IHashNumberStrings;
    inMinutsStatus = inHash[key]; // get
    this.putToHash(inMinutsStatus, value, type); // and set
  }

}

class LineData {

  private sType = '';
  private iGuardId = -1;
  private dDate = new Date();



  constructor(private sText: string) {
    // const aTmp = this.sText.split(' ');

    this.dDate = new Date(sText.substring(1, 17) + '+00:00');
    this.sType = sText.substring(19, 24); // types was: Guard (begins shift), falls (asleep), wakes (up)
    if (this.sType === 'Guard') {
      const aTmp = this.sText.split(' ');
      this.iGuardId = (Number)(aTmp[3].substring(1));

      // if guard go faster to night shift, need is correct date
      if (this.dDate.toISOString().substring(11, 13) === '23') {
        this.dDate.setDate(this.dDate.getDate() + 1);
      }

    }
  }

  public getType() {
    return this.sType;
  }

  public getGuardId() {
    return this.iGuardId;
  }

  public getMontDay() {
    return this.dDate.toISOString().substring(5, 10);
  }

  public getMinuts(): number {
    return (Number)(this.dDate.toISOString().substring(14, 16));
  }

  public show() {
    return this.sText;
  }

}

class Guard {

  inGuardsStatus: IHashNumberStrings[];
  aMinutsSleep: number[]; // mark witch minuts they sleep
  iSleepTime: number;

  constructor(private iId) {
    this.inGuardsStatus = [];
    this.aMinutsSleep = [];
    this.iSleepTime = 0;
  }

  public getId() {
    return this.iId;
  }

  public addDay(kMonthDay: string, inDayStatus: IHashNumberStrings) {
    this.inGuardsStatus[kMonthDay] = inDayStatus;
  }

  public getMaxOfMinuteAsleep() {
    // to make sure that we work on calcuated date
    this.checkCalculate();

    return (Number)(Math.max.apply(null, this.aMinutsSleep));
  }

  public getMostMinuteAsleep() {
    const max = this.getMaxOfMinuteAsleep();
    return this.aMinutsSleep.indexOf(max);
  }


  public getMinutsSleep() {
    // to make sure that we work on calcuated date
    this.checkCalculate();

    return this.iSleepTime;

  }

  public checkCalculate() {
    // if calucate isn't ready
    if (this.aMinutsSleep.length < 1) {
      this.calculateSleep();
    }
  }

  public calculateSleep() {

    this.aMinutsSleep = new Array(60).fill(0);
    this.iSleepTime = 0;

    let iMinutsFrom = -1;
    let iMinutsTo = -1;
    for (const kMonthDay in this.inGuardsStatus) {
      if (this.inGuardsStatus.hasOwnProperty(kMonthDay)) {
        // each Guard day
        const inDay = this.inGuardsStatus[kMonthDay];
        for (const kMinuts in inDay) {
          if (inDay.hasOwnProperty(kMinuts)) {
            // each Guard change of status
            if (iMinutsFrom < 0) {
              iMinutsFrom = (Number)(kMinuts);
            } else {
              iMinutsTo = (Number)(kMinuts);
              this.iSleepTime += iMinutsTo - iMinutsFrom;

              // mark minuts table
              for (let i = iMinutsFrom; i < iMinutsTo; i++) {
                this.aMinutsSleep[i] += 1;
              }

              iMinutsFrom = -1;
            }

          }
        }
      }
    }

    return this.iSleepTime;
  }



}

export interface IHashNumberStrings {
  [details: number]: string[];
}

export interface IHashStringToIHashNumberStrings {
  [details: string]: IHashNumberStrings;
}


