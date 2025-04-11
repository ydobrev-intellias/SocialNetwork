import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '@/types/user';
import UserProfileLink from '@/components/user/UserProfileLink';
import axios from 'axios';
import { API_USERS_URL } from '@/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Send, Trash2 } from 'lucide-react';
import { messageActions } from '@/redux/slices/messageSlice';

const Messages = () => {
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => state.message.messages);
  const { user } = useSelector((state: RootState) => state.auth);
  const [recipientId, setRecipientId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');

  const handleSend = () => {
    if (user && messageText.trim())
      dispatch(
        messageActions.sendMessage({
          senderId: user?.id,
          receiverId: recipientId,
          content: messageText,
          timestamp: new Date(),
        }),
      );
    setMessageText('');
  };

  const handleDelete = (messageId: string) => {
    dispatch(messageActions.deleteMessage({ messageId }));
  };

  const handleEdit = (msgId: string, currentText: string) => {
    setEditingMessageId(msgId);
    setEditedText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedText('');
  };

  const handleUpdate = (msgId: string) => {
    if (editedText.trim()) {
      dispatch(messageActions.updateMessage({ messageId: msgId, newContent: editedText }));
      setEditingMessageId(null);
      setEditedText('');
    }
  };

  const selectedUser = users.find((u) => u.id === recipientId);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_USERS_URL}/`, {
        withCredentials: true,
      });
      const filteredUsers = response.data.filter((u: User) => u.id !== user?.id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [user?.id]);

  useEffect(() => {
    if (selectedUser) dispatch(messageActions.getMessages({ receiverId: selectedUser.id }));
  }, [dispatch, selectedUser?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <CardHeader className="border-b py-3">
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <div className="flex h-[calc(100vh-200px)]">
        <div className="w-1/3 border-r">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-2">
              {users.length > 0 ? (
                users.map((u) => (
                  <Card
                    key={u.id}
                    className={`cursor-pointer hover:bg-gray-100 transition-colors ${
                      u.id === recipientId ? 'bg-gray-100 border-primary' : ''
                    }`}
                    onClick={() => setRecipientId(u.id)}
                  >
                    <CardContent className="p-3">
                      <UserProfileLink user={u} withLink={false} />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">Loading users...</div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-3 border-b bg-white">
                <UserProfileLink user={selectedUser} withLink={true} />
              </div>

              <ScrollArea className="flex-1 p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg) => {
                      const isCurrentUser = msg.senderId === user?.id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`flex gap-2 max-w-xs ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                          >
                            {!isCurrentUser && (
                              <div className="mt-1">
                                <UserProfileLink
                                  user={selectedUser}
                                  withLink={true}
                                  withName={false}
                                />
                              </div>
                            )}

                            <div className="relative rounded-lg p-3 bg-white shadow-sm border">
                              {editingMessageId === msg.id ? (
                                <div className="space-y-2">
                                  <Textarea
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    rows={2}
                                    className="resize-none"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={handleCancelEdit}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => msg.id && handleUpdate(msg.id)}
                                    >
                                      Update
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="break-words">{msg.content}</p>
                                  <p
                                    className={`text-xs ${
                                      isCurrentUser ? 'text-gray-500' : 'text-gray-500'
                                    } text-right mt-1`}
                                  >
                                    {new Date(msg.timestamp!).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </>
                              )}
                            </div>

                            {isCurrentUser && !editingMessageId && (
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => msg.id && handleEdit(msg.id, msg.content)}
                                  className="text-blue-500 hover:text-blue-600 p-1"
                                  title="Edit message"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => msg.id && handleDelete(msg.id)}
                                  className="text-red-500 hover:text-red-600 p-1"
                                  title="Delete message"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No messages yet. Start a conversation!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-3 border-t bg-white">
                <div className="flex gap-2">
                  <Textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 resize-none"
                    rows={1}
                  />
                  <Button onClick={handleSend} disabled={!messageText.trim()} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-4 bg-gray-50">
              <div>
                <h3 className="text-xl font-medium text-gray-700">Select a conversation</h3>
                <p className="text-gray-500 mt-2">Choose a user from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
