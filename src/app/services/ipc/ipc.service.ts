import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  private _ipc: IpcRenderer | undefined;

  constructor() {
    if (window.require) {
      try {
        this._ipc = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.log("L'IPC d'Electron ne s'est pas chargé.");
    }
  }

  /**
   * Écouteur d'évènements émis par le serveur
   * @param channel 
   * @param listener 
   */
  on(channel: string, listener: any): Promise<any> {
    if (!this._ipc) {
      return;
    }
    this._ipc.on(channel, listener);
  }

  /**
  * @param channel
  * @param args
  */
  invoke(channel: string, ...args: any[]): Promise<any> {
    if (!this._ipc) {
      return;
    }
    return this._ipc.invoke(channel, ...args);
  }

  /**
   * Émetteur d'évènements écoutés par la serveur
   * @param channel 
   * @param args 
   */
  send(channel: string, ...args: any[]): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.send(channel, ...args);
  }
}
