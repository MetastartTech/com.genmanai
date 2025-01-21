import { Skeleton } from "../ui/skeleton";

const SidebarLoader = () => {
  return (
    <div className={`space-y-4 py-4 col-span-3 border-l`}>
      <div className="px-3 py-2 flex flex-col h-[calc(100vh-65px)]">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-full mr-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8"></Skeleton>
            <Skeleton className="h-8 w-8"></Skeleton>
          </div>
        </div>
        <Skeleton className="h-10 mb-2"></Skeleton>
        <div className={`space-y-4 overflow-y-auto pb-10 mt-5`}>
          <Skeleton className="h-6"></Skeleton>
          <Skeleton className="h-6"></Skeleton>
          <Skeleton className="h-6"></Skeleton>
          <Skeleton className="h-6"></Skeleton>
          <Skeleton className="h-6"></Skeleton>
        </div>
      </div>
    </div>
  );
};

export default SidebarLoader;
