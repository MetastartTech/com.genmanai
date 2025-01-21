import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import SidebarLoader from "./sidebar-loader";
import TabLoader from "../dashboard/tab-loader";

const Loader = () => {
  return (
    <div>
      <div className="h-12 md:h-16 flex items-center justify-between px-4 md:px-8">
        <div>
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-10" />
        </div>
      </div>
      <Separator />
      <div className="flex overflow-x-hidden md:h-[calc(100vh-65px)] overflow-y-hidden">
        <div className={`hidden md:grid shrink-0 w-96 grid-cols-4`}>
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className="space-y-3">
                <Skeleton className={`py-2 h-16 w-full rounded-md`}>
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <Skeleton className="h-[0.8rem] w-[0.8rem] shrink-0" />
                  </div>
                </Skeleton>
                <Skeleton className={`py-2 h-16 w-full rounded-md`}>
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <Skeleton className="h-[0.8rem] w-[0.8rem] shrink-0" />
                  </div>
                </Skeleton>
                <Skeleton className={`py-2 h-16 w-full rounded-md`}>
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <Skeleton className="h-[0.8rem] w-[0.8rem] shrink-0" />
                  </div>
                </Skeleton>
                <Skeleton className={`py-2 h-16 w-full rounded-md`}>
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <Skeleton className="h-[0.8rem] w-[0.8rem] shrink-0" />
                  </div>
                </Skeleton>
              </div>
            </div>
          </div>
          <SidebarLoader />
        </div>
        <div className="h-full w-full overflow-x-auto border-l">
          <div className="flex gap-2 my-2 ml-5">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Separator />
          <div>
            <TabLoader />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
