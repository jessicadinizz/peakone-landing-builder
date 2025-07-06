import type { CanvasComponent, ImageSourceType } from "../../types";
import { useState } from "react";
import { ItemTypes } from "../../types"; // Import ItemTypes to use its values

interface PropertiesPanelProps {
  selectedComponent: CanvasComponent | undefined;
  updateComponent: (id: number, newProps: Partial<CanvasComponent>) => void;
}

// This component handles the dynamic property editor shown in the right sidebar.
// It updates the styles or content of the selected component on the canvas.
export function PropertiesPanel({
  selectedComponent,
  updateComponent,
}: PropertiesPanelProps) {
  // Stores a preview of the image (base64 or URL)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // If no component is selected, show placeholder instructions
  if (!selectedComponent) {
    return (
      <aside className="editor-panel properties-panel">
        <h2>Properties</h2>
        <div className="properties-placeholder">
          <p className="placeholder-title">Select an element</p>
          <p className="placeholder-text">
            Choose a component on the canvas to edit its properties.
          </p>
        </div>
      </aside>
    );
  }

  // Updates a specific style of the selected component
  const handleStyleChange = (prop: string, value: string) => {
    updateComponent(selectedComponent.id, {
      styles: { ...selectedComponent.styles, [prop]: value },
    });
  };

  // Updates a general prop of the component, such as its content or link
  const handleInputChange = (prop: string, value: string) => {
    updateComponent(selectedComponent.id, { [prop]: value });

    // If the component is an image using a link, update the preview
    if (prop === "content" && selectedComponent.imageSourceType === "link") {
      setPreviewUrl(value);
    }
  };

  // Called when the user switches between link/upload for image source
  const handleImageSourceTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValue = event.target.value as ImageSourceType;
    updateComponent(selectedComponent.id, {
      imageSourceType: newValue,
      file: null,
    });
    setPreviewUrl(null); // Reset image preview when switching source type
  };

  // Converts uploaded image file to base64 and updates the component
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result?.toString() || "";
        updateComponent(selectedComponent.id, {
          file,
          content: base64,
        });
        setPreviewUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Checks if the selected component is a text-based element
  const isTextComponent =
    selectedComponent.type === ItemTypes.HEADING ||
    selectedComponent.type === ItemTypes.PARAGRAPH ||
    selectedComponent.type === ItemTypes.BUTTON;

  return (
    <aside className="editor-panel properties-panel">
      <h2>Properties</h2>
      <div className="properties-form">
        {/* Content field (used for text or image link) */}
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={selectedComponent.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            rows={selectedComponent.type === ItemTypes.IMAGE ? 1 : 3}
            placeholder={
              selectedComponent.type === ItemTypes.IMAGE ? "Image URL" : ""
            }
          />
        </div>

        {/* Properties for text components */}
        {isTextComponent && (
          <>
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={selectedComponent.styles.color}
                onChange={(e) => handleStyleChange("color", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Font Size (px)</label>
              <input
                type="number"
                value={parseInt(selectedComponent.styles.fontSize)}
                onChange={(e) =>
                  handleStyleChange("fontSize", `${e.target.value}px`)
                }
              />
            </div>
            <div className="form-group">
              <label>Font Weight</label>
              <select
                value={selectedComponent.styles.fontWeight}
                onChange={(e) =>
                  handleStyleChange("fontWeight", e.target.value)
                }
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Lighter</option>
              </select>
            </div>
          </>
        )}

        {/* Background color and Link only apply to buttons */}
        {selectedComponent.type === ItemTypes.BUTTON && (
          <>
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={selectedComponent.styles.backgroundColor}
                onChange={(e) =>
                  handleStyleChange("backgroundColor", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Button Link (URL)</label>
              <input
                type="text"
                value={selectedComponent.link || ""} // Use selectedComponent.link
                onChange={(e) => handleInputChange("link", e.target.value)}
                placeholder="e.g., https://example.com"
              />
            </div>
          </>
        )}

        {/* Properties for image component */}
        {selectedComponent.type === ItemTypes.IMAGE && (
          <>
            <div className="form-group">
              <label>Image Source</label>
              <select
                value={selectedComponent.imageSourceType}
                onChange={handleImageSourceTypeChange}
              >
                <option value="link">Link</option>
                <option value="upload">Upload</option>
              </select>
            </div>

            {/* File upload section for uploaded images */}
            {selectedComponent.imageSourceType === "upload" && (
              <div className="form-group">
                <label>Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewUrl && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Preview section for image link */}
            {selectedComponent.imageSourceType === "link" && previewUrl && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
