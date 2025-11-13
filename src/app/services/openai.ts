import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Openai {
  // ✅ your Render backend base URL
  private apiBase = 'https://ai-summarizer-1wum.onrender.com/api';

  constructor(private http: HttpClient) {}

  summarizeText(text: string): Observable<any> {
    return this.http.post(`${this.apiBase}/summarize`, { text });
  }

  translateText(text: string, targetLang: string) {
    return this.http.post<{ translated: string }>(
      `${this.apiBase}/translate`,
      { text, targetLang }
    );
  }
}
