//! Per-machine configuration: steps/mm, work area, and optional tool library.
//!
//! Used by the app for bounds checks, motion config, and tool management.
//! Does not depend on the serial feature.

use serde::{Deserialize, Serialize};

/// Work envelope in mm (X, Y, Z). Used for UI and sanity checks.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct WorkArea {
    pub x_mm: f64,
    pub y_mm: f64,
    pub z_mm: f64,
}

impl WorkArea {
    pub const fn new(x_mm: f64, y_mm: f64, z_mm: f64) -> Self {
        Self { x_mm, y_mm, z_mm }
    }
}

/// Steps per mm per axis (GRBL uses these in $$ settings). Optional per-axis override.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct StepsPerMm {
    pub x: f64,
    pub y: f64,
    pub z: f64,
    /// Bed extension axis (e.g. A) if present.
    pub a: Option<f64>,
}

impl Default for StepsPerMm {
    fn default() -> Self {
        Self {
            x: 80.0,
            y: 80.0,
            z: 80.0,
            a: None,
        }
    }
}

/// Single tool entry for the tool library (e.g. for probe length offset).
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct ToolEntry {
    pub number: u8,
    pub description: String,
    /// Tool length offset in mm (e.g. from probe); used for Z compensation.
    pub length_offset_mm: Option<f64>,
}

/// Per-machine profile: work area, steps/mm, and optional tool list.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct MachineProfile {
    pub name: String,
    pub work_area: WorkArea,
    pub steps_per_mm: StepsPerMm,
    pub tools: Vec<ToolEntry>,
}

impl MachineProfile {
    /// Build a profile for the PROVerXL 4030 (24x24 inch, 24" Z).
    pub fn proverxl_4030() -> Self {
        Self {
            name: "PROVerXL 4030".to_string(),
            work_area: WorkArea::new(609.6, 609.6, 609.6), // 24" each axis
            steps_per_mm: StepsPerMm::default(),
            tools: Vec::new(),
        }
    }

    /// Look up a tool by number.
    pub fn tool(&self, number: u8) -> Option<&ToolEntry> {
        self.tools.iter().find(|t| t.number == number)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_profile_roundtrip() {
        let p = MachineProfile::proverxl_4030();
        let json = serde_json::to_string(&p).unwrap();
        let p2: MachineProfile = serde_json::from_str(&json).unwrap();
        assert_eq!(p.name, p2.name);
        assert_eq!(p.work_area.x_mm, p2.work_area.x_mm);
    }

    #[test]
    fn test_tool_lookup() {
        let mut p = MachineProfile::proverxl_4030();
        p.tools.push(ToolEntry {
            number: 1,
            description: "6mm endmill".to_string(),
            length_offset_mm: Some(45.2),
        });
        let t = p.tool(1).unwrap();
        assert_eq!(t.description, "6mm endmill");
        assert_eq!(t.length_offset_mm, Some(45.2));
        assert!(p.tool(2).is_none());
    }
}
