import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'status', 'os', 'antivirus', 'manufacturer', 'serial'];

  dataSource: Object[];

  constructor(private titleService: Title) {
    this.titleService.setTitle("Résultats");
  }

  ngOnInit() {
    this.dataSource = [
      { id: 1, name: "XXX", status: "En service", os: "Windows", version: "XP", architecture: "32-bit", antivirus: "...", manufacturer: "Microsoft", serial: "..." },
      { id: 2, name: "XXX", status: "New", os: "Windows", version: "XP", architecture: "32-bit", antivirus: "...", manufacturer: "Microsoft", serial: "..." },
      { id: 3, name: "XXX", status: "En service", os: "Windows", version: "7", architecture: "64-bit", antivirus: "...", manufacturer: "Microsoft", serial: "..." },
      { id: 4, name: "XXX", status: "En service", os: "Windows", version: "XP", architecture: "32-bit", antivirus: "...", manufacturer: "Microsoft", serial: "..." },
      { id: 5, name: "XXX", status: "En service", os: "Windows", version: "1709", architecture: "64-bit", antivirus: "...", manufacturer: "Microsoft", serial: "..." },
      { id: 6, name: "XXX", status: "New", os: "Windows", version: "7", architecture: "32-bit", antivirus: "...", manufacturer: "Microsoft", serial: "..." }
    ];
  }

}
