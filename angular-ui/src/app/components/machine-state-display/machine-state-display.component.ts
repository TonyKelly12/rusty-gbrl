import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TauriService } from '../../core';

@Component({
  selector: 'app-machine-state-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="state-box" [class]="stateClass()" [attr.aria-live]="'polite'">
      {{ stateLabel() }}
    </div>
  `,
  styles: [`
    .state-box {
      padding: 0.4rem 1rem;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      min-width: 6rem;
      text-align: center;
    }
    .state-idle {
      background: rgba(126, 206, 126, 0.25);
      color: #9ece6a;
      border: 1px solid rgba(158, 206, 106, 0.4);
    }
    .state-run {
      background: rgba(122, 162, 247, 0.25);
      color: #7aa2f7;
      border: 1px solid rgba(122, 162, 247, 0.4);
    }
    .state-hold {
      background: rgba(224, 175, 104, 0.25);
      color: #e0af68;
      border: 1px solid rgba(224, 175, 104, 0.4);
    }
    .state-alarm {
      background: rgba(247, 118, 142, 0.25);
      color: #f7768e;
      border: 1px solid rgba(247, 118, 142, 0.4);
    }
    .state-disconnected {
      background: rgba(101, 95, 133, 0.25);
      color: var(--muted, #565f89);
      border: 1px solid var(--muted, #565f89);
    }
  `],
})
export class MachineStateDisplayComponent implements OnInit {
  private readonly state = signal<string>('Disconnected');

  stateLabel = computed(() => this.state() || 'Disconnected');

  stateClass = computed(() => {
    const s = (this.state() || '').toLowerCase();
    if (s.includes('idle')) return 'state-idle';
    if (s.includes('run') || s.includes('jog')) return 'state-run';
    if (s.includes('hold')) return 'state-hold';
    if (s.includes('alarm') || s.includes('error')) return 'state-alarm';
    return 'state-disconnected';
  });

  constructor(private tauri: TauriService) {}

  ngOnInit(): void {
    this.tauri.isMockMode().then((isMock) => {
      if (isMock) {
        this.refreshState();
      }
    }).catch(() => {});
  }

  refreshState(): void {
    this.tauri.getMockStatus()
      .then((s) => this.state.set(s.state))
      .catch(() => this.state.set('Disconnected'));
  }
}
