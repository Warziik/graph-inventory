import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;

  oses: Object[] = [
    { id: 1, name: 'Windows' },
    { id: 2, name: 'Linux' }
  ]

  architectures: Object[] = [
    { id: 1, name: '32-bit' },
    { id: 2, name: '64-bit' }
  ]

  versions: Object[] = [
    { id: 1, name: '7' },
    { id: 2, name: 'XP' },
    { id: 3, name: '2000' },
    { id: 4, name: '1607' }
  ]

  constructor(private titleService: Title, private router: Router) {
    this.titleService.setTitle("Rechercher");
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      os: new FormControl(''),
      architecture: new FormControl(''),
      version: new FormControl('')
    })
  }

  onSubmitForm() {
    console.log(this.searchForm.value);
    this.router.navigate(['/results']);
  }
}
