import { useEffect, useRef, useState } from "react";
import { notificationManager } from "./NotificationManager"
import { NotificationProps } from "./Notification";
import { Notifications } from "./Notifications";
import clsx from "clsx";
import { ANIMATION_DURATION } from "./AnimationDuration";

const NotificationContainer: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);

    const timerRef = useRef<number | null>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    // Subscribe to notifications and update the state to reflect the new notifications
    useEffect(() => {
        const unsubscribe = notificationManager.subscribe((notifications) => {
            setNotifications(() => notifications);
            
            // Handle empty state
            if (timerRef.current) clearTimeout(timerRef.current);
            if (notifications.length > 0) {
                setIsEmpty(false);
            } else { 
                timerRef.current = setTimeout(() => setIsEmpty(true), ANIMATION_DURATION + 50);
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const onRequestHide = (notificationId: string) => {
        notificationManager.remove(notificationId);
    };

    return (
            <div className={clsx("fixed top-0 right-0 w-1/3 z-50", { 'hidden': isEmpty })}>
                <Notifications notifications={notifications} onRequestHide={onRequestHide}/>
            </div>
    );
}

export default NotificationContainer;