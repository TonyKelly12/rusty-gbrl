import { Injectable } from '@angular/core';

declare global {
  interface Window {
    __TAURI__?: {
      core: { invoke: <T>(cmd: string, args?: unknown) => Promise<T> };
    };
  }
}

export interface PortInfoDto {
  name: string;
  title: string;
}

export interface MockPositionDto {
  x: number;
  y: number;
  z: number;
  a: number | null;
}

export interface MockStatusDto {
  state: string;
  work_pos: MockPositionDto;
  machine_pos: MockPositionDto;
  feed_rate: number;
  spindle_speed: number;
}

@Injectable({ providedIn: 'root' })
export class TauriService {
  private get invoke() {
    if (typeof window !== 'undefined' && window.__TAURI__?.core?.invoke) {
      return window.__TAURI__.core.invoke.bind(window.__TAURI__.core);
    }
    throw new Error('Tauri API not available (not running in Tauri?)');
  }

  isMockMode(): Promise<boolean> {
    return this.invoke<boolean>('is_mock_mode');
  }

  listSerialPorts(): Promise<PortInfoDto[]> {
    return this.invoke<PortInfoDto[]>('list_serial_ports');
  }

  getMockStatus(): Promise<MockStatusDto> {
    return this.invoke<MockStatusDto>('get_mock_status');
  }
}
