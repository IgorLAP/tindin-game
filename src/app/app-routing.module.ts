import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { GameComponent } from './pages/game/game.component';
import { HomeComponent } from './pages/home/home.component';
import { InsertEditGameComponent } from './pages/insert-edit-game/insert-edit-game.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SearchComponent } from './pages/search/search.component';
import { SigninComponent } from './pages/signin/signin.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: SigninComponent },
  { path: 'game', canActivate: [AuthGuard], component: InsertEditGameComponent },
  { path: 'game/:id', component: GameComponent },
  { path: 'edit/:id', canActivate: [AuthGuard], component: InsertEditGameComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', component: NotFoundComponent }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
