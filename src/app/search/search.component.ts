import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IpcService } from '../services/ipc/ipc.service';
import { IpcRendererEvent } from 'electron';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;

  oses: Object[];

  architectures: Object[];

  versions: Object[];

  constructor(private titleService: Title, private router: Router, private ipcService: IpcService) {
    this.titleService.setTitle("Rechercher");
  }

  ngOnInit() {
    this.ipcService.on('server:sendDefaultFormValues', (event: IpcRendererEvent, data: any) => {
      this.oses = data.oses;
      this.architectures = data.architectures;
      this.versions = data.versions;
    })
    this.ipcService.send('client:retriveDefaultFormValues');

    this.searchForm = new FormGroup({
      os: new FormControl(''),
      architecture: new FormControl(''),
      version: new FormControl('')
    })
  }

  onSubmitForm() {
    this.ipcService.send('client:sendSearchValues', this.searchForm.value);
    this.router.navigate(['/results']);
  }
}
