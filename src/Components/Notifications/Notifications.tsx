import { createRef, useRef } from "react";
import NotificationComponent, { NotificationProps } from "./Notification"
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./NotificationStyles.css"

export type NotificationsProps = {
    notifications: NotificationProps[],
    onRequestHide: (notificationId: string) => void
}

export const Notifications: React.FC<NotificationsProps> = ({notifications, onRequestHide}: NotificationsProps) => {
    const items = notifications.map((notification) => {
        const nodeRef = createRef<HTMLDivElement>();
        const key = notification.id || new Date().getTime().toString();
        
        return (
            <CSSTransition
                in={true}
                key={key}
                timeout={{enter: 300, exit: 300}}
                classNames="notification"
                nodeRef={nodeRef}
            >
                <NotificationComponent notificationRef={nodeRef} key={notification.id} {...notification} onRequestHide={() => onRequestHide(notification.id)} />
            </CSSTransition>
        );
    });

    return (
        <div className="notifications">
            <TransitionGroup>
                {items}
            </TransitionGroup>
        </div>
    )
};