import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Game } from '../interfaces/Game';

interface ListGamesQueryOptions {
  paginationDetails?: { perPage: number, page: number };
  highlight?: boolean;
}

interface ListGamesApiResponse {
  games: Game[]
  totalSize: number
}

interface RateGameApiResponse {
  game: string;
  rating: number;
  totalVotes: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly baseApiURL = environment.baseApiURL

  constructor(private http: HttpClient, private cookie: CookieService) { }

  listGames({ paginationDetails = { perPage: 4, page: 1 }, highlight }: ListGamesQueryOptions): Observable<ListGamesApiResponse> {

    let params = new HttpParams({
      fromObject: {
        ...paginationDetails,
        highlight: highlight ?? ''
      }
    })

    return this.http.get<ListGamesApiResponse>(`${this.baseApiURL}games`, { params })
      .pipe(
        first(),
      )
  }

  insertGame(game: Omit<Game, '_id'>): Observable<Game> {
    let token = this.cookie.get('auth.token')
    let headers = new HttpHeaders()
      .set('x-api-key', token)
    return this.http.post<Game>(`${this.baseApiURL}games`, { ...game }, { headers })
      .pipe(
        first()
      )
  }

  searchGame(query: string): Observable<Game[] | []> {
    return this.http.get<ListGamesApiResponse>(`${this.baseApiURL}games`)
      .pipe(
        first(),
        map(response => {
          const searchResult =
            response.games.filter(game => game.title.toLowerCase().includes(query.toLowerCase()))
          return searchResult
        })
      )
  }

  getGame(gameId: string): Observable<Game> {
    return this.http.get<{ game: Game }>(`${this.baseApiURL}games/${gameId}`)
      .pipe(
        first(),
        map(response => response.game)
      )
  }

  rateGame(gameId: string, rate: number): Observable<RateGameApiResponse> {
    return this.http.post<RateGameApiResponse>(`${this.baseApiURL}games/rate`, { gameId, rate })
      .pipe(
        first()
      )
  }
}
