import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Game } from '../interfaces/Game';

interface listGamesQueryOptions {
  paginationDetails?: { perPage: number, page: number };
  highlight?: boolean;
}

interface listGamesApiResponse {
  games: Game[]
  totalSize: number
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly baseApiURL = environment.baseApiURL

  constructor(private http: HttpClient) { }

  listGames({ paginationDetails = { perPage: 4, page: 1 }, highlight }: listGamesQueryOptions): Observable<listGamesApiResponse> {

    let params = new HttpParams({
      fromObject: {
        ...paginationDetails,
        highlight: highlight ?? ''
      }
    })

    return this.http.get<listGamesApiResponse>(`${this.baseApiURL}games`, { params })
      .pipe(
        first(),
      )
  }


  searchGame(query: string): Observable<Game[] | []> {
    return this.http.get<{ games: Game[], totalSize: number }>(`${this.baseApiURL}games`)
      .pipe(
        first(),
        map(response => {
          const searchResult =
            response.games.filter(game => game.title.toLowerCase().includes(query.toLowerCase()))
          return searchResult
        })
      )
  }
}
