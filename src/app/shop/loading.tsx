import { SiteHeader } from '@/components/SiteHeader'

// Skeleton shown while the catalog server component streams. <200ms perceived.
export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-12 pt-24">
        <div className="mb-6 h-10 w-40 animate-pulse rounded bg-paper-sink" />
        <div className="mb-8 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-11 w-28 animate-pulse rounded-full bg-paper-sink" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[4/3] w-full animate-pulse rounded-lens bg-paper-sink" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-paper-sink" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-paper-sink" />
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
