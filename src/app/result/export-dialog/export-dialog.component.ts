import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: "app-export-dialog",
  templateUrl: "./export-dialog.component.html",
  styleUrls: ["./export-dialog.component.scss"]
})
export class ExportDialogComponent implements OnInit {

  chartUrl: string;
  tableUrl: string;
  docPdf: jsPDF;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.chartUrl = this.data.chartUrl;
    html2canvas(this.data.tableElement).then(canvas => {
      this.tableUrl = canvas.toDataURL('image/png');
    });

    let computers: Array<Object> = [];
    this.data.tableData.forEach(computer => {
      if (computer.antivirusUptodate == '1') {
        computer.antivirusUptodate = 'Oui';
      } else {
        computer.antivirusUptodate = 'Non';
      }
      computers.push(Object.values(computer));
    })

    this.docPdf = new jsPDF('landscape');
    this.docPdf.addImage(this.chartUrl, "PNG", 10, 10, 269.25, 134.5); // 280, 150
    this.docPdf.addPage();
    this.docPdf.autoTable({
      head: [['#', 'Nom', 'Statut', 'OS', 'Version', 'Arch', 'Version d\'antivirus', 'Antivirus à jour', 'Fabricant', 'Numéro d\'inventaire']], body: computers
    })
  }

  onExportChart() {
    Notification.requestPermission().then(() => {
      new Notification('Export du graphique', { body: 'Le graphique a été exporté avec succès.', icon: 'assets/icons/notification_chart.png' })
    })
  }

  onExportTable() {
    Notification.requestPermission().then(() => {
      new Notification('Export du tableau', { body: 'Le tableau a été exporté avec succès.', icon: 'assets/icons/notification_table.png' })
    })
  }

  onExportPdf(): void {
    this.docPdf.save('rapport.pdf', { returnPromise: true })
      .then(() => {
        Notification.requestPermission().then(() => {
          new Notification('Export PDF', { body: 'Le document PDF a été exporté avec succès.', icon: 'assets/icons/notification_pdf.png' })
        })
      });
  }
}

interface DialogData {
  chartUrl: string;
  chartSize: { width: number, height: number };
  tableElement: HTMLCanvasElement;
  tableData: Array<{ id: number, name: string, status: string, os: string, version: string, architecture: string, antivirusUptodate: string, antivirusVersion: string, manufacturer: string, serial: string }>;
}