import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  // @ts-ignore
  private logsSubject: BehaviorSubject<string[]> = new BehaviorSubject([]);
  logs: Observable<string[]> = this.logsSubject.asObservable();

  constructor() { }

  updateLogs(message: string): void
  {
    const fullMessage: string = new Date().toISOString() + ' ' + message;
    const currentMessage = this.logsSubject.getValue();
    currentMessage.push(fullMessage);
    this.logsSubject.next(currentMessage);
  }
}
