import { Component } from '@angular/core';
import { Openai } from '../../services/openai';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface SummaryItem {
  text: string;
  summary: string;
  translated?: string;
}


@Component({
  selector: 'app-summarizer',
  imports: [FormsModule, NgIf, NgClass, NgFor],
  templateUrl: './summarizer.html',
  styleUrl: './summarizer.css',
})
export class Summarizer {
  inputText = '';
  summary = '';
 latestTranslation = '';
  loading = false;
  translating = false;
  error = '';
  isDarkMode = false;
  latestInputTranslation = '';
  translatingInput = false;


   // 💾 History of all summaries
  history: SummaryItem[] = [];

  constructor(private openaiService: Openai, private http: HttpClient) {}
  
  ngOnInit() {
    // ✅ Load theme preference when page loads
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    document.body.classList.toggle('dark-body', this.isDarkMode);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    // ✅ Save preference to localStorage
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');

    // ✅ Apply dark mode to the whole page
    document.body.classList.toggle('dark-body', this.isDarkMode);
  }
  


summarize() {
  if (!this.inputText.trim()) {
    this.error = 'Please enter some text.';
    return;
  }

  this.loading = true;
  this.error = '';
  this.summary = '';
  this.latestTranslation = '';

  this.openaiService.summarizeText(this.inputText).subscribe({
    next: (res) => {
      const englishSummary = res.summary || 'No summary found.';
      this.summary = englishSummary;

      // 🧠 Save English summary only (no auto-translation)
        this.history.unshift({
          text: this.inputText,
          summary: englishSummary,
        });


      this.inputText = ''; // Clear textarea
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Error: Could not summarize.';
      console.error(err);
      this.loading = false;
    },
  });
}

  
  // 🗑️ Delete a summary from history
  deleteSummary(index: number) {
    this.history.splice(index, 1);
  }

  
  // 🌐 Manual translation button (if user clicks "Translate to Odia")
  translateLatestSummary() {
    if (!this.summary) return;

    this.translating = true;

    this.http
      .post<{ translated: string }>('https://ai-summarizer-1wum.onrender.com/api/translate', {
        text: this.summary,
        targetLang: 'or',
      })
      .subscribe({
        next: (res) => {
          this.latestTranslation = res.translated;
          this.translating = false;
        },
        error: (err) => {
          console.error('Translation failed:', err);
          alert('❌ Failed to translate to Odia.');
          this.translating = false;
        },
      });
  }

  copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Text copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('❌ Failed to copy text.');
  });
}

translateInputText() {
  if (!this.inputText.trim()) return;

  this.translatingInput = true;
  this.latestInputTranslation = '';

  this.http.post<{ translated: string }>(
    'https://ai-summarizer-1wum.onrender.com/api/translate',
    { text: this.inputText, targetLang: 'or' }
  )
  .subscribe({
    next: (res) => {
      this.latestInputTranslation = res.translated;
      this.translatingInput = false;
    },
    error: () => {
      alert("❌ Failed to translate input text.");
      this.translatingInput = false;
    }
  });
}


}
