import { useState } from "react";
import { Sidebar } from "./components/editor/Sidebar";
import { Canvas } from "./components/editor/Canvas";
import type { CanvasComponent } from "./types";
import { ItemTypes } from "./types";

function App() {
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>(
    []
  );

  const handleDrop = (type: string) => {
    let content = "Some default text";
    if (type === ItemTypes.HEADING) content = "New Heading";
    if (type === ItemTypes.BUTTON) content = "Click me";
    if (type === ItemTypes.IMAGE) content = "https://placehold.co/600x400";

    const newComponent: CanvasComponent = {
      id: new Date().getTime(),
      type: type,
      content: content,
    };
    setCanvasComponents((prev) => [...prev, newComponent]);
  };

  const updateComponentContent = (id: number, newContent: string) => {
    setCanvasComponents((prev) =>
      prev.map((component) =>
        component.id === id ? { ...component, content: newContent } : component
      )
    );
  };

  // --- NOVA FUNÇÃO AQUI ---
  const removeComponent = (id: number) => {
    setCanvasComponents((prev) =>
      prev.filter((component) => component.id !== id)
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Canvas
        components={canvasComponents}
        onDrop={handleDrop}
        updateComponentContent={updateComponentContent}
        // --- PASSE A NOVA FUNÇÃO COMO PROP ---
        removeComponent={removeComponent}
      />
    </div>
  );
}

export default App;
