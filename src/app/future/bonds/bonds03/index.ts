import { Component } from '@angular/core';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)

@Component({
  selector: 'app-bonds03',
  templateUrl: './index.html',
  styleUrls: ['./style.scss']
})
export class Bonds03Component {
  title="Autonomous Earning is live!";
  description="Unlock the power of your stablecoins and earn interest on autopilot!";
  image = "./assets/images/dashboardBanner.png"
  currentPage = "Corporate bonds"
  color1 = "#6FACFF"
  color2 = "#5C68FF"
  color3 = "#2984FE"
  linearGradient = "background: linear-gradient(91.78deg, #6FACFF, #5C68FF,#2984FE);"
  height = '2426px';
  list: Array<string> = ["Tether", "Cardano", "Bitcoin"];
  disabled = false;
  max = 10000000;
  min = 240000;
  showTicks = false;
  step = 1000;
  thumbLabel = false;
  value = 240000;
  data = [
    { month: 'Jan', count: 40 },
    { month: 'Feb', count: 30 },
    { month: 'Mar', count: 10 },
    { month: 'Apr', count: 8 },
    { month: 'May', count: 12 },
    { month: 'Jun', count: 33 },
    { month: 'Jul', count: 43 },
    { month: 'Aug', count: 37 },
    { month: 'Sep', count: 28 },
    { month: 'Oct', count: 26 },
    { month: 'Nov', count: 19 },
    { month: 'Des', count: 33 },
  ];
   DATA_COUNT = 7;
   NUMBER_CFG = {count: this.DATA_COUNT, min: 0, max: 100};


  chartdata: any;

  labeldata: any[] = [];
  realdata: any[] = [];
  colordata: any[] = [];

  ngOnInit(): void {
    this.RenderChart(this.labeldata,this.realdata,this.colordata,'bar','barchart'); 
  }
  fn(value) {
    if (value < 1000000) {
      // let a = value / 1000;
      if (value%1000 == 0) {
        var right = "000";
      } else {
        right = (value%1000).toString();
      }
      return Math.floor(value/1000)+"."+right + ".00";
    } else {
      if (value%1000 == 0) {
        var hundred = "000";
      } else {
        hundred = (value%1000).toString();
      }
      if (Math.floor(value/1000) % 1000 == 0) {
        var thousand = "000";
      } else {
        thousand = (Math.floor(value/1000) % 1000).toString();
        if (thousand.length == 1) thousand = "00"+thousand;
        if (thousand.length == 2) thousand = "0"+thousand;
      }
      return Math.floor(value/1000000) + "," + thousand + "." + hundred + ".00";
    }
    return value/100;
  }
  RenderChart(labeldata:any,maindata:any,colordata:any,type:any,id:any) {
    const myChart = new Chart(id, {
      type: type,
      data: {
        labels: this.data.map(row => row.month),
        datasets: [
          {
            backgroundColor: ['rgba(211, 174, 219, 1)'],
            pointStyle: 'circle',
            borderColor: "white",
            borderWidth: 1,
            borderRadius:{
              topLeft: 20,
              topRight: 20,
              bottomLeft: 20,
              bottomRight: 20
            },
            borderSkipped: false,
            barThickness: 10,
            barPercentage: 0.5,
            
            // label: 'Portfolio lend',
            data: this.data.map(row => row.count)
          },

          
        ]
      },
      options: {
    
        plugins: {
          legend: {
            display:false
            },
          
        },

        scales: {
          x: {
            stacked: true,
            grid: {
              drawBorder: false,
              display: false,
            },
          
          },
          y: {
            // stacked: true,
            beginAtZero: true,
            border: {
              display: false
            },
          }
        }
      }
    });
  }
}
