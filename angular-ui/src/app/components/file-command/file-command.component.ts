import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FileCommandAction = 'load' | 'reload' | 'clear' | 'selectPrevious';

@Component({
  selector: 'app-file-command',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-command" aria-label="File commands">
      <button type="button" class="btn btn-load" (click)="action.emit('load')" aria-label="Load file">
        <span class="btn-icon" aria-hidden="true">&#128193;</span>
        Load File
      </button>
      <div class="dropdown-wrap">
        <select
          class="dropdown"
          [value]="selectedPath()"
          (change)="onPreviousSelect($event)"
          [attr.aria-label]="'Previous files'"
          title="Previous files"
        >
          <option value="" disabled>Previous files…</option>
          @for (f of previousFiles(); track f.path) {
            <option [value]="f.path">{{ f.name }}</option>
          }
        </select>
      </div>
      <button type="button" class="btn btn-icon-only" (click)="action.emit('reload')" aria-label="Reload file" title="Reload">
        <span aria-hidden="true">&#8635;</span>
      </button>
      <button type="button" class="btn btn-icon-only" (click)="action.emit('clear')" aria-label="Clear file" title="Clear">
        <span aria-hidden="true">&#10005;</span>
      </button>
    </div>
  `,
  styles: [`
    .file-command {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      border: 1px solid var(--muted, #565f89);
      background: var(--surface, #24283b);
      color: var(--text, #c0caf5);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
    }
    .btn:hover { background: var(--muted, #565f89); }
    .btn-icon { font-size: 1rem; }
    .btn-load { flex: 0 0 auto; }
    .btn-icon-only {
      width: 36px;
      height: 36px;
      padding: 0;
      justify-content: center;
    }
    .btn-icon-only span { font-size: 1.1rem; }
    .dropdown-wrap { flex: 1; min-width: 0; }
    .dropdown {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      border: 1px solid var(--muted, #565f89);
      background: var(--bg, #1a1b26);
      color: var(--text, #c0caf5);
      font-size: 0.85rem;
      cursor: pointer;
    }
  `],
})
export class FileCommandComponent {
  readonly previousFiles = input<{ name: string; path: string }[]>([]);
  readonly selectedPath = input<string>('');

  readonly action = output<FileCommandAction>();
  readonly previousSelected = output<string>();

  onPreviousSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const path = select.value;
    if (path) {
      this.previousSelected.emit(path);
    }
  }
}
