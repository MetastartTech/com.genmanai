import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ImageAlert = () => {
  return (
    <Alert variant='destructive'>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Images are only available for 1 hour after generation
      </AlertDescription>
    </Alert>
  );
};

export default ImageAlert;
