import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService, GameData } from '../../services/configuration.service';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss']
})

export class GameboardComponent implements OnInit {

  // @ts-ignore
  gameBoard: Observable<GameData>;

  constructor(
    private configurationService: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.configurationService.getConfiguration();
    this.gameBoard = this.configurationService.config.pipe();
  }

}
