import { Component } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'aofc-day20181214',
  templateUrl: './day20181214.component.html',
  styleUrls: ['./day20181214.component.css']
})
export class Day20181214Component  {

  sAdventDayData: string;
  sPartOneAnswer: string;
  sPartTwoAnswer: number;
  sAdventDayDataShow: string;

  aReciept: number[]; // actual chain of recipt
  sActualReciept: string;
  nPosElfFirst: number; // position of first elf
  nPosElfSecond: number; // acutal positoon of second elf
  nNextStep: number; // how more will be next step

  constructor() { }

  runPart1() {
    this.sPartOneAnswer = '';
    this.sAdventDayDataShow = '';
    const iRecieptBefore: number = (Number)(this.sAdventDayData);

    // starting rules
    this.initalReciept();

    // this.sAdventDayDataShow =  this.getHtmlOfRecipe();

    while (this.aReciept.length < iRecieptBefore + 10) {
      this.putSuffixToRecipe(); // elf first and second and put sum to end
      this.moveElfs(); // move elfs
      // this.sAdventDayDataShow += this.getHtmlOfRecipe();
    }

    // get finall answer
    this.sPartOneAnswer = (this.aReciept.slice(iRecieptBefore, iRecieptBefore + 10)).join('');
  }

  runPart2() {
    this.sPartTwoAnswer = 0;
    const sWanted = this.sAdventDayData.trim();

    // starting rules
    this.initalReciept();

    this.sActualReciept = this.aReciept.join('');
    // this.sAdventDayDataShow =  this.getHtmlOfRecipe();

    while (this.sActualReciept.indexOf(sWanted) === -1) {
      this.putSuffixToRecipe(); // elf first and second and put sum to end
      this.moveElfs(); // move elfs
      this.sActualReciept = this.aReciept.join(''); // convert to string
      console.log('array length: ' + this.aReciept.length);
      // this.sAdventDayDataShow += this.getHtmlOfRecipe();
    }

    this.sPartTwoAnswer = this.sActualReciept.indexOf(sWanted);
  }

  private initalReciept() {
    // starting rules
    this.aReciept = [3, 7];
    this.nPosElfFirst = 0;
    this.nPosElfSecond = 1;
  }

  private putSuffixToRecipe() {
    const nSum = this.aReciept[this.nPosElfFirst] + this.aReciept[this.nPosElfSecond];
    if (nSum > 9) {
      // if we have two char, for exampe 10 -> 1, 0 or 18 -> 1, 8
      this.aReciept.push(1); // put first char in this puzle aways will be 1
      this.aReciept.push(nSum % 10); // put second char
    } else {
      // only one char
      this.aReciept.push(nSum);
    }
  }

  private moveElfs() {

    this.nPosElfFirst += this.aReciept[this.nPosElfFirst] + 1;
    this.nPosElfFirst %= this.aReciept.length;

    this.nPosElfSecond += (this.aReciept[this.nPosElfSecond] + 1);
    this.nPosElfSecond %=  this.aReciept.length;

  }

  private getHtmlOfRecipe() {
    let sHtml = '<br />';
    for (let i = 0; i < this.aReciept.length; i++) {
      if (i === this.nPosElfFirst) {
        sHtml += ' (';
      } else if (i === this.nPosElfSecond) {
        sHtml += ' [';
      } else {
        sHtml += '  ';
      }
      sHtml += this.aReciept[i];
    }
    return sHtml;
  }

}
