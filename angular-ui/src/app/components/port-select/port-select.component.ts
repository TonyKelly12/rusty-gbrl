import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortService } from '../../features';

@Component({
  selector: 'app-port-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="port-select-wrap">
      <select
        class="port-select"
        [value]="selectedPort()?.name ?? ''"
        (change)="onPortChange($event)"
        [disabled]="portsLoading()"
        title="Select serial port"
        aria-label="Serial port"
      >
        <option value="" disabled>Select port…</option>
        @for (p of portsList(); track p.name) {
          <option [value]="p.name">{{ p.title || p.name }}</option>
        }
      </select>
      @if (selectedDisplay()) {
        <span class="controller-label">grbHAL</span>
      }
    </div>
    @if (portsError()) {
      <span class="port-error" title="{{ portsError() }}">Connection error</span>
    }
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .port-select-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .port-select {
      background: var(--bg, #1a1b26);
      color: var(--text, #c0caf5);
      border: 1px solid var(--muted, #565f89);
      border-radius: 6px;
      padding: 0.35rem 0.6rem;
      font-size: 0.9rem;
      min-width: 120px;
      cursor: pointer;
    }
    .port-select:disabled {
      opacity: 0.7;
      cursor: wait;
    }
    .controller-label {
      font-size: 0.8rem;
      color: var(--muted, #565f89);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .port-error {
      font-size: 0.8rem;
      color: #f7768e;
    }
  `],
})
export class PortSelectComponent implements OnInit {
  portsList = this.portService.portsList;
  portsLoading = this.portService.portsLoading;
  portsError = this.portService.portsError;
  selectedDisplay = this.portService.selectedDisplay;
  selectedPort = this.portService.selectedPort;

  constructor(private portService: PortService) {}

  ngOnInit(): void {
    this.portService.refreshPorts().then((list) => {
      const current = this.portService.selectedPort();
      if (!current || !list.some((p) => p.name === current.name)) {
        if (list.length > 0) {
          this.portService.setSelected(list[0]);
        }
      }
    });
  }

  onPortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const name = select.value;
    if (!name) return;
    const port = this.portService.portsList().find((p) => p.name === name) ?? null;
    this.portService.setSelected(port);
  }
}
