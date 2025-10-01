'use client'
import { usePathname } from "next/navigation"

export default function NotFound() {
    const pathName = usePathname();
  return (
    <div>not-found</div>
  )
}
