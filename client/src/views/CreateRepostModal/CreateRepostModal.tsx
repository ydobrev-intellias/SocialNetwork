import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createRepost, updatePost } from '@/redux/slices/postSlice';
import { Post, PostData, PostPrivacy } from '@/types/post';
import { Mode } from '@/types/common';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrUpdateRepost: (post: Partial<Post>) => void;
  originalPostId: string;
  mode: Mode;
  postData?: Omit<PostData, 'image'>;
  isRepost?: boolean;
}

export default function CreateRepostModal({
  isOpen,
  onClose,
  onCreateOrUpdateRepost,
  originalPostId,
  mode,
  postData,
}: CreatePostModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [content, setContent] = useState(postData?.content || '');
  const [privacy, setPrivacy] = useState<PostPrivacy>(postData?.privacy || PostPrivacy.PUBLIC);

  useEffect(() => {
    console.log('REPOST DATA', postData);
    if (isOpen) {
      setContent(mode === Mode.UPDATE ? postData?.content || '' : '');
      setPrivacy(
        mode === Mode.UPDATE ? postData?.privacy || PostPrivacy.PUBLIC : PostPrivacy.PUBLIC,
      );
    }
  }, [isOpen, mode, postData]);

  const handleSubmit = async () => {
    const data = { content, privacy };

    if (mode === Mode.CREATE) {
      await dispatch(createRepost({ postId: originalPostId, repostData: data }));
    } else if (mode === Mode.UPDATE && postData?.id) {
      await dispatch(updatePost({ postId: postData.id, data }));
    }

    onCreateOrUpdateRepost(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === Mode.CREATE ? 'Create Repost' : 'Edit Repost'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />

          <div>
            <label htmlFor="privacy" className="block text-sm font-medium text-gray-700">
              Privacy
            </label>
            <select
              id="privacy"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as PostPrivacy)}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {mode === Mode.CREATE ? 'Create Repost' : 'Update Repost'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
