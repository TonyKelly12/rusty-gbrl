import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileCommandComponent, type FileCommandAction } from '../file-command/file-command.component';
import {
  FileInformationComponent,
  type FileInfoView,
  type FileBounds,
} from '../file-information/file-information.component';

@Component({
  selector: 'app-file-load',
  standalone: true,
  imports: [CommonModule, FileCommandComponent, FileInformationComponent],
  template: `
    <section class="file-load" aria-label="G-code file">
      <app-file-command
        [previousFiles]="previousFiles()"
        [selectedPath]="selectedPath()"
        (action)="onFileCommand($event)"
        (previousSelected)="onPreviousSelected($event)"
      ></app-file-command>
      <app-file-information
        [fileName]="fileName()"
        [filePath]="filePath()"
        [fileSizeLines]="fileSizeLines()"
        [bounds]="bounds()"
        [viewMode]="viewMode()"
        (viewChange)="viewMode.set($event)"
      ></app-file-information>
    </section>
  `,
  styles: [`
    .file-load {
      background: var(--surface, #24283b);
      border-radius: 8px;
      padding: 1rem;
      border: 1px solid var(--muted, #565f89);
    }
  `],
})
export class FileLoadComponent {
  readonly previousFiles = signal<{ name: string; path: string }[]>([]);
  readonly selectedPath = signal<string>('');
  readonly fileName = signal<string>('');
  readonly filePath = signal<string>('');
  readonly fileSizeLines = signal<string>('');
  readonly bounds = signal<FileBounds | null>(null);
  readonly viewMode = signal<FileInfoView>('size');

  onFileCommand(action: FileCommandAction): void {
    if (action === 'load') {
      this.setMockFile();
    } else if (action === 'clear') {
      this.fileName.set('');
      this.filePath.set('');
      this.fileSizeLines.set('');
      this.bounds.set(null);
      this.selectedPath.set('');
    } else if (action === 'reload' && this.fileName()) {
      this.setMockFile();
    }
  }

  onPreviousSelected(path: string): void {
    this.selectedPath.set(path);
    this.setMockFile();
  }

  private setMockFile(): void {
    this.fileName.set('V4 Gold Maples14.gcode');
    this.filePath.set('E:\\Downloads\\CnC Projects\\Gold Coin Box\\V4 Gold Maples 14.gcode');
    this.fileSizeLines.set('14 KB (852 lines)');
    this.bounds.set({
      x: { size: 61.12, min: 0, max: 61.12 },
      y: { size: 128.28, min: 0, max: 128.28 },
      z: { size: 38, min: -36, max: 2 },
    });
    const path = this.filePath();
    const name = this.fileName();
    this.selectedPath.set(path);
    const list = this.previousFiles();
    if (!list.some((f) => f.path === path)) {
      this.previousFiles.set([...list, { name, path }].slice(-10));
    }
  }
}
