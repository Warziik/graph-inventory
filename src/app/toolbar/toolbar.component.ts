import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  isDarkTheme: Observable<boolean>;

  constructor(private themeService: ThemeService, private dataService: DataService) { }

  ngOnInit() {
    this.isDarkTheme = this.themeService.isDarkTheme;
  }

  toggleDarkTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
    this.dataService.updateTheme(checked);
  }
}
