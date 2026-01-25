import { useEffect, useState } from "react";
import API from "../Services/api";
import { getUser } from "../utils/Auth";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const user = getUser();

  useEffect(() => {
    if (!user?.id) return;

    API.get(`/notifications/user/${user.id}`)
      .then(res => {
        setNotifications(res.data || []);
      })
      .catch(err => {
        console.error("Failed to load notifications", err);
      });
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n =>
        n.id === id ? {...n, read: true} : n
      ));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  return (
    <div className="notification-bell">
      <button onClick={() => setShowDropdown(!showDropdown)}>
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                <p>{n.message}</p>
                <small>{new Date(n.createdAt).toLocaleString()}</small>
                {!n.read && <button onClick={() => markAsRead(n.id)}>Mark as Read</button>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
