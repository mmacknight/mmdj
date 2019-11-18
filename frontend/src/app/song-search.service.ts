import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Song } from '@classes/song';
import { Youtube } from '@classes/youtube';
import { Soundcloud } from '@classes/soundcloud';

@Injectable({
  providedIn: 'root'
})
export class SongSearchService {

  ITUNES_API = 'https://itunes.apple.com/search?term=';
  PHP_API_SERVER = "http://db.cse.nd.edu/cse30246/mmdj/backend/api";
  YOUTUBE_API = `${this.PHP_API_SERVER}/youtube.php`;
  CLIENT_ID = 'BeGVhOrGmfboy1LtiHTQF6Ejpt9ULJCI';
  SOUNDCLOUD_API = `https://api.soundcloud.com/tracks/?client_id=${this.CLIENT_ID}`;

  constructor(private httpClient: HttpClient) {  }

  searchItunes(search_term) {
    console.log(`${this.ITUNES_API}${search_term.split(' ').join('+')}`);
    return this.httpClient.get<any>(`${this.ITUNES_API}${search_term.split(' ').join('+')}`).pipe(catchError(this.errorHandler))
  }

  searchDatabase(term) {
    // return this.apiService.get_songs(term);
  }

  searchYoutube(search_term) {
    return this.httpClient.get<Youtube[]>(`${this.YOUTUBE_API}/?query=${search_term}`).pipe(catchError(this.errorHandler))
  }

  searchSoundcloud(search_term) {
    return this.httpClient.get<Soundcloud[]>(`${this.SOUNDCLOUD_API}&q=${search_term}`).pipe(catchError(this.errorHandler))
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error);
  }
}
