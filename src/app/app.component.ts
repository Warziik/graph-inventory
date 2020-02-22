import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DatabaseDialogComponent } from './database-dialog/database-dialog.component';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public dialog: MatDialog, private dataService: DataService) { }

  databaseConnected: boolean;

  private databaseDialogRef: MatDialogRef<DatabaseDialogComponent>;

  ngOnInit() {
    this.dataService.getDatabaseStatus()
      .then((status: boolean) => {
        this.databaseConnected = status;
        if (!this.databaseConnected) {
          this.databaseDialogRef = this.dialog.open(DatabaseDialogComponent);
          this.databaseDialogRef.disableClose = true;
        } else {
          this.databaseDialogRef.close();
        }

        this.databaseDialogRef.afterClosed().subscribe(() => this.databaseConnected = true);
      })
      .catch(err => console.error);
  }
}