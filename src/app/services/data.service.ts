import { Injectable } from '@angular/core';
import { IpcService } from './ipc/ipc.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private ipcService: IpcService) { }

  getDatabaseStatus(): Promise<any> {
    return this.ipcService.invoke('client:requestDatabaseStatus');
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
}
