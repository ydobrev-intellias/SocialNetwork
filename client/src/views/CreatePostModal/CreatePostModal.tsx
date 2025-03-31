import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createPost, updatePost } from '@/redux/slices/postSlice';
import { API_POSTS_URL } from '@/config';
import { Post, PostData, PostPrivacy } from '@/types/post';
import { Mode } from '@/types/common';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrUpdatePost: (post: Partial<Post>) => void;
  mode: Mode;
  postData?: PostData;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onCreateOrUpdatePost,
  mode,
  postData,
}: CreatePostModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [content, setContent] = useState(postData?.content || '');
  const [privacy, setPrivacy] = useState<PostPrivacy>(postData?.privacy || PostPrivacy.PUBLIC);

  const [file, setFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(postData?.image || null);

  useEffect(() => {
    if (isOpen) {
      setContent(mode === Mode.UPDATE ? postData?.content || '' : '');
      setPrivacy(
        mode === Mode.UPDATE ? postData?.privacy || PostPrivacy.PUBLIC : PostPrivacy.PUBLIC,
      );
      setPreview(mode === Mode.UPDATE ? postData?.mediaPath || null : null);
      setFile(undefined);
    }
  }, [isOpen, mode, postData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    const data = { content, file, privacy };

    if (mode === Mode.CREATE) {
      await dispatch(createPost(data));
    } else if (mode === Mode.UPDATE && postData?.id) {
      await dispatch(updatePost({ postId: postData.id, data }));
    }

    onCreateOrUpdatePost(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === Mode.CREATE ? 'Create Post' : 'Edit Post'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />

          {preview && (
            <div className="mt-2">
              <img
                src={file ? preview : `${API_POSTS_URL}${preview}`}
                alt="Preview"
                className="w-full max-h-60 object-contain rounded-md border"
              />
            </div>
          )}
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

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Upload File (Optional)
            </label>
            <input
              id="file"
              type="file"
              className="mt-2 p-2 border border-gray-300 rounded-md"
              accept="image/*"
              onChange={handleFileChange}
            />
            {file && <div className="mt-2 text-sm text-gray-500">Selected file: {file.name}</div>}
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {mode === Mode.CREATE ? 'Create Post' : 'Update Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
