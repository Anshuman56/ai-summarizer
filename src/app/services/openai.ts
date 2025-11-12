import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Openai {
  
private apiUrl = 'http://localhost:3000/api/summarize'; // ✅ our Node backend URL

  constructor(private http: HttpClient) {}  // ✅ this line is crucial!

  summarizeText(text: string): Observable<any> {
    return this.http.post(this.apiUrl, { text }); // ✅ uses this.http safely
  }

  translateText(text: string, targetLang: string) {
  return this.http.post<{ translated: string }>('http://localhost:3000/api/translate', {
    text,
    targetLang
  });
}

}
