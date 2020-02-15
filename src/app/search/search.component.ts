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
  isLoading: boolean = true;

  searchForm: FormGroup;

  oses: Object[];

  architectures: Object[];

  versions: Object[];

  servicepacks: Object[];

  statuses: Object[];

  antivitures: Object[];

  groups: Object[];

  constructor(private titleService: Title, private router: Router, private ipcService: IpcService) {
    this.titleService.setTitle("Rechercher");
  }

  async ngOnInit() {
    this.ipcService.on('server:sendDefaultFormValues', (event: IpcRendererEvent, data: any) => {
      this.oses = data.oses;
      this.architectures = data.architectures;
      this.versions = data.versions;
      this.statuses = data.statuses;
      this.servicepacks = data.servicepacks;
      this.groups = data.groups;
    })
    this.ipcService.send('client:retriveDefaultFormValues');

    this.searchForm = new FormGroup({
      os: new FormControl(''),
      architecture: new FormControl(''),
      version: new FormControl(''),
      servicepack: new FormControl(''),
      status: new FormControl(''),
      antivirus: new FormControl(''),
      group: new FormControl('')
    })

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onSubmitForm() {
    this.ipcService.send('client:sendSearchValues', this.searchForm.value);
    this.router.navigate(['/results']);
  }
}
