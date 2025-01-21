import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Repeat, Image as ImageIcon, FolderClosed } from "lucide-react";

const history = [
  {
    date: "7/10/23, 12:00 PM",
    type: "image",
    action: "IMAGE GENERATION",
    request: "123456",
  },
  {
    date: "7/10/23, 12:00 PM",
    type: "llm",
    action: "CHAT COMPLETION",
    request: "123456",
  },
  {
    date: "7/10/23, 12:00 PM",
    type: "folder",
    action: "NEW FOLDER",
    request: "123456",
  },
];

const History = () => {
  return (
    <div className="flex justify-center p-5 max-w-screen-lg container mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="text-right">Request</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm text-secondary-foreground">
          {history.map((history) => (
            <TableRow key={history.request}>
              <TableCell>{history.date}</TableCell>
              <TableCell className="text-center">
                {history.type === "image" ? (
                  <ImageIcon className="w-5 h-5" />
                ) : history.type === "llm" ? (
                  <Repeat className="w-5 h-5" />
                ) : history.type === "folder" ? (
                  <FolderClosed className="w-5 h-5" />
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell className="capitalize">{history.action}</TableCell>
              <TableCell className="text-right cursor-pointer underline">
                {history.request}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default History;
