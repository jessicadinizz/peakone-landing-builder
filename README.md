# Mini Page Builder - Coding Challenge Submission

This repository contains my submission for the coding challenge: a simplified drag-and-drop page builder. My aim was to create an intuitive and efficient tool for assembling basic landing pages from a predefined set of components.

---

### ✨ Key Features

I've successfully implemented all the Minimum Viable Product (MVP) requirements and further enhanced the application with several advanced features, detailed below.

#### Essential Requirements (MVP)

* **Drag & Drop Interface:** Components can be seamlessly dragged from a dedicated sidebar and dropped onto the central canvas area, serving as the primary design workspace.
* **Core Components:** The builder includes four fundamental component types: Heading, Paragraph, Button, and Image.
* **In-Place Content Editing:** Users can directly click and edit the text content of Heading, Paragraph, and Button components on the canvas. For image components, content (URL or uploaded file) can be modified via the properties panel.
* **Component Removal:** Individual component instances on the canvas can be easily removed using a dedicated delete button.
* **Responsive Editor UI:** The editor interface itself is designed to be responsive, ensuring optimal usability and adaptation across various screen sizes, including desktop, tablet, and mobile devices.

#### Advanced Features

* **Dynamic Properties Panel:** Selecting a component on the canvas triggers the display of a context-aware properties panel. This panel presents only the relevant editable attributes for the selected item, with all modifications reflecting in real-time. Editable properties include text color, font size, font weight, background color (for buttons), image URL, and button link.
* **Component Reordering:** Components on the canvas can be reordered through an intuitive drag-and-drop mechanism. A visual drop indicator line provides precise feedback on the insertion location, enhancing the user experience.
* **Local Persistence:** The entire page state (component structure and properties) is automatically saved to the browser's `localStorage`. This ensures that a user's work is preserved and automatically restored upon revisiting or reloading the application.
* **Full Touch Device Support:** The core drag-and-drop functionality is fully supported on mobile devices. This is achieved by leveraging `react-dnd-touch-backend` in conjunction with a custom drag layer, providing a smooth and native-like user experience across touch-enabled platforms.

---

### 🛠️ Technology Stack

* **Framework:** React
* **Language:** TypeScript
* **Drag and Drop:** `react-dnd`, utilizing both `react-dnd-html5-backend` for desktop interactions and `react-dnd-touch-backend` for mobile touch events.
* **Styling:** Pure CSS, structured with a modular layout approach.
* **Build Tool:** Vite

---

### 🏃 Getting Started / Local Setup

To clone and run this application on your local machine, please follow the instructions below:

```bash
# 1. Clone the repository
git clone [https://github.com/jessicadinizz/peakone-landing-builder](https://github.com/jessicadinizz/peakone-landing-builder)

# 2. Navigate to the project directory
cd peakone-landing-builder

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The application will then be accessible at `http://localhost:5173`.

-----

### 🧠 Challenges & Learnings

Developing this editor provided significant learning opportunities. Here are some key highlights:

* **The Challenge:** Implementing robust drag-and-drop functionality for mobile devices presented an interesting challenge, as the standard HTML5 backend for `react-dnd` does not inherently support touch events.
* **The Solution:** The resolution involved researching and integrating `react-dnd-touch-backend`. The application was configured to intelligently load the appropriate backend based on the user's device. Additionally, a `CustomDragLayer` component was developed to render the drag preview on mobile, ensuring a consistent user experience across platforms.
* **The Learning:** This project served as an excellent opportunity to engage with complex state management in React. Designing a flexible and extensible data structure for the components proved crucial. This architectural decision paid dividends, as adding new properties (such as a button's background color or its link URL) to the `PropertiesPanel` became a straightforward task, requiring no major refactoring. This experience underscored the importance of a well-architected state.

-----

### Conceptual Analysis: Comparison with Industry Editors

Despite being a prototype, this project shares fundamental principles with professional visual editors like **Gutenberg (from WordPress)** and **Elementor**.

#### Similarities:

* **Block/Component-Based Architecture:** The core concept is identical. Just as this project utilizes "components" (e.g., Heading, Image), Gutenberg operates with "blocks."
* **State and Attributes:** The React state, which manages the `content`, `styles`, and `link` for each component, is analogous to the `attributes` object found within a Gutenberg block.
* **Separation of Concerns:** The three-panel layout (component library, canvas, and properties inspector) represents an established User Experience (UX) pattern widely adopted by similar tools in the market.

#### Differences:

* **Scope & Complexity:** Professional tools offer a significantly broader scope, encompassing features like nested components, global styling options, and intricate responsive settings for the final output.
* **Data Persistence:** This prototype utilizes `localStorage` for data persistence, which is suitable for its scope. In contrast, platforms like WordPress rely on server-side databases for data storage.

#### How Skills From This Challenge Apply:

A developer who has successfully built this project is well-prepared to create custom blocks for platforms such as WordPress. The acquired skills are directly transferable:

1.  **Component-Based Thinking:** The ability to construct a self-contained, configurable React component forms the foundational skill for developing a Gutenberg block.
2.  **State Management:** The underlying logic of receiving attributes, rendering a component based on these attributes, and employing a callback mechanism to update them precisely mirrors the approach taken with React state and the `updateComponent` function in this project.

#### Future Considerations: Astro Framework

While not directly implemented in this prototype, the Astro framework presents a highly compelling option for generating the final constructed page. Its emphasis on delivering minimal JavaScript and producing fast, high-performance websites aligns perfectly with the objectives of a landing page builder. Astro's capability to render UI components from various frameworks (including React) during the build process could enable the interactive editor to be built with React, while the resulting static HTML for the landing page benefits from Astro's optimization. This approach effectively combines the advantages of both interactivity and performance.
