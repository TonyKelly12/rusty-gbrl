//! Desktop entry point. Delegates to the library so the same code path works for mobile later.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    meshforge_app::run()
}
