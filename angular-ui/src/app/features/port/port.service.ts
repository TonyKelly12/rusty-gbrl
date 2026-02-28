import { Injectable, signal, computed } from '@angular/core';
import { TauriService, PortInfoDto } from '../../core';

@Injectable({ providedIn: 'root' })
export class PortService {
  private readonly ports = signal<PortInfoDto[]>([]);
  private readonly loading = signal(false);
  private readonly error = signal<string | null>(null);
  private readonly selected = signal<PortInfoDto | null>(null);

  readonly portsList = this.ports.asReadonly();
  readonly portsLoading = this.loading.asReadonly();
  readonly portsError = this.error.asReadonly();
  readonly selectedPort = this.selected.asReadonly();

  readonly selectedDisplay = computed(() => {
    const p = this.selected();
    return p ? p.title || p.name : null;
  });

  constructor(private tauri: TauriService) {}

  /** Load available serial ports (real or mock when MESHFORGE_MOCK=1). */
  async refreshPorts(): Promise<PortInfoDto[]> {
    this.error.set(null);
    this.ports.set([]);
    this.loading.set(true);
    try {
      const list = await this.tauri.listSerialPorts();
      const arr = list ?? [];
      this.ports.set(arr);
      return arr;
    } catch (e) {
      const msg = String(e);
      this.error.set(msg);
      return [];
    } finally {
      this.loading.set(false);
    }
  }

  setSelected(port: PortInfoDto | null): void {
    this.selected.set(port);
  }

  clearError(): void {
    this.error.set(null);
  }
}
