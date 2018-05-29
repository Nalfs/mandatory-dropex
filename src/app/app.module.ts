import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './auth.service';
import { DropexService } from './dropex.service';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { BoardComponent } from './board/board.component';
import { StorageComponent } from './storage/storage.component';
import { LogoutComponent } from './logout/logout.component';
import { SearchComponent } from './search/search.component';
import { UploadComponent } from './upload/upload.component';
import { PathComponent } from './path/path.component';

const appRoutes = [
    { path: 'auth', component: AuthComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'search', component: SearchComponent },
    { path: '', component: BoardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    BoardComponent,
    StorageComponent,
    LogoutComponent,
    SearchComponent,
    UploadComponent,
    PathComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [AuthService, DropexService],
  bootstrap: [AppComponent]
})
export class AppModule { }
