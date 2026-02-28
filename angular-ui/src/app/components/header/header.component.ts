import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortSelectComponent } from '../port-select/port-select.component';
import { MachineStateDisplayComponent } from '../machine-state-display/machine-state-display.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, PortSelectComponent, MachineStateDisplayComponent],
  template: `
    <header class="app-header">
      <div class="header-left">
        <span class="app-icon" aria-hidden="true">&#9881;</span>
        <app-port-select></app-port-select>
      </div>
      <div class="header-center">
        <app-machine-state-display></app-machine-state-display>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      background: var(--surface, #24283b);
      border-bottom: 1px solid var(--muted, #565f89);
      min-height: 48px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .app-icon {
      font-size: 1.25rem;
      opacity: 0.9;
    }
    .header-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  `],
})
export class HeaderComponent {}
