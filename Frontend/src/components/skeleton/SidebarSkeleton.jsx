import { Users } from 'lucide-react';
import React from 'react'

export default function SidebarSkeleton() {
  const skeletonContacts = Array(8).fill(null);
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Headers */}
      <div className="border-b boredr-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6"  />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Skeleton contacts */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((items,i)=>(
          <div key={i} className="w-full p-3 flex items-center gap-3">

            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeletonsize-12 rounded-full"/>
            </div>

            {/* User info skeleton - only visible on large screen */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          
          </div>
        ))}
      </div>
    </aside>
  )
}
