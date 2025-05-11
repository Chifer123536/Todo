"use client";

import { LuLogOut, LuSettings2 } from "react-icons/lu";
import { useRouter, usePathname } from "next/navigation";

import { IUser } from "@/features/auth/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui";

import { useLogoutMutation } from "../hooks";

interface UserButtonProps {
  user: IUser;
}

export function UserButton({ user }: UserButtonProps) {
  const { logout, isLoadingLogout } = useLogoutMutation();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  const isSettingsPage = pathname === "/dashboard/settings";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.picture} />
          <AvatarFallback>{user.displayName.slice(0, 1)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="center"
        alignOffset={20}
        className="w-[10vw]"
      >
        {!isSettingsPage && (
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            <LuSettings2 className="pr-[1vw] h-[3vh] w-[2vw]" />
            Settings
          </DropdownMenuItem>
        )}
        <DropdownMenuItem disabled={isLoadingLogout} onClick={() => logout()}>
          <LuLogOut className="pr-[1vw] h-[3vh] w-[2vw]" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
