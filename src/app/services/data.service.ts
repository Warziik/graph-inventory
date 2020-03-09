import { Injectable } from '@angular/core';
import { IpcService } from './ipc/ipc.service';
import { IpcRendererEvent } from 'electron';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private ipcService: IpcService) { }

  getUserPreferences(): Promise<{ useDarkTheme: boolean, databaseConnected: boolean }> {
    return this.ipcService.invoke('client:requestUserPreferences');
  }

  getDefaultFormValues(): Promise<Object> {
    return this.ipcService.invoke('client:requestFormValues');
  }

  getResults(value: any): Promise<{ computers: Object[], chart: { data: Object[]; labels: string[] } }> {
    return this.ipcService.invoke('client:requestResults', value);
  }

  sendDatabaseCredentials(value: { host: string, username: string, password: string, dbname: string }): Promise<string> {
    return this.ipcService.invoke('client:sendDatabaseCredentials', value);
  }

  updateTheme(value: boolean): void {
    this.ipcService.send('client:updateTheme', value);
  }

  onNativeThemeUpdate(): Observable<boolean> {
    return new Observable((observer) => {
      this.ipcService.on('server:updateNativeTheme', (event: IpcRendererEvent, shouldUseDarkColors: boolean) => {
        observer.next(shouldUseDarkColors);
      })
    })
  }
}
