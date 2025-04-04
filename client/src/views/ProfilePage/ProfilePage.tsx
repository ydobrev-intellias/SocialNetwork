import { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Edit, Trash2, UserPlus, UserMinus } from 'lucide-react';
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
  followUser,
  unfollowUser,
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
import { Contact, Role, User } from '@/types/user';
import { Follow } from '@/types/follow';
import UserProfileLink from '@/components/user/UserProfileLink';

export default function ProfilePage() {
  const { user: authUser, isAdmin } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<User>();

  const { userId } = useParams<{ userId?: string }>();
  const isOwnProfile = authUser?.id === user?.id;
  const dispatch = useDispatch<AppDispatch>();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const navigate = useNavigate();
  const [newContact, setNewContact] = useState<{
    id?: string;
    user?: User;
    type: string;
    value: string;
  }>({
    type: '',
    value: '',
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);

  const handleDeleteProfile = async () => {
    await dispatch(deleteUser(isAdmin ? { userId } : {}));
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

      await getUserProfile();
    }
  };

  useEffect(() => {
    if (isEditingProfile && user) {
      setFormData({ username: user.username, email: user.email });
    }
    getUserProfile();
  }, [userId, isEditingProfile, setUser]);

  const getUserProfile = async () => {
    try {
      const response = await dispatch(getProfile({ userId })).unwrap();
      setUser(response?.data);

      if (response?.data && authUser) {
        setIsFollowing(
          response.data.followers?.some((follow: Follow) => follow.follower?.id === authUser.id) ||
            false,
        );
      }
    } catch (error) {
      navigate('/');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      updateProfile(isAdmin ? { profileData: formData, userId } : { profileData: formData }),
    );
    setIsEditingProfile(false);
    getUserProfile();
  };

  const createContactHandler = async () => {
    if (newContact.type && newContact.value) {
      await dispatch(createContact(newContact));
      setNewContact({ type: '', value: '' });
      setShowForm(false);
      getUserProfile();
    }
  };

  const updateContactHandler = async () => {
    await dispatch(updateContact(newContact));
    setNewContact({ type: '', value: '' });
    setIsEditingContact(false);
    getUserProfile();
  };

  const deleteContactHandler = async (contactId: string) => {
    await dispatch(deleteContact(contactId));
    getUserProfile();
  };

  const handleFollowUser = async () => {
    if (!user?.id) return;
    try {
      await dispatch(followUser(user.id)).unwrap();
      setIsFollowing(true);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              followers: [...(prev.followers || []), { id: authUser?.id, follower: authUser }],
            }
          : prev,
      );
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollowUser = async () => {
    if (!user?.id) return;
    try {
      await dispatch(unfollowUser(user.id)).unwrap();
      setIsFollowing(false);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              followers: (prev.followers || [])?.filter(
                (follow: Follow) => follow?.follower?.id !== authUser?.id,
              ),
            }
          : prev,
      );
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
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
            <AvatarFallback>{user?.username?.[0]?.toLocaleUpperCase() || '?'}</AvatarFallback>
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

        {!isOwnProfile && authUser && (
          <div className="ml-auto mt-4">
            {isFollowing ? (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleUnfollowUser}
              >
                <UserMinus size={16} />
                Unfollow
              </Button>
            ) : (
              <Button className="flex items-center gap-2" onClick={handleFollowUser}>
                <UserPlus size={16} />
                Follow
              </Button>
            )}
          </div>
        )}
      </div>

      <CardContent className="mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{user?.username}</h2>
            <p className="text-gray-500">{user?.email}</p>
            {user?.role === Role.ADMIN && <p className="text-gray-400">Administrator</p>}
          </div>

          <div className="flex gap-6 text-center">
            <div
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
              onClick={() => setFollowersModalOpen(true)}
            >
              <p className="font-semibold text-lg">{user?.followers?.length || 0}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
              onClick={() => setFollowingModalOpen(true)}
            >
              <p className="font-semibold text-lg">{user?.following?.length || 0}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {user?.contacts?.map((contact: Contact, index: number) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <p className="text-gray-500">
                <strong>{contact.type}:</strong> {contact.value}
              </p>
              {isOwnProfile && (
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setNewContact({ id: contact.id, type: contact.type, value: contact.value });
                      setIsEditingContact(true);
                      setShowForm(true);
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
        {(isOwnProfile || isAdmin) && (
          <>
            {isOwnProfile && (
              <div>
                <Button
                  className="mt-4"
                  onClick={() => {
                    setShowForm((prev) => !prev);
                    setIsEditingContact(false);
                    setNewContact({ type: '', value: '' });
                  }}
                >
                  {showForm ? 'Cancel' : '+ Add Contact'}
                </Button>

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

                    <Button
                      onClick={isEditingContact ? updateContactHandler : createContactHandler}
                    >
                      {isEditingContact ? 'Update Contact' : 'Add Contact'}
                    </Button>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex gap-4">
              <Button onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
              <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
                Delete Profile
              </Button>
            </div>
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

      <Dialog open={followersModalOpen} onOpenChange={setFollowersModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto py-4">
            {user?.followers?.length ? (
              user.followers.map(
                (follow: Follow) =>
                  follow.follower && (
                    <div
                      key={follow.id}
                      className="mb-2"
                      onClick={() => setFollowersModalOpen(false)}
                    >
                      <UserProfileLink user={follow.follower} />
                    </div>
                  ),
              )
            ) : (
              <p className="text-center text-gray-500 py-4">No followers yet</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={followingModalOpen} onOpenChange={setFollowingModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto py-4">
            {user?.following?.length ? (
              user.following.map(
                (follow: Follow) =>
                  follow.following && (
                    <div
                      key={follow.id}
                      className="mb-2"
                      onClick={() => setFollowingModalOpen(false)}
                    >
                      <UserProfileLink user={follow.following} />
                    </div>
                  ),
              )
            ) : (
              <p className="text-center text-gray-500 py-4">Not following anyone yet</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {(isOwnProfile || isAdmin) && isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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

              <div className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
