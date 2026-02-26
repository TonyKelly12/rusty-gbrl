import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TauriService, PortInfoDto, MockStatusDto } from './tauri.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>MeshForge CNC</h1>

    @if (mockMode) {
      <div class="card" id="mock-banner">
        <h2>Demo mode</h2>
        <p style="margin:0; font-size: 0.9rem;">
          Running with <code>MESHFORGE_MOCK=1</code>. Ports and status are fake — no machine connected.
        </p>
      </div>
    }

    <div class="card">
      <h2>Serial ports</h2>
      <button type="button" (click)="refreshPorts()" [disabled]="portsLoading">Refresh ports</button>
      <ul class="ports-list" aria-live="polite">
        @if (ports.length === 0 && !portsLoading && !portsError) {
          <li>No serial ports found</li>
        }
        @for (p of ports; track p.name) {
          <li>{{ p.title || p.name }} ({{ p.name }})</li>
        }
      </ul>
      @if (portsError) {
        <p class="error">{{ portsError }}</p>
      }
    </div>

    @if (mockMode) {
      <div class="card" id="status-card">
        <h2>Machine status (mock)</h2>
        <p class="status-text">{{ statusText }}</p>
        <button type="button" (click)="refreshStatus()" style="margin-top: 0.5rem;">Refresh status</button>
      </div>
    }
  `,
})
export class AppComponent implements OnInit {
  mockMode = false;
  ports: PortInfoDto[] = [];
  portsLoading = false;
  portsError: string | null = null;
  statusText = '';

  constructor(private tauri: TauriService) {}

  ngOnInit(): void {
    this.tauri.isMockMode().then((m) => {
      this.mockMode = m;
      if (m) this.refreshStatus();
    }).catch(() => { this.mockMode = false; });
    this.refreshPorts();
  }

  refreshPorts(): void {
    this.portsError = null;
    this.ports = [];
    this.portsLoading = true;
    this.tauri.listSerialPorts()
      .then((list) => { this.ports = list ?? []; })
      .catch((e) => { this.portsError = String(e); })
      .finally(() => { this.portsLoading = false; });
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
