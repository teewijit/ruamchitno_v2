import React from 'react'
import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
        <div className="space-y-6">
            {/* Similar skeleton structure as before, but with more fields */}
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-12 md:col-span-6 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            {/* More skeleton placeholders for additional fields */}
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-12 md:col-span-4 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-12 md:col-span-4 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            <Skeleton className="h-10 w-full" />
        </div>
  )
}

export default Loading
