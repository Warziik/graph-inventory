import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import { Notification } from 'electron';

@Component({
  selector: "app-export-dialog",
  templateUrl: "./export-dialog.component.html",
  styleUrls: ["./export-dialog.component.scss"]
})
export class ExportDialogComponent implements OnInit {

  tableUrl: string = "";
  chartUrl: string = "";
  docPdf: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.chartUrl = this.data.chartUrl;
    html2canvas(this.data.tableElement).then(canvas => {
      this.tableUrl = canvas.toDataURL("image/png");
    });

    this.docPdf = new jsPDF();
    this.docPdf.addImage(this.chartUrl, "PNG", 10, 10, 190, 120);
    this.docPdf.addPage();
    this.docPdf.addImage(this.tableUrl, "PNG", 10, 10, 190, 500);
  }

  onExportPdf(): void {
    this.docPdf.save('rapport.pdf');
  }
}

interface DialogData {
  chartUrl: string;
  tableElement: HTMLElement;
}