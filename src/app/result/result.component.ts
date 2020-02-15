import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ExportDialogComponent } from "./export-dialog/export-dialog.component";
import { IpcService } from "../services/ipc/ipc.service";
import { IpcRendererEvent } from "electron";

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

  chartOptions: Object = {
    responsive: true
  };

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
    private ipcService: IpcService,
    public dialog: MatDialog
  ) {
    this.titleService.setTitle("Résultats");
  }

  ngOnInit() {
    this.ipcService.on(
      "server:sendResults",
      (event: IpcRendererEvent, data: ResultsInterface) => {
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
      }
    );

    this.chartTypeForm = new FormGroup({
      type: new FormControl("horizontalBar")
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  openExportDialog() {
    this.dialog.open(ExportDialogComponent, {
      data: {
        chartUrl: document.getElementsByTagName("canvas")[0].toDataURL("image/png"),
        tableElement: document.getElementById("resultsToConvert")
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
}

interface ResultsInterface {
  computers: Object[];
  chart: { data: Object[]; labels: string[] };
}
