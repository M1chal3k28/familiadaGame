import { createRef } from "react";
import NotificationComponent, { NotificationProps } from "./Notification"
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./NotificationStyles.css"
import { ANIMATION_DURATION } from "./AnimationDuration";

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
                timeout={{enter: ANIMATION_DURATION, exit: ANIMATION_DURATION}}
                classNames="notification"
                nodeRef={nodeRef}
                unmountOnExit
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