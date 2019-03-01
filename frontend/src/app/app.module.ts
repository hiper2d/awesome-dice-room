import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {RoomModule} from './feature/room/room.module';
import {DashboardModule} from './feature/dashboard/dashboard.module';
import {CoreModule} from './core/core.module';
import {PageNotFoundComponent} from './feature/page-not-found/page-not-found.component';
import {BrowserModule} from '@angular/platform-browser';
import {ApiConst} from './util/api.const';
import {UserService} from './core/service/user.service';

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
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (userService: UserService) => loadToken(userService),
      deps: [UserService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function loadToken(userService: UserService) {
  return () => Promise.resolve(localStorage.getItem(ApiConst.LOCAL_STORAGE_TOKEN))
    .then((t) => userService.storeToken(t))
    .catch(() => console.log('Unauthorized'));
}
