import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ExportDialogComponent } from "./export-dialog/export-dialog.component";
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { ThemeService as ChartThemeService } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.scss"]
})
export class ResultComponent implements OnInit {
  isLoading: boolean = true;

  // Chart
  chartTypeForm: FormGroup;

  chartTypes: Object[] = [
    { value: "horizontalBar", name: "Bar horizontal" },
    { value: "bar", name: "Bar" },
    { value: "pie", name: "Pie" },
    { value: "doughnut", name: "Doughnut" },
    { value: "line", name: "Line" },
    { value: "polarArea", name: "Polar Area" },
    { value: "radar", name: "Radar" }
  ];

  chartOptions: ChartOptions = {};

  chartData: Object[];

  chartLabels: string[];

  chartColors: Array<Object>;

  // Table
  displayedColumns: string[] = [
    "id",
    "name",
    "status",
    "os",
    "antivirus",
    "antivirusUptodate",
    "manufacturer",
    "serial"
  ];

  computers: Object[];

  constructor(
    private titleService: Title,
    private dataService: DataService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private chartThemeService: ChartThemeService
  ) {
    this.titleService.setTitle("Résultats");
  }

  ngOnInit(): void {
    this.dataService.getUserPreferences()
      .then(({ useDarkTheme }) => {
        if (useDarkTheme) {
          this.loadChartTheme(useDarkTheme);
        }
      })
      .catch(err => console.error);

    this.route.queryParams.subscribe(params => {
      this.dataService.getResults(params)
        .then((data: ResultsInterface) => {
          this.computers = data.computers;
          this.chartData = data.chart.data;
          this.chartLabels = data.chart.labels;

          let colors: Array<String> = [];
          for (let i = 0; i < this.chartLabels.length; i++) {
            colors.push(this.randomChartColor(i));
          }

          this.chartColors = [
            {
              backgroundColor: colors,
              borderColor: "#777"
            }
          ];

          this.chartTypeForm = new FormGroup({
            type: new FormControl("horizontalBar")
          });

          this.themeService.isDarkTheme.subscribe((status: boolean) => {
            this.loadChartTheme(status);
          })

          this.isLoading = false;
        })
        .catch(err => console.error);
    })
  }

  openExportDialog(): void {
    const chart: HTMLCanvasElement = document.getElementsByTagName("canvas")[0];
    this.dialog.open(ExportDialogComponent, {
      data: {
        chartUrl: chart.toDataURL("image/png"),
        chartSize: { width: chart.width / 4, height: chart.height / 4 },
        tableElement: document.getElementById('resultsToConvert'),
        tableData: this.computers.slice()
      }
    });
  }

  private randomChartColor(i: number): string {
    const colors: Array<string> = [
      "#f44336",
      "#E91E63",
      "#9C27B0",
      "#3F51B5",
      "#2196F3",
      "#00BCD4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
      "#795548",
      "#9E9E9E",
      "#607D8B"
    ];
    return colors[i];
  }

  private loadChartTheme(value: boolean): void {
    if (value) {
      this.chartOptions = {
        responsive: true,
        legend: {
          labels: { fontColor: 'white' }
        },
        scales: {
          xAxes: [{
            ticks: { fontColor: 'white' },
            gridLines: { color: 'rgba(255,255,255,0.1)' }
          }],
          yAxes: [{
            ticks: { fontColor: 'white' },
            gridLines: { color: 'rgba(255,255,255,0.1)' }
          }]
        }
      }
    } else {
      this.chartOptions = { responsive: true };
    }
    this.chartThemeService.setColorschemesOptions(this.chartOptions);
  }
}

interface ResultsInterface {
  computers: Object[];
  chart: { data: Object[]; labels: string[] };
}
