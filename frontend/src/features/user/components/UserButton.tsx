import { LuLogOut } from 'react-icons/lu'

import { IUser } from '@/features/auth/types'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Skeleton
} from '@/shared/components/ui'

import { useLogoutMutation } from '../hooks'

interface UserButtonProps {
	user: IUser
}

export function UserButton({ user }: UserButtonProps) {
	const { logout, isLoadingLogout } = useLogoutMutation()

	if (!user) return null

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={user.picture} />
					<AvatarFallback>
						{user.displayName.slice(0, 1)}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-40' align='end'>
				<DropdownMenuItem
					disabled={isLoadingLogout}
					onClick={() => logout()}
				>
					<LuLogOut className='mr-2 size-4' />
					Выйти
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export function UserButtonLoading() {
	return <Skeleton className='h-10 w-10 rounded-full' />
}
