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
    return (
        <div>
            <div className={`notification ${type}`} id={id} onClick={onClick}>
                <div className="notificationClose" onClick={onRequestHide}>X</div>
                <div className="notificationTitle">{title}</div>
                <div className="notificationMessage">{message}</div>
            </div>
        </div>
    );
};

export default NotificationComponent;