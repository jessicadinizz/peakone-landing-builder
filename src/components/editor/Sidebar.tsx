import { Heading } from "../elements/Heading";
import { Paragraph } from "../elements/Paragraph";
import { Button } from "../elements/Button";
import { Image } from "../elements/Image";

export function Sidebar() {
  return (
    <aside
      style={{ width: "250px", borderRight: "1px solid #ccc", padding: "1rem" }}
    >
      <h3>Componentes</h3>
      <p>Arraste um item para a página.</p>
      <hr style={{ margin: "1rem 0" }} />

      <Heading />
      <Paragraph />
      <Button />
      <Image />
    </aside>
  );
}
