import { Component, OnInit } from '@angular/core';
import { LogsService } from '../../../services/logs.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  // @ts-ignore
  logs: Observable<string[]>;

  constructor(
    private logsService: LogsService
  ) { }

  ngOnInit(): void
  {
    this.logs = this.logsService.logs
      .pipe();
  }

}
