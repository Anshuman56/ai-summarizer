import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Summarizer {

    private apiUrl = 'http://localhost:3000/api/summarize';

  constructor(private http: HttpClient) {}

  summarizeText(text: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { text });
  }
  
}
