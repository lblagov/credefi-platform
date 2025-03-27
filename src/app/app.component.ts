import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { RouterOutlet } from '@angular/router';
import { icons } from './helpers/icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet],
  standalone: true,
})
export class AppComponent implements OnInit {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadIcons();
  }

  loadIcons() {
    for (const item of icons) {
      this.matIconRegistry.addSvgIcon(
        item.icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(item.url)
      );
    }
  }

}
