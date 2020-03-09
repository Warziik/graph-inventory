import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DatabaseDialogComponent } from './database-dialog/database-dialog.component';
import { DataService } from './services/data.service';
import { ThemeService } from './services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isDarkTheme: Observable<boolean>;

  databaseConnected: boolean;

  private databaseDialogRef: MatDialogRef<DatabaseDialogComponent>;

  constructor(public dialog: MatDialog, private dataService: DataService, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.dataService.onNativeThemeUpdate().subscribe(
      (shouldUseDarkColors: boolean) => {
        this.themeService.setDarkTheme(shouldUseDarkColors);
      }
    )

    this.dataService.getUserPreferences()
      .then(({ useDarkTheme, databaseConnected }) => {
        this.themeService.setDarkTheme(useDarkTheme);
        this.databaseConnected = databaseConnected;
        if (!this.databaseConnected) {
          this.databaseDialogRef = this.dialog.open(DatabaseDialogComponent);
          this.databaseDialogRef.disableClose = true;
        } else {
          this.databaseDialogRef.close();
        }

        this.databaseDialogRef.afterClosed().subscribe(() => this.databaseConnected = true);
      })
      .catch(err => console.error);

    this.isDarkTheme = this.themeService.isDarkTheme;
  }
}