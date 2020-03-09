import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

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

  manufacturers: Object[];

  constructor(private titleService: Title, private router: Router, private dataService: DataService) {
    this.titleService.setTitle("Rechercher");
  }

  ngOnInit(): void {
    this.dataService.getDefaultFormValues()
      .then((data: DefaultFormValuesInterface) => {
        this.oses = data.oses;
        this.architectures = data.architectures;
        this.versions = data.versions;
        this.statuses = data.statuses;
        this.servicepacks = data.servicepacks;
        this.groups = data.groups;
        this.manufacturers = data.manufacturers;

        this.searchForm = new FormGroup({
          os: new FormControl(1),
          architecture: new FormControl(''),
          version: new FormControl(''),
          servicepack: new FormControl({ value: '', disabled: true }),
          status: new FormControl(''),
          antivirus: new FormControl(''),
          group: new FormControl(''),
          manufacturer: new FormControl('')
        })

        this.isLoading = false;

        this.searchForm.get('version').valueChanges
          .subscribe(selectedVersionId => {
            const selectedVersion: any = this.versions.filter((v: { id: number, name: string }) => v.id === selectedVersionId)[0];
            if (selectedVersion.name === '7' || selectedVersion.name === 'XP') {
              this.searchForm.get('servicepack').enable();
            } else {
              this.searchForm.get('servicepack').disable();
            }
          })
      })
      .catch(err => console.error);
  }

  onSubmitForm(): void {
    this.router.navigate(['/results'], { queryParams: this.searchForm.value });
  }
}

interface DefaultFormValuesInterface {
  oses: Array<Object>;
  architectures: Array<Object>;
  versions: Array<Object>;
  statuses: Array<Object>;
  servicepacks: Array<Object>;
  groups: Array<Object>;
  manufacturers: Array<Object>;
}