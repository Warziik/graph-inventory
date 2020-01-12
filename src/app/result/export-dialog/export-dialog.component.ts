import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import html2canvas from "html2canvas";

@Component({
  selector: "app-export-dialog",
  templateUrl: "./export-dialog.component.html",
  styleUrls: ["./export-dialog.component.scss"]
})
export class ExportDialogComponent implements OnInit {
  tableUrl: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    html2canvas(this.data.tableElement).then(canvas => {
      const url = canvas.toDataURL("image/png");
      this.tableUrl = url;
    });
  }

  onClickExportChart(event) {
    setTimeout(() => {
      event.target.href = this.data.chartUrl;
    }, 1000);
  }

  onClickExportTable(event) {
    setTimeout(() => {
      event.target.href = this.tableUrl;
    }, 1000);
  }
}
