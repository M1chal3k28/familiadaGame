import { NotificationProps, NotificationType } from "./Notification";

const createUUID = () => {
    const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

    return pattern.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
    });
};

export const CHANGE_NOTIFICATION_EVENT = 'CHANGE_NOTIFICATION_EVENT';
export class NotificationManager {
  private eventTarget = new EventTarget();
  private notifications: NotificationProps[] = [];
    
  public constructor() {}

  public create = (notify: NotificationProps) => {
    if (notify.priority) {
      this.notifications = [notify, ...this.notifications];
    } else {
      this.notifications = [...this.notifications, notify];
    }
    this.emitChange();
  }


  public info = (message: string, title: string, timeOut: number, onClick: () => void, priority: boolean) => {
    this.create({
      id: createUUID(),
      type: NotificationType.INFO,
      message,
      title,
      timeOut,
      onClick,
      priority
    });
  }


  public success = (message: string, title: string, timeOut: number, onClick: () => void, priority: boolean) => {
    this.create({
      id: createUUID(),
      type: NotificationType.SUCCESS,
      message,
      title,
      timeOut,
      onClick,
      priority
    });
  }


  public warning = (message: string, title: string, timeOut: number, onClick: () => void, priority: boolean) => {
    this.create({
      id: createUUID(),
      type: NotificationType.WARNING,
      message,
      title,
      timeOut,
      onClick,
      priority
    });
  }


  public error = (message: string, title: string, timeOut: number, onClick: () => void, priority: boolean) => {
    this.create({
      id: createUUID(),
      type: NotificationType.ERROR,
      message,
      title,
      timeOut,
      onClick,
      priority
    });
  }


  public remove = (notificationId: string) => {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId);
    this.emitChange();
  }


  removeAll() {
    this.notifications.length = 0;
    this.emitChange();
  }


  emitChange() {
    this.eventTarget.dispatchEvent(new CustomEvent(CHANGE_NOTIFICATION_EVENT, { detail: this.notifications }));
  }

  public subscribe = (callback: (notifications: NotificationProps[]) => void) => {
    const handler = () => callback(this.notifications);
    this.eventTarget.addEventListener(CHANGE_NOTIFICATION_EVENT, handler);
    return () => this.eventTarget.removeEventListener(CHANGE_NOTIFICATION_EVENT, handler); // cleanup
  }
}

export const notificationManager = new NotificationManager();