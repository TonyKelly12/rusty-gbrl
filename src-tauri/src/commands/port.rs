//! Tauri commands for serial port discovery and connection.
//!
//! Exposes list_serial_ports (and later connect) to the frontend.

use grbl_rs::machines::grbl::{list_ports, PortInfo};
use serde::Serialize;

/// Serial port info for the frontend (name and display title).
#[derive(Clone, Debug, Serialize)]
pub struct PortInfoDto {
    pub name: String,
    pub title: String,
}

/// List available serial ports. When MESHFORGE_MOCK=1, returns fake ports so you can test without hardware.
#[tauri::command]
pub fn list_serial_ports() -> Result<Vec<PortInfoDto>, String> {
    if crate::is_mock_env() {
        return Ok(mock_ports());
    }
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

fn mock_ports() -> Vec<PortInfoDto> {
    vec![
        PortInfoDto {
            name: "COM3".to_string(),
            title: "Mock CNC (COM3)".to_string(),
        },
        PortInfoDto {
            name: "/dev/ttyUSB0".to_string(),
            title: "Mock CNC (ttyUSB0)".to_string(),
        },
    ]
}
