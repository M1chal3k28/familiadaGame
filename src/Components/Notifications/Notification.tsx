import { useEffect, useState } from "react";

export enum NotificationType {
    INFO    = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR   = 'error'  
};

export type NotificationProps = {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timeOut: number;
    onClick?: () => void;
    priority?: boolean;
    onRequestHide?: () => void
};

export const NotificationComponent: React.FC<NotificationProps> = ({id, type, title, message, timeOut, onClick, priority, onRequestHide}: NotificationProps) => {
    const [timer, setTimer] = useState<number | undefined>(undefined);
    
    const requestHide = () => {
        if (onRequestHide) {
            onRequestHide();
        }
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        requestHide();
    };

    useEffect(() => {
        if (timeOut !== 0) {
            setTimer(setTimeout(requestHide, timeOut));
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);
    
    return (
        <div className={`notification ${type}`} id={id} onClick={handleClick}>
            <div className="notificationTitle">{title}</div>
            <div className="notificationMessage">{message}</div>
        </div>
    );
};

export default NotificationComponent;