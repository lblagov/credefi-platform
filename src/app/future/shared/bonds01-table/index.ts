import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bonds01-table',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule],
  standalone: true
})
export class Bonds01TableComponent {

  setBackground1: boolean = true;
  setBackground2: boolean = true;
  setBackground3: boolean = true;
  setBackground4: boolean = true;
  setBackground5: boolean = true;
  setBackground6: boolean = true;
  setBackground7: boolean = true;
  setBackground8: boolean = true;
  setBackground9: boolean = true;
  setBackground10: boolean = true;

  changeBackground1() {
    if (this.setBackground1) {
      document.querySelector('#bonds-id1').classList.add('set-background-white');
      this.setBackground1 = false;
    }
    else {
      document.querySelector('#bonds-id1').classList.remove('set-background-white');
      this.setBackground1 = true;
    }

  }

  changeBackground2() {
    if (this.setBackground2) {
      document.querySelector('#bonds-id2').classList.add('set-background-white');
      this.setBackground2 = false;
    }
    else {
      document.querySelector('#bonds-id2').classList.remove('set-background-white');
      this.setBackground2 = true;
    }

  }

  changeBackground3() {
    if (this.setBackground3) {
      document.querySelector('#bonds-id3').classList.add('set-background-white');
      this.setBackground3 = false;
    }
    else {
      document.querySelector('#bonds-id3').classList.remove('set-background-white');
      this.setBackground3 = true;
    }
  }

  changeBackground4() {
    if (this.setBackground4) {
      document.querySelector('#bonds-id4').classList.add('set-background-white');
      this.setBackground4 = false;
    }
    else {
      document.querySelector('#bonds-id4').classList.remove('set-background-white');
      this.setBackground4 = true;
    }
  }

  changeBackground5() {
    if (this.setBackground5) {
      document.querySelector('#bonds-id5').classList.add('set-background-white');
      this.setBackground5 = false;
    }
    else {
      document.querySelector('#bonds-id5').classList.remove('set-background-white');
      this.setBackground5 = true;
    }
  }

  changeBackground6() {
    if (this.setBackground6) {
      document.querySelector('#bonds-id6').classList.add('set-background-white');
      this.setBackground6 = false;
    }
    else {
      document.querySelector('#bonds-id6').classList.remove('set-background-white');
      this.setBackground6 = true;
    }
  }

  changeBackground7() {
    if (this.setBackground7) {
      document.querySelector('#bonds-id7').classList.add('set-background-white');
      this.setBackground7 = false;
    }
    else {
      document.querySelector('#bonds-id7').classList.remove('set-background-white');
      this.setBackground7 = true;
    }
  }

  changeBackground8() {
    if (this.setBackground8) {
      document.querySelector('#bonds-id8').classList.add('set-background-white');
      this.setBackground8 = false;
    }
    else {
      document.querySelector('#bonds-id8').classList.remove('set-background-white');
      this.setBackground8 = true;
    }
  }

  changeBackground9() {
    if (this.setBackground9) {
      document.querySelector('#bonds-id9').classList.add('set-background-white');
      this.setBackground9 = false;
    }
    else {
      document.querySelector('#bonds-id9').classList.remove('set-background-white');
      this.setBackground9 = true;
    }
  }

  changeBackground10() {
    if (this.setBackground10) {
      document.querySelector('#bonds-id10').classList.add('set-background-white');
      this.setBackground10 = false;
    }
    else {
      document.querySelector('#bonds-id10').classList.remove('set-background-white');
      this.setBackground10 = true;
    }
  }

}
