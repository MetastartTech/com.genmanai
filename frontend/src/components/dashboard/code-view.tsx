import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Code2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import {
  openai as openaiCode,
  anthropic as anthropicCode,
  gemini as geminiCode,
} from "@/constants/llm-code";
import { useState } from "react";

interface CodeViewerProps {
  llm: "openai" | "anthropic" | "gemini";
  model: string;
  system: string;
  user: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({
  llm,
  model,
  system,
  user,
}) => {
  const [tab, setTab] = useState<"python" | "nodejs">("python");

  const codeMap = {
    openai: {
      python: openaiCode.OPENAI_PYTHON(model, system, user),
      nodejs: openaiCode.OPENAI_NODE(model, system, user),
    },
    anthropic: {
      python: anthropicCode.ANTHROPIC_PYTHON(model, system, user),
      nodejs: anthropicCode.ANTHROPIC_NODE(model, system, user),
    },
    gemini: {
      python: geminiCode.GEMINI_PYTHON(model, system, user),
      nodejs: geminiCode.GEMINI_NODE(model, system, user),
    },
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          View Code <Code2 className="h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>View code</DialogTitle>
          <DialogDescription>
            You can use the following code to start integrating your current
            prompt and settings into your application.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="python">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger
              value="python"
              onClick={() => {
                setTab("python");
              }}
            >
              python
            </TabsTrigger>
            <TabsTrigger
              value="nodejs"
              onClick={() => {
                setTab("nodejs");
              }}
            >
              nodejs
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="h-[350px] overflow-y-auto">
          <Markdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    PreTag="div"
                    language={match[1]}
                    style={vscDarkPlus}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {codeMap[llm][tab]}
          </Markdown>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeViewer;
