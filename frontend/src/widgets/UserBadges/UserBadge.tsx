"use client"

import { useProfile } from "@/shared/auth/hooks"
import { useTodosQuery } from "@/features/todo/hooks"
import { UserButton } from "@/features/user/components"

export function UserBadge() {
  const { data: user, isLoading: isProfileLoading } = useProfile()
  const { isLoading: isTodosLoading } = useTodosQuery()

  const ready = !isProfileLoading && !isTodosLoading && !!user

  return (
    <div className="absolute top-[0vh] right-0 z-50 h-10 w-10">
      <div
        className={`transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        {ready && <UserButton user={user} />}
      </div>
    </div>
  )
}
