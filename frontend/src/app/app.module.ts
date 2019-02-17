import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {RoomModule} from './feature/room/room.module';
import {DashboardModule} from './feature/dashboard/dashboard.module';
import {CoreModule} from './core/core.module';
import {PageNotFoundComponent} from './feature/page-not-found/page-not-found.component';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    DashboardModule,
    RoomModule,
    AppRoutingModule, // should be the last because of routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

