import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import ResponseLoader from "./response-loader";

const TabLoader = () => {
  return (
    <div>
      <div className="p-5 relative">
        <div className="flex items-center justify-between">
          <div className="text-sm flex items-center gap-2">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="flex items-center w-24 h-10" />
        </div>

        <div className="mt-6">
          <div className="grid w-full gap-1.5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-32" />
            </div>
          </div>

          <div className="mt-4 gap-5 flex overflow-x-auto overflow-y-hidden pb-4 border-b border-gray-200 whitespace-nowrap dark:border-gray-700">
            <Skeleton className={`h-8 w-32`} />
            <Skeleton className={`h-8 w-32`} />
            <Skeleton className={`h-8 w-32`} />
            <Skeleton className={`h-8 w-32`} />
          </div>

          <div className="grid w-full gap-1.5 my-6">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
      <Separator className="mt-8" />
      <ResponseLoader />
    </div>
  );
};

export default TabLoader;
