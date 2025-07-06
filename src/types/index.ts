export const ItemTypes = {
    HEADING: 'heading',
    PARAGRAPH: 'paragraph',
    BUTTON: 'button',
    IMAGE: 'image',
  };
  
  export interface CanvasComponent {
    id: number;
    type: string;
    content: string;
  }