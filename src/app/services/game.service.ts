import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Game } from '../interfaces/Game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseApiURL = environment.baseApiURL

  constructor(private http: HttpClient) { }

  listGames(): Observable<Game[]> {
    return this.http.get<{ games: Game[] }>(`${this.baseApiURL}games`)
      .pipe(
        first(),
        map(response => response.games)
      )
  }
}
