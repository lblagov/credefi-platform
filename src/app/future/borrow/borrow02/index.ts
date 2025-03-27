import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';

import {MatDialog} from '@angular/material/dialog';
import { PopUpComponent } from '../../shared/pop-up';

interface Width {
  screenWidth: number;
}
@Component({
  selector: 'app-borrow02',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']

})
export class Borrow02Component implements OnInit {
  @Output() onToggleSideNav: EventEmitter<Width> = new EventEmitter();
  screenWidth = 0;
  public opacity =1;
  public isOpacity = false;


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768 ) {
      this.onToggleSideNav.emit({screenWidth: this.screenWidth});
    }
  }
  
  constructor(
    // public dialogRef: MatDialogRef<PopUpComponent>,
    private matDialog : MatDialog){

    }

    

    ngOnInit(): void {
      this.screenWidth = window.innerWidth;
  }
  
  selectWallet(): void {
    console.log('selectWallet pressed')
 
   }


   nextStep(): void {
    console.log('nextStep pressed')
   }

   public openDialog(){
    document.querySelector('#container-lend').classList.add('blur');
    this.matDialog.open(PopUpComponent, {
    panelClass: 'dialog-side-panel',
     width:'430px',
     height:'422px', 

      
    })

   



 }

 public closeDialog(){
  console.log('closeDialog')

  if(this.opacity === 0.4){
    this.opacity = 1;
  }

  this.matDialog.closeAll()
 }
}
