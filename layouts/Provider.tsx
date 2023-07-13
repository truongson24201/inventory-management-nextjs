import { ActiveNavProvider } from "@/utils/hooks/useActiveNav"
import { LoadingProvider } from "@/utils/hooks/useLoadingAnimation"
import { NotificationProvider } from "@/utils/hooks/useNotification"
import { PopupProvider } from "@/utils/hooks/usePopup"

interface IProviderProps {
    children: React.ReactNode
}

export default function Provider({
    children
}: IProviderProps) {
    return (
        <PopupProvider>
        <NotificationProvider>
        <LoadingProvider>
        <ActiveNavProvider>
            {children}
        </ActiveNavProvider>
        </LoadingProvider>
        </NotificationProvider>
        </PopupProvider>
    )
}