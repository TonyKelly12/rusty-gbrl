//! Tauri command handlers grouped by feature.
//!
//! Each submodule (port, machine, ...) owns the commands and DTOs for that area.
//! Re-export command functions here so lib.rs can register them in one place.

pub mod port;

pub use port::list_serial_ports;
