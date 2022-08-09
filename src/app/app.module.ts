import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameboardComponent } from './components/gameboard/gameboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ConfigurationService } from './services/configuration.service';
import { StatisticsComponent } from './components/statistics/statistics/statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    GameboardComponent,
    StatisticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [
    ConfigurationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
