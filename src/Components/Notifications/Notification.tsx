
import { useEffect, useRef } from "react";

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
    onRequestHide?: () => void,
    notificationRef?: React.RefObject<HTMLDivElement | null>
};

export const NotificationComponent: React.FC<NotificationProps> = ({id, type, title, message, timeOut, onClick, onRequestHide, notificationRef}: NotificationProps) => {
    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const remainingTimeRef = useRef<number>(timeOut);

    const notificationProgress = useRef<HTMLDivElement | null>(null);

    // const notificationContainer = useRef<HTMLDivElement | null>(null);
    const fullWidthRef = useRef<number>(0);

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        stopProgress();
    };

    const startTimer = (delay: number) => {
        clearTimer();
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(requestHide, delay);
        startProgress();
    };

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

    const handleOnMouseEnter = () => {
        if (timeOut === 0) return;
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
        clearTimer();
    };

    const handleOnMouseLeave = () => {
        if (timeOut === 0) return;
        startTimer(remainingTimeRef.current);
    };

    const startProgress = () => {
        if (notificationProgress.current) {
            fullWidthRef.current = notificationRef!.current?.offsetWidth!;

            notificationProgress.current.style.transition = `width ${remainingTimeRef.current}ms linear`;
            notificationProgress.current.style.width = `${fullWidthRef.current}px`;
        }
    };

    const stopProgress = () => {
        if (notificationProgress.current) {
            const progressWidth = fullWidthRef.current * ((timeOut - remainingTimeRef.current) / timeOut);

            notificationProgress.current.style.transition = '';
            notificationProgress.current.style.width = `${progressWidth}px`;
        }
    };

    useEffect(() => {
        if (timeOut !== 0) {
            startTimer(timeOut);
        }

        return () => {
            clearTimer
        };
    }, []);

    return (
        <div ref={notificationRef} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave} className={`notification ${type}`} id={id} onClick={handleClick}>
            <div className="notificationTitle">{title}</div>
            <div className="notificationMessage">{message}</div>
            <div ref={notificationProgress} className="notificationProgress w-0"></div>
        </div>
    );
};

export default NotificationComponent;