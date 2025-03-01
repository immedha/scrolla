import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProSubscription } from '../store/user/userSlice';
import { setPageStateInfoAction } from '../store/global/globalActions';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getCreatedApp } from '../firebaseConfig';

const UploadSection: FC = () => {
  const dispatch = useDispatch();
  const isProSubscription = useSelector(selectProSubscription);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    if (files.length > 5) {
      dispatch(setPageStateInfoAction({ 
        type: 'error', 
        message: 'Maximum 5 files allowed' 
      }));
      return;
    }

    try {
      setIsUploading(true);
      const storage = getStorage(getCreatedApp());
      
      const uploads = Array.from(files).map(async (file) => {
        const storageRef = ref(storage, `pdfs/${file.name}`);
        await uploadBytes(storageRef, file);
      });

      await Promise.all(uploads);
      
      dispatch(setPageStateInfoAction({ 
        type: 'success', 
        message: 'Files uploaded successfully' 
      }));
    } catch (error) {
      dispatch(setPageStateInfoAction({ 
        type: 'error', 
        message: 'Error uploading files' 
      }));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className={`relative w-full max-w-md transition-opacity ${isUploading ? 'opacity-50' : ''}`}>
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
            ${isUploading ? 'cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}`}
        >
          <div className="flex flex-col items-center">
            {isUploading ? (
              <span className="text-sm animate-pulse">Uploading...</span>
            ) : (
              <>
                <span className="text-sm">Upload max 5 pdfs</span>
                <span className="text-xs text-gray-500">Drop files here or click to upload</span>
              </>
            )}
          </div>
        </label>
      </div>
      
      {!isProSubscription && (
        <button 
          className="px-4 py-2 text-sm text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition-colors"
          disabled={isUploading}
        >
          premium web
        </button>
      )}
      
      <button 
        className={`w-full max-w-md px-4 py-2 text-white rounded-lg transition-colors
          ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        disabled={isUploading}
      >
        Generate reels
      </button>
    </div>
  );
};

export default UploadSection; 