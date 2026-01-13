/**
 * Application-wide constants
 * Centralizes magic numbers and configuration values
 */

// =============================================================================
// Auto-save Configuration
// =============================================================================

/** Debounce time for auto-save in milliseconds */
export const DEBOUNCE_MS = 2000;

/** Interval for periodic auto-save in milliseconds (1 minute) */
export const AUTO_SAVE_INTERVAL_MS = 60000;

// =============================================================================
// Undo/Redo Configuration
// =============================================================================

/** Maximum number of undo states to keep in history */
export const MAX_UNDO_HISTORY = 30;

// =============================================================================
// Canvas Configuration
// =============================================================================

/** Default snap grid size in pixels */
export const SNAP_GRID_SIZE = 12;

/** Background dot gap in pixels */
export const BACKGROUND_DOT_GAP = 12;

/** MiniMap dimensions */
export const MINIMAP_WIDTH = 150;
export const MINIMAP_HEIGHT = 100;

// =============================================================================
// Export Configuration
// =============================================================================

/** Padding around exported diagrams in pixels */
export const EXPORT_PADDING = 50;

/** Resolution multiplier for PNG exports */
export const EXPORT_SCALE = 4;

// =============================================================================
// Node Defaults
// =============================================================================

/** Default z-index for drawing nodes (strokes, shapes) */
export const DRAWING_NODE_Z_INDEX = 1000;

/** Toast duration in milliseconds for deletion feedback */
export const DELETE_TOAST_DURATION = 5000;
