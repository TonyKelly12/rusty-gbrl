import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TauriService, MockStatusDto } from './core';
import { HeaderComponent } from './components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header></app-header>

    <main class="main-content">
      @if (mockMode) {
        <div class="card" id="mock-banner">
          <h2>Demo mode</h2>
          <p style="margin:0; font-size: 0.9rem;">
            Running with <code>MESHFORGE_MOCK=1</code>. Ports and status are fake — no machine connected.
          </p>
        </div>
      }

      @if (mockMode) {
        <div class="card" id="status-card">
          <h2>Machine status (mock)</h2>
          <p class="status-text">{{ statusText }}</p>
          <button type="button" (click)="refreshStatus()" style="margin-top: 0.5rem;">Refresh status</button>
        </div>
      }
    </main>
  `,
  styles: [`
    .main-content {
      padding: 1rem 1.25rem;
    }
  `],
})
export class AppComponent implements OnInit {
  mockMode = false;
  statusText = '';

  constructor(private tauri: TauriService) {}

  ngOnInit(): void {
    this.tauri.isMockMode().then((m) => {
      this.mockMode = m;
      if (m) this.refreshStatus();
    }).catch(() => { this.mockMode = false; });
  }

  refreshStatus(): void {
    this.tauri.getMockStatus()
      .then((s) => { this.statusText = this.formatStatus(s); })
      .catch((e) => { this.statusText = 'Error: ' + String(e); });
  }

  private formatStatus(s: MockStatusDto): string {
    const w = s.work_pos;
    const m = s.machine_pos;
    return `State: ${s.state}\nWork:  X${w.x.toFixed(3)} Y${w.y.toFixed(3)} Z${w.z.toFixed(3)}\nMachine: X${m.x.toFixed(3)} Y${m.y.toFixed(3)} Z${m.z.toFixed(3)}\nFeed: ${s.feed_rate} mm/min  Spindle: ${s.spindle_speed} rpm`;
  }
}
