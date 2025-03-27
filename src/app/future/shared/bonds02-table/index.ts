import { Component,Input, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bonds02-table',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule],
  standalone: true
})
export class Bonds02TableComponent {
  @Input() bonds02Id: string;
  @Input() bondsIcon: string;
  @Input() iconArrow: string;
  @Input() slideBonds02Table: (args: any) => void;

  @Input() p2pId1: string;

  // public iconArrow = 'whiteArrowDown';
  
}
