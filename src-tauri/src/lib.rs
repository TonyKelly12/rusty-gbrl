//! MeshForge Tauri app: desktop shell around the grbl-rs library.
//!
//! Exposes GRBL operations as Tauri commands for the frontend. Command handlers
//! are organized by feature in `commands/` (e.g. port, machine).
//! Set `MESHFORGE_MOCK=1` to use mock data so you can run and test without hardware.

mod commands;

use commands::list_serial_ports;
use serde::Serialize;

/// Returns true if mock mode is enabled (MESHFORGE_MOCK=1). Used by command modules and UI.
pub(crate) fn is_mock_env() -> bool {
    std::env::var("MESHFORGE_MOCK").as_deref() == Ok("1")
}

/// Returns true if mock mode is enabled (MESHFORGE_MOCK=1). UI can show "Demo mode".
#[tauri::command]
fn is_mock_mode() -> bool {
    is_mock_env()
}

/// Mock machine status for UI testing. Position, state, and feed/spindle; no real hardware.
#[derive(Clone, Debug, Serialize)]
pub struct MockStatusDto {
    pub state: String,
    pub work_pos: MockPositionDto,
    pub machine_pos: MockPositionDto,
    pub feed_rate: f64,
    pub spindle_speed: f64,
}

#[derive(Clone, Debug, Serialize)]
pub struct MockPositionDto {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub a: Option<f64>,
}

/// Returns fake machine status (Idle, positions at 0,0,0). Use when MESHFORGE_MOCK=1 to drive the UI.
#[tauri::command]
fn get_mock_status() -> MockStatusDto {
    MockStatusDto {
        state: "Idle".to_string(),
        work_pos: MockPositionDto {
            x: 0.0,
            y: 0.0,
            z: 0.0,
            a: None,
        },
        machine_pos: MockPositionDto {
            x: 0.0,
            y: 0.0,
            z: 0.0,
            a: None,
        },
        feed_rate: 0.0,
        spindle_speed: 0.0,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_serial_ports,
            is_mock_mode,
            get_mock_status,
        ])
        .run(tauri::generate_context!())
        .expect("error running MeshForge app");
}
