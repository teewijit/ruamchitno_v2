"use client"

import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function Loading() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2 space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="col-span-10 space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            <div className="space-y-2">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2 space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="col-span-5 space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="col-span-5 space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            <div className="space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-6 w-6" />
                </div>
            </div>

            <Skeleton className="h-10 w-full" />
        </div>
    )
}

export default Loading
