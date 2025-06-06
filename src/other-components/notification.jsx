import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 animate-fade-in-up ${
        notification.type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <div className="flex items-center">
        {notification.type === "success" ? (
          <FiCheckCircle className="mr-2" size={20} />
        ) : (
          <FiAlertCircle className="mr-2" size={20} />
        )}
        <span className="mr-4">{notification.message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-white hover:text-gray-200"
          aria-label="Close notification"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
