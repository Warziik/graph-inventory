import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {

  tableUrl: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    html2canvas(this.data.tableElement).then(canvas => {
      const url = canvas.toDataURL('image/png');
      this.tableUrl = url;
    })
  }

  onClickExportChart(event) {
    event.target.href = this.data.chartUrl;
  }

  onClickExportTable(event) {
    event.target.href = this.tableUrl;
  }

  onClickExportPdf() {
    const chartUrl = this.data.chartUrl;
    console.log(this.data.chartType);
    let doc = new jspdf();
    if (this.data.chartType === 'bar' || this.data.chartType === 'horizontalBar' || this.data.chartType === 'line') {
      doc.addImage(chartUrl, 'PNG', 10, 15, 190, 130);
    } else {
      doc.addImage(chartUrl, 'PNG', -10, 15, 230, 130);
    }
    doc.addImage(this.tableUrl, 'PNG', -10, 150, 190, 130);
    doc.save('rapport.pdf');
  }
}
