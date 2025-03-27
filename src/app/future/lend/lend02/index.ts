import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';


interface Width {
  screenWidth: number;
}

@Component({
  selector: 'app-lend02',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class Lend02Component implements OnInit {
  @Output() onToggleSideNav: EventEmitter<Width> = new EventEmitter();

  screenWidth = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768 ) {
      this.onToggleSideNav.emit({screenWidth: this.screenWidth});
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
}


 selectWallet(): void {
   console.log('selectWallet pressed')

  }
}
