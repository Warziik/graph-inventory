import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onClickExportChart(event) {
    event.target.href = this.data.chartUrl;
  }

  onClickExportTable(event) {
    html2canvas(this.data.tableElement).then(canvas => {
      const url = canvas.toDataURL('image/png');
      event.target.href = url;
    })
  }
}
