import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameboardComponent } from './components/gameboard/gameboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ConfigurationService } from './services/configuration.service';
import { StatisticsComponent } from './components/statistics/statistics/statistics.component';
import { EventsComponent } from './components/events/events.component';
import { EventsService } from "./services/events.service";

@NgModule({
  declarations: [
    AppComponent,
    GameboardComponent,
    StatisticsComponent,
    EventsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [
    ConfigurationService,
    EventsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
