import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FileInfoView = 'size' | 'info';

export interface FileBounds {
  x: { size: number; min: number; max: number };
  y: { size: number; min: number; max: number };
  z: { size: number; min: number; max: number };
}

@Component({
  selector: 'app-file-information',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-information" aria-label="File information">
      @if (fileName()) {
        <h3 class="file-name">{{ fileName() }}</h3>
        <p class="file-meta">{{ fileSizeLines() }}</p>
        @if (filePath()) {
          <p class="file-path" [title]="filePath()">{{ filePath() }}</p>
        }
      } @else {
        <p class="file-empty">No file loaded</p>
      }

      <div class="toggle-and-grid">
        <div class="toggle-block">
          <span class="toggle-label toggle-label-top">Info</span>
          <button
            type="button"
            class="toggle-track"
            [class.toggle-size]="viewMode() === 'size'"
            [attr.aria-label]="'Toggle ' + viewMode()"
            (click)="toggleView()"
          >
            <span class="toggle-thumb"></span>
          </button>
          <span class="toggle-label toggle-label-bottom">Size</span>
        </div>
        <div class="grid-wrap">
          <table class="data-grid" *ngIf="bounds()">
            <thead>
              <tr>
                <th></th>
                <th>Size</th>
                <th>Min</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="axis-label">X</td>
                <td>{{ bounds()!.x.size.toFixed(2) }}</td>
                <td>{{ bounds()!.x.min.toFixed(2) }}</td>
                <td>{{ bounds()!.x.max.toFixed(2) }}</td>
              </tr>
              <tr>
                <td class="axis-label">Y</td>
                <td>{{ bounds()!.y.size.toFixed(2) }}</td>
                <td>{{ bounds()!.y.min.toFixed(2) }}</td>
                <td>{{ bounds()!.y.max.toFixed(2) }}</td>
              </tr>
              <tr>
                <td class="axis-label">Z</td>
                <td>{{ bounds()!.z.size.toFixed(2) }}</td>
                <td>{{ bounds()!.z.min.toFixed(2) }}</td>
                <td>{{ bounds()!.z.max.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          @if (!bounds()) {
            <p class="grid-placeholder">—</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .file-information {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .file-name {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      color: var(--text, #c0caf5);
      word-break: break-all;
    }
    .file-meta {
      font-size: 0.8rem;
      color: var(--muted, #565f89);
      margin: 0;
    }
    .file-path {
      font-size: 0.75rem;
      color: var(--muted, #565f89);
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .file-empty {
      font-size: 0.9rem;
      color: var(--muted, #565f89);
      margin: 0;
    }
    .toggle-and-grid {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      margin-top: 0.5rem;
    }
    .toggle-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }
    .toggle-label {
      font-size: 0.7rem;
      color: var(--muted, #565f89);
    }
    .toggle-track {
      width: 28px;
      height: 48px;
      border-radius: 14px;
      border: 1px solid var(--muted, #565f89);
      background: var(--muted, #565f89);
      cursor: pointer;
      padding: 3px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }
    .toggle-track.toggle-size { justify-content: flex-end; align-items: flex-end; }
    .toggle-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--text, #c0caf5);
      flex-shrink: 0;
    }
    .toggle-size .toggle-thumb { align-self: flex-end; }
    .grid-wrap {
      flex: 1;
      min-width: 0;
    }
    .data-grid {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      font-family: ui-monospace, monospace;
    }
    .data-grid th,
    .data-grid td {
      padding: 0.35rem 0.5rem;
      text-align: left;
      border-bottom: 1px solid var(--muted, #565f89);
    }
    .data-grid th { color: var(--muted, #565f89); font-weight: 600; }
    .axis-label { font-weight: 500; color: var(--text, #c0caf5); }
    .grid-placeholder {
      margin: 0;
      color: var(--muted, #565f89);
      font-size: 0.9rem;
    }
  `],
})
export class FileInformationComponent {
  readonly fileName = input<string>('');
  readonly filePath = input<string>('');
  readonly fileSizeLines = input<string>('');
  readonly bounds = input<FileBounds | null>(null);
  readonly viewMode = input<FileInfoView>('size');

  readonly viewChange = output<FileInfoView>();

  toggleView(): void {
    const next = this.viewMode() === 'size' ? 'info' : 'size';
    this.viewChange.emit(next);
  }
}
