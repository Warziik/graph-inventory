import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-database-dialog',
  templateUrl: './database-dialog.component.html',
  styleUrls: ['./database-dialog.component.scss']
})
export class DatabaseDialogComponent implements OnInit {

  databaseForm: FormGroup;

  hidePassword: boolean = true;

  constructor(public dialogRef: MatDialogRef<DatabaseDialogComponent>, private dataService: DataService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.databaseForm = new FormGroup({
      host: new FormControl('localhost', Validators.required),
      username: new FormControl('root', Validators.required),
      password: new FormControl(''),
      dbname: new FormControl('glpi', Validators.required)
    });
  }

  get host(): AbstractControl {
    return this.databaseForm.get('host');
  }

  get username(): AbstractControl {
    return this.databaseForm.get('username');
  }

  get password(): AbstractControl {
    return this.databaseForm.get('password');
  }

  get dbname(): AbstractControl {
    return this.databaseForm.get('dbname');
  }

  onSubmitForm(): void {
    this.dataService.sendDatabaseCredentials(this.databaseForm.value)
      .then(() => {
        this.dialogRef.close();
      })
      .catch(() => {
        this.snackbar.open('Échec de la connexion à la base de données.', null, {
          duration: 4000
        });
      })
  }
}
