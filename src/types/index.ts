// Define the types of draggable items used in the editor
export const ItemTypes = {
    HEADING: 'heading',           // Represents a heading component (e.g. <h1>)
    PARAGRAPH: 'paragraph',       // Represents a paragraph of text
    BUTTON: 'button',             // Represents a clickable button
    IMAGE: 'image',               // Represents an image (either link or upload)
    CANVAS_COMPONENT: 'canvasComponent', // Used internally to track reordering
};

// Type to indicate the source of an image: either from a link or uploaded file
export type ImageSourceType = 'link' | 'upload';

// Interface for common style properties applied to canvas components
export interface ComponentStyles {
    color: string;                // Text color
    fontSize: string;             // Font size (e.g. "16px")
    fontWeight: string;           // Font weight (e.g. "bold", "normal")
    backgroundColor?: string;     // Optional background color (used mainly for buttons)
}

// Main interface representing a component on the canvas
export interface CanvasComponent {
    id: number;                   // Unique ID for each component
    type: string;                 // Type of component (matches one of ItemTypes)
    content: string;              // Text content or Base64 string (for images)
    styles: ComponentStyles;      // Style settings for the component
    imageSourceType?: ImageSourceType; // Optional for image components, indicates whether the image is a link or upload
    file?: File | null;           // Only used temporarily for uploaded images, not persisted directly
    link?: string;                // NEW: Optional link for button components
}
