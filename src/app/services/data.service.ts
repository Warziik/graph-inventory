import { Injectable } from '@angular/core';
import { IpcService } from './ipc/ipc.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private ipcService: IpcService) { }

  getUserPreferences(): Promise<any> {
    return this.ipcService.invoke('client:requestUserPreferences');
  }

  getDefaultFormValues(): Promise<any> {
    return this.ipcService.invoke('client:requestFormValues');
  }

  getResults(value: any): Promise<any> {
    return this.ipcService.invoke('client:requestResults', value);
  }

  sendDatabaseCredentials(value: any): Promise<any> {
    return this.ipcService.invoke('client:sendDatabaseCredentials', value);
  }

  updateTheme(value: boolean): void {
    this.ipcService.send('client:updateTheme', value);
  }
}
