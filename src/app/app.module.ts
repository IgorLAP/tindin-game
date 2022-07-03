import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BannerComponent } from './components/banner/banner.component';
import { FooterComponent } from './components/footer/footer.component';
import { GamesAreaComponent } from './components/games-area/games-area.component';
import { HeaderComponent } from './components/header/header.component';
import { GameComponent } from './pages/game/game.component';
import { HomeComponent } from './pages/home/home.component';
import { InsertEditGameComponent } from './pages/insert-edit-game/insert-edit-game.component';
import { SigninComponent } from './pages/signin/signin.component';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { ImgSpotlightComponent } from './components/img-spotlight/img-spotlight.component';
import { SearchComponent } from './pages/search/search.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import { SwiperModule } from 'swiper/angular'
import { VimeModule } from '@vime/angular';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SigninComponent,
    InsertEditGameComponent,
    GameComponent,
    BannerComponent,
    GamesAreaComponent,
    BreadCrumbComponent,
    ImgSpotlightComponent,
    SearchComponent,
    GameListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    SwiperModule,
    VimeModule,
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    [CookieService]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
