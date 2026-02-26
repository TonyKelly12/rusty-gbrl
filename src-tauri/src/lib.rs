//! MeshForge Tauri app: desktop shell around the grbl-rs library.
//!
//! Exposes GRBL operations (e.g. list serial ports) as Tauri commands for the frontend.

use grbl_rs::machines::grbl::{list_ports, PortInfo};
use serde::Serialize;

/// Serial port info for the frontend (name and display title).
#[derive(Clone, Debug, Serialize)]
pub struct PortInfoDto {
    pub name: String,
    pub title: String,
}

/// List available serial ports (for connection UI). Calls into grbl-rs.
#[tauri::command]
fn list_serial_ports() -> Result<Vec<PortInfoDto>, String> {
    list_ports().map_err(|e| e.to_string()).map(|ports| {
        ports
            .into_iter()
            .map(|p: PortInfo| PortInfoDto {
                name: p.name,
                title: p.title,
            })
            .collect()
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_serial_ports])
        .run(tauri::generate_context!())
        .expect("error running MeshForge app");
}
