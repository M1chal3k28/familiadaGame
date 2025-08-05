import { useEffect, useState } from "react";
import { notificationManager } from "./NotificationManager"
import { NotificationProps } from "./Notification";
import { Notifications } from "./Notifications";

const NotificationContainer: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);

    // Subscribe to notifications and update the state to reflect the new notifications
    useEffect(() => {
        const unsubscribe = notificationManager.subscribe((notifications) => {
            setNotifications(() => notifications);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const addWarning = () => {
        notificationManager.warning("This is a warning", "warning", 1000, () => {}, true);
    };

    const addSuccess = () => {
        notificationManager.success("This is a success", "success", 1000, () => {}, true);
    };

    const addError = () => {
        notificationManager.error("This is an error", "error", 1000, () => {}, true);
    };

    const addInfo = () => {
        notificationManager.info("This is an info", "info", 1000, () => {}, true);
    };

    const onRequestHide = (notificationId: string) => {
        notificationManager.remove(notificationId);
    };

    return (
        <div className="fixed top-0 right-0 z-50">
            TESTING
            <button className="menuButton text-black" onClick={addInfo}>addInfo</button>
            <button className="menuButton text-black" onClick={addSuccess}>addSuccess</button>
            <button className="menuButton text-black" onClick={addWarning}>addWarning</button>
            <button className="menuButton text-black" onClick={addError}>addError</button>
            <h1>Notifications: {notifications.length}</h1>
            <Notifications notifications={notifications} onRequestHide={onRequestHide}/>
        </div>
    )
}

export default NotificationContainer;