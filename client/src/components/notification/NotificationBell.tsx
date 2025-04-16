import { useEffect, useState } from 'react';
import { Bell, EyeOff, Trash2, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { Button } from '../ui/button';
import { notificationActions } from '@/redux/slices/notificationSlice';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';

export const NotificationBell = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications } = useSelector((state: RootState) => state.notification);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications]);

  const handleReadNotification = (id: string | undefined) => {
    if (id) {
      dispatch(notificationActions.notificationRead({ id }));
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full cursor-pointer"
      >
        <div className="relative">
          <Bell size={20} className={unreadCount > 0 ? 'text-blue-600' : 'text-gray-600'} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <p>Notifications</p>
      </button>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={closeModal} />

          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-96 max-h-[70vh] flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <h3 className="font-semibold text-gray-900">Notifications</h3>

                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-8 w-8 p-0 rounded-full hover:bg-red-50 flex-shrink-0"
                    onClick={() => {
                      dispatch(notificationActions.notificationReadAll());
                    }}
                  >
                    <EyeOff size={16} className="text-red-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-1 h-8 w-8 hover:bg-gray-200"
                    onClick={closeModal}
                  >
                    <X size={18} />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <div className="bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <Bell size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="w-full p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          navigate(`/posts/${notification.targetId}`);
                          closeModal();
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-gray-800 pr-2">{notification.content}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-8 w-8 p-0 rounded-full hover:bg-red-50 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReadNotification(notification.id);
                            }}
                          >
                            <Trash2 size={16} className="text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span>{format(notification?.eventTime, 'dd MMM yyyy, HH:mm')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
