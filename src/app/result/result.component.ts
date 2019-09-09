import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  // Chart
  chartTypeForm: FormGroup;

  chartTypes: Object[] = [
    { value: 'pie', name: 'Pie' },
    { value: 'doughnut', name: 'Doughnut' },
    { value: 'bar', name: 'Bar' },
    { value: 'horizontalBar', name: 'Bar horizontal' },
    { value: 'line', name: 'Line' },
    { value: 'polarArea', name: 'Polar Area' },
    { value: 'radar', name: 'Radar' }
  ]

  chartOptions: Object = {
    responsive: true
  };

  chartData: Object[];

  chartLabels: string[];

  // Table
  displayedColumns: string[] = ['id', 'name', 'status', 'os', 'antivirus', 'manufacturer', 'serial'];
  computers: Object[];

  constructor(private titleService: Title) {
    this.titleService.setTitle("Résultats");
  }

  ngOnInit() {
    this.chartTypeForm = new FormGroup({
      type: new FormControl('horizontalBar')
    })

    this.chartData = [
      { data: [330, 600, 260, 700], label: 'Account A' },
      { data: [120, 455, 100, 340], label: 'Account B' },
      { data: [45, 67, 800, 500], label: 'Account C' }
    ];
    this.chartLabels = ['January', 'February', 'Mars', 'April'];

    this.computers = [
      { id: 1, name: "XXX", status: "En service", os: "Windows", version: "XP", architecture: "32-bit", antivirus: "...", manufacturer: "Microsoft", serial: "..." },
      { id: 2, name: "XXX", status: "New", os: "Windows", version: "XP", architecture: "32-bit", antivirus: "...", manufacturer: "Microsoft", serial: "..." },
      { id: 3, name: "XXX", status: "En service", os: "Windows", version: "7", architecture: "64-bit", antivirus: "...", manufacturer: "Microsoft", serial: "..." },
      { id: 4, name: "XXX", status: "En service", os: "Windows", version: "XP", architecture: "32-bit", antivirus: "...", manufacturer: "Microsoft", serial: "..." },
      { id: 5, name: "XXX", status: "En service", os: "Windows", version: "1709", architecture: "64-bit", antivirus: "...", manufacturer: "Microsoft", serial: "..." },
      { id: 6, name: "XXX", status: "New", os: "Windows", version: "7", architecture: "32-bit", antivirus: "...", manufacturer: "Microsoft", serial: "..." }
    ];
  }

}
