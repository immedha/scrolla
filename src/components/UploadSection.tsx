import { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProSubscription, selectUserId } from '../store/user/userSlice';
import { setPageStateInfoAction } from '../store/global/globalActions';
import { generateVideosAction } from '../store/user/userActions';
import { FREE_SUBSCRIPTION_FILES, PRO_SUBSCRIPTION_FILES } from '../store/storeStates';
import DisplayGeneratedVideos from './DisplayGeneratedVideos';
import GeneratingVideos from './GeneratingVideos';
import { saveFilesToStorage } from '../dbQueries';

const UploadSection: FC = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId) || '';
  const isProSubscription = useSelector(selectProSubscription);
  const maxFilesAllowed = useMemo(() => isProSubscription ? PRO_SUBSCRIPTION_FILES : FREE_SUBSCRIPTION_FILES, [isProSubscription]);
  const [generationState, setGenerationState] = useState<'idle' | 'uploading' | 'uploaded' | 'generating' | 'generated'>('idle');
  const isLoading = useMemo(() => generationState === 'uploading', [generationState]);
  const [currFiles, setCurrFiles] = useState<FileList | null>(null);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setGenerationState('uploading');
    const files = e.target.files;
    if (!files) {
      setGenerationState('idle');
      return;
    }
    
    if (files.length > maxFilesAllowed) {
      dispatch(setPageStateInfoAction({ 
        type: 'error', 
        message: `Maximum ${maxFilesAllowed} files allowed`
      }));
      setGenerationState('idle');
      return;
    }

    try {
      setCurrFiles(files);
      setGenerationState('uploaded');
    } catch (error) {
      console.error('Error handling file upload:', error);
      dispatch(setPageStateInfoAction({type: 'error', message: 'Failed to upload files, please try again.'}));
      setGenerationState('idle');
    }     
  }

  const handleGenerateVideos = async () => {
    if (generationState !== 'uploaded' || !currFiles) return;
    setGenerationState('generating');
    const fileUrls: string[] = await saveFilesToStorage(currFiles);
    dispatch(generateVideosAction({userId, files: fileUrls})); // TODO: actually give the files, this is placeholder right now
    setGenerationState('generated');
  }

  if (generationState === 'generating') {
    return <GeneratingVideos />
  }

  if (generationState === 'generated') {
    return <DisplayGeneratedVideos setGenerationState={setGenerationState}/>
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 text-white bg-[url(phone.png)]">
      <div className={`relative w-full max-w-md transition-opacity ${isLoading ? 'opacity-50' : ''}`}>
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          disabled={isLoading}
        />
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
            ${isLoading ? 'cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}`}
        >
          <div className="flex flex-col items-center">
            {isLoading ? (
              <span className="text-sm animate-pulse">Uploading...</span>
            ) : (
              <>
                <span className="text-sm">Upload max {maxFilesAllowed} pdfs</span>
                <span className="text-xs text-gray-500">Drop files here or click to upload</span>
              </>
            )}
          </div>
        </label>
      </div>
      
      {!isProSubscription && (
        <button 
          className="px-4 py-2 text-sm text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition-colors"
          disabled={isLoading}
        >
          get premium to be able to upload more files
        </button>
      )}
      
      <button 
        className={`w-full max-w-md px-4 py-2 text-white rounded-lg transition-colors
          ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        disabled={generationState !== 'uploaded'}
        onClick={handleGenerateVideos}
      >
        Generate reels
      </button>
    </div>

  );
};

export default UploadSection; 