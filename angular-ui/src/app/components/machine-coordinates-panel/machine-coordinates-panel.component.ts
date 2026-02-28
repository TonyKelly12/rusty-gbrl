import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-machine-coordinates-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="coordinates-panel" aria-label="Machine coordinates">
      <div class="panel-grid">
        <!-- Header row -->
        <div class="cell cell-header"></div>
        <div class="cell cell-header">Zero</div>
        <div class="cell cell-header cell-work">Work</div>
        <div class="cell cell-header cell-machine">Machine</div>
        <div class="cell cell-header cell-go">Go</div>

        <!-- X row -->
        <div class="cell cell-axis">X</div>
        <div class="cell">
          <button type="button" class="btn-zero" (click)="zeroAxis('x')" aria-label="Zero X">XØ</button>
        </div>
        <div class="cell cell-value cell-work">{{ workX().toFixed(2) }}</div>
        <div class="cell cell-value cell-machine">{{ machineX().toFixed(2) }}</div>
        <div class="cell">
          <button type="button" class="btn-go" (click)="goTo('x')">X</button>
        </div>

        <!-- Y row -->
        <div class="cell cell-axis">Y</div>
        <div class="cell">
          <button type="button" class="btn-zero" (click)="zeroAxis('y')" aria-label="Zero Y">YØ</button>
        </div>
        <div class="cell cell-value cell-work">{{ workY().toFixed(2) }}</div>
        <div class="cell cell-value cell-machine">{{ machineY().toFixed(2) }}</div>
        <div class="cell">
          <button type="button" class="btn-go" (click)="goTo('y')">Y</button>
        </div>

        <!-- Z row -->
        <div class="cell cell-axis">Z</div>
        <div class="cell">
          <button type="button" class="btn-zero" (click)="zeroAxis('z')" aria-label="Zero Z">ZØ</button>
        </div>
        <div class="cell cell-value cell-work">{{ workZ().toFixed(2) }}</div>
        <div class="cell cell-value cell-machine">{{ machineZ().toFixed(2) }}</div>
        <div class="cell">
          <button type="button" class="btn-go" (click)="goTo('z')">Z</button>
        </div>

        <!-- XY row (Go only) -->
        <div class="cell cell-axis">XY</div>
        <div class="cell"></div>
        <div class="cell cell-value cell-work">—</div>
        <div class="cell cell-value cell-machine">—</div>
        <div class="cell">
          <button type="button" class="btn-go" (click)="goTo('xy')">XY</button>
        </div>
      </div>

      <button type="button" class="btn-zero-all" (click)="zeroAll()" aria-label="Zero all axes">
        <span class="zero-icon" aria-hidden="true">⊕</span>
        Zero
      </button>
    </section>
  `,
  styles: [`
    .coordinates-panel {
      background: var(--surface, #24283b);
      border-radius: 8px;
      padding: 1rem;
      border: 1px solid var(--muted, #565f89);
      min-width: 280px;
    }
    .panel-grid {
      display: grid;
      grid-template-columns: auto auto 1fr 1fr auto;
      gap: 0.5rem 1rem;
      align-items: center;
    }
    .cell {
      min-height: 2rem;
      display: flex;
      align-items: center;
    }
    .cell-header {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--muted, #565f89);
    }
    .cell-axis {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text, #c0caf5);
    }
    .cell-value {
      font-family: ui-monospace, 'SF Mono', monospace;
      font-size: 1rem;
    }
    .cell-work {
      color: var(--accent, #7aa2f7);
      font-weight: 600;
    }
    .cell-machine {
      color: var(--muted, #565f89);
      font-weight: 400;
    }
    .cell-go {
      justify-content: center;
    }
    .btn-zero,
    .btn-go {
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      min-width: 2.5rem;
    }
    .btn-zero {
      background: var(--surface, #24283b);
      color: var(--text, #c0caf5);
      border: 1px solid var(--muted, #565f89);
    }
    .btn-zero:hover {
      background: var(--muted, #565f89);
    }
    .btn-go {
      background: var(--accent, #7aa2f7);
      color: var(--bg, #1a1b26);
    }
    .btn-go:hover {
      filter: brightness(1.1);
    }
    .btn-zero-all {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      width: 100%;
      margin-top: 1rem;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid var(--muted, #565f89);
      background: var(--surface, #24283b);
      color: var(--text, #c0caf5);
    }
    .btn-zero-all:hover {
      background: var(--muted, #565f89);
    }
    .zero-icon {
      font-size: 1.1rem;
      opacity: 0.9;
    }
  `],
})
export class MachineCoordinatesPanelComponent {
  workX = signal(0);
  workY = signal(0);
  workZ = signal(25);
  machineX = signal(0);
  machineY = signal(0);
  machineZ = signal(0);

  zeroAxis(axis: 'x' | 'y' | 'z'): void {
    if (axis === 'x') this.workX.set(0);
    if (axis === 'y') this.workY.set(0);
    if (axis === 'z') this.workZ.set(0);
  }

  zeroAll(): void {
    this.workX.set(0);
    this.workY.set(0);
    this.workZ.set(0);
  }

  goTo(which: 'x' | 'y' | 'z' | 'xy'): void {
    // UI only: placeholder for future "go to" action
  }
}
