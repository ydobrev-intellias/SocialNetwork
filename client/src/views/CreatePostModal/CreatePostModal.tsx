import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { createPost, updatePost } from '@/redux/slices/postSlice';
import { API_POSTS_URL } from '@/config';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrUpdatePost: (post: any) => void;
  mode: 'create' | 'update';
  postData?: any;
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
  const [privacy, setPrivacy] = useState<'public' | 'private'>(postData?.privacy || 'public');

  const [file, setFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(postData?.image || null);

  console.log('PREVIEW', preview);
  useEffect(() => {
    console.log('POST DATA', postData);
    if (isOpen) {
      setContent(mode === 'update' ? postData?.content || '' : '');
      setPrivacy(mode === 'update' ? postData?.privacy || '' : '');
      setPreview(mode === 'update' ? postData?.mediaPath || null : null);
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

    if (mode === 'create') {
      await dispatch(createPost(data));
    } else if (mode === 'update' && postData?.id) {
      await dispatch(updatePost({ postId: postData.id, data }));
    }

    onCreateOrUpdatePost(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Post' : 'Edit Post'}</DialogTitle>
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
              onChange={(e) => setPrivacy(e.target.value as 'public' | 'private')}
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
              {mode === 'create' ? 'Create Post' : 'Update Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
