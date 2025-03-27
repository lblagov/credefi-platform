import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BarModel } from 'src/app/model/bar.model';

@Component({
  selector: 'app-bar-chart-mobile',
  templateUrl: './index.html',
  styleUrls: ['./style.scss'],
  imports: [MatIconModule, MatButtonModule, CommonModule],
  standalone: true
})
export class BarChartMobileComponent {

  @Input() List: Array<BarModel>;

  public Total=0;
  public MaxHeight= 160;

  constructor() { }

  ngOnInit(): void {
    this.MounthGraph();
  }

  MounthGraph(){
    this.List.forEach(element => {
      this.Total += element.Value;
    });

    this.List.forEach(element => {
      element.Size = Math.round((element.Value * this.MaxHeight)/this.Total) * 1.433 + '%';
    });
  }

}
