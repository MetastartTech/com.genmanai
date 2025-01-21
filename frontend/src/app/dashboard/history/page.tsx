"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Repeat, Image as ImageIcon, FolderClosed } from "lucide-react";
import { get } from "@/api/history";
import useUser from "@/provider/userContext/useUserContext";
import { toast } from "sonner";

type THistory = {
  _id: string;
  timestamp: string;
  type: "llm_request" | "image_request" | "folder";
  action: string;
};

const formatDateString = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h12",
  });
};

const History = () => {
  const { idToken } = useUser();

  const [history, setHistory] = useState<THistory[]>([]);

  useEffect(() => {
    get(idToken ?? "")
      .then((data) => {
        const sortedHistory = data.sort((a: THistory, b: THistory) => {
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        });
        setHistory(sortedHistory);
      })
      .catch((e) => toast.error("Failed to fetch history"));
  }, [idToken]);

  return (
    <div className="flex justify-center p-5 max-w-screen-lg container mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm text-secondary-foreground">
          {history?.map((history) => (
            <TableRow key={history._id}>
              <TableCell>{formatDateString(history.timestamp)}</TableCell>
              <TableCell className="text-center">
                {history.type === "image_request" ? (
                  <ImageIcon className="w-5 h-5" />
                ) : history.type === "llm_request" ? (
                  <Repeat className="w-5 h-5" />
                ) : history.type === "folder" ? (
                  <FolderClosed className="w-5 h-5" />
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell className="capitalize">{history.action}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default History;
