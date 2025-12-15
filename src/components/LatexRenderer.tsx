import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

interface LatexRendererProps {
  children: string;
}

export default function LatexRenderer({ children }: LatexRendererProps) {
  return (
    <span className="latex-content">
      <Latex>{children}</Latex>
    </span>
  );
}
