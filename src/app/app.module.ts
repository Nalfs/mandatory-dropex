import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { BoardComponent } from './board/board.component';

import { AuthService } from './auth.service';
import { StorageComponent } from './storage/storage.component';
import { LogoutComponent } from './logout/logout.component';
import { SearchComponent } from './search/search.component';
import { FileService } from './file.service';


const appRoutes = [
    { path: 'auth', component: AuthComponent },
    { path: 'logout', component: LogoutComponent },
    { path: '', component: BoardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    BoardComponent,
    StorageComponent,
    LogoutComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService, FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
