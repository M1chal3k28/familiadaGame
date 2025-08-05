import NotificationComponent, { NotificationProps } from "./Notification"

export type NotificationsProps = {
    notifications: NotificationProps[],
    onRequestHide: (notificationId: string) => void
}

export const Notifications: React.FC<NotificationsProps> = ({notifications, onRequestHide}: NotificationsProps) => {
    return (
        <div className="notifications">
            {notifications.map((notification) => (
                <NotificationComponent key={notification.id} {...notification} onRequestHide={() => onRequestHide(notification.id)} />
            ))}
        </div>
    )
};