import { Skeleton } from "../ui/skeleton";

const ResponseLoader = () => {
  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <Skeleton className=" h-4 w-24" />
        <div className="flex items-center text-[10px] font-semibold gap-2 text-gray-500">
          <Skeleton className=" h-2 w-10" />
          <Skeleton className=" h-2 w-10" />
          <Skeleton className=" h-2 w-10" />
          <Skeleton className=" h-2 w-10" />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <Skeleton className="h-20 rounded-md bg-secondary text-sm" />
        <Skeleton className="h-20 rounded-md bg-secondary text-sm" />
      </div>
    </div>
  );
};

export default ResponseLoader;
