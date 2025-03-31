import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Edit, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { API_USERS_URL } from '@/config';
import {
  createContact,
  deleteContact,
  deleteUser,
  getProfile,
  updateContact,
  updateProfile,
  uploadImage,
} from '@/redux/slices/authSlice';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProfilePage() {
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<any>();

  const { userId } = useParams<{ userId?: string }>();
  console.info(user, userId);
  const isOwnProfile = authUser?.id === user?.id;
  const dispatch = useDispatch<AppDispatch>();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState(user?.contacts || []);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const navigate = useNavigate();
  const [newContact, setNewContact] = useState({ type: '', value: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteProfile = async () => {
    await dispatch(deleteUser({}));
    setIsDeleteModalOpen(false);
    navigate('/');
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover',
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      await dispatch(uploadImage({ file, type }));
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [userId]);

  const getUserProfile = async () => {
    try {
      const response = await dispatch(getProfile({ userId })).unwrap();
      console.log('Profile fetched:', response?.data);
      setUser(response?.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updateProfile({ profileData: formData }));
    setIsEditingProfile(false);
  };

  const createContactHandler = async () => {
    console.info(newContact);
    if (newContact.type && newContact.value) {
      await dispatch(createContact(newContact));
      setNewContact({ type: '', value: '' });
    }
  };

  const updateContactHandler = async (e: any) => {
    await dispatch(updateContact(newContact));
    setNewContact({ type: '', value: '' });
  };

  const deleteContactHandler = async (contactId: string) => {
    await dispatch(deleteContact(contactId));
    const updatedContacts = contacts.filter((contact: any) => contact.id !== contactId);
    setContacts(updatedContacts);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10">
      <div className="relative bottom-[-10px] h-48 w-full bg-gray-200 rounded-lg overflow-hidden">
        {user?.coverPath && (
          <img
            src={user?.coverPath ? `${API_USERS_URL}${user.coverPath}` : undefined}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        {isOwnProfile && (
          <label className="absolute bottom-5 right-3 bg-black/50 text-white p-2 rounded-full cursor-pointer">
            <Camera className="h-5 w-5" />
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'cover')}
            />
          </label>
        )}
      </div>

      <div className="flex">
        <div className="relative left-10 bottom-5">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage
              className="object-cover"
              src={user?.avatarPath ? `${API_USERS_URL}${user.avatarPath}` : undefined}
            />
            <AvatarFallback>{user?.username[0].toLocaleUpperCase()}</AvatarFallback>
          </Avatar>
          {isOwnProfile && (
            <label className="absolute bottom-0 right-0 bg-black/50 text-white p-2 rounded-full cursor-pointer">
              <Camera className="h-5 w-5" />
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'avatar')}
              />
            </label>
          )}
        </div>
      </div>
      <CardContent className="mt-4">
        <h2 className="text-xl font-semibold">{user?.username}</h2>
        <p className="text-gray-500">{user?.email}</p>
        <div className="mt-4">
          {contacts?.map((contact: any, index: number) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <p className="text-gray-500">
                <strong>{contact.type}:</strong> {contact.value}
              </p>
              {isOwnProfile && (
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setNewContact({ type: contact.type, value: contact.value });
                    }}
                    className="p-2"
                  >
                    <Edit size={18} />
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => deleteContactHandler(contact.id)}
                    className="p-2"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        {isOwnProfile && (
          <>
            {' '}
            <div>
              <Button onClick={() => setShowForm((prev) => !prev)}>+</Button>

              {showForm && (
                <div className="mt-4 flex items-center gap-4">
                  <Select
                    value={newContact.type}
                    onValueChange={(value) => setNewContact({ ...newContact, type: value })}
                    aria-label="Contact Type"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="text"
                    placeholder="Contact Value"
                    maxLength={20}
                    value={newContact.value}
                    onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                  />

                  <Button onClick={isEditingContact ? updateContactHandler : createContactHandler}>
                    {isEditingContact ? 'Update Contact' : 'Add Contact'}
                  </Button>
                </div>
              )}
            </div>
            <Button className="mt-4 mr-5" onClick={() => setIsEditingProfile(true)}>
              Edit Profile
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Profile
            </Button>
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-500">
                  This action cannot be undone. Your account will be permanently deleted.
                </p>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteProfile}>
                    Yes, Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>

      {isOwnProfile && isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <Button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                  })
                }
              >
                Add Contact
              </Button>

              <div className="mt-4 flex justify-end">
                <Button type="submit">Save Changes</Button>
                <Button type="button" className="ml-2" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
