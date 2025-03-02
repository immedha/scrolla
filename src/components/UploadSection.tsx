import { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProSubscription, selectUserId } from '../store/user/userSlice';
import { setPageStateInfoAction } from '../store/global/globalActions';
import { generateVideosAction } from '../store/user/userActions';
import { FREE_SUBSCRIPTION_FILES, PRO_SUBSCRIPTION_FILES } from '../store/storeStates';
import DisplayGeneratedVideos from './DisplayGeneratedVideos';
import GeneratingVideos from './GeneratingVideos';
import { saveFilesToStorage } from '../dbQueries';
import { DocumentIcon } from '@heroicons/react/24/outline';

const UploadSection: FC = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId) || '';
  const isProSubscription = useSelector(selectProSubscription);
  const maxFilesAllowed = useMemo(() => isProSubscription ? PRO_SUBSCRIPTION_FILES : FREE_SUBSCRIPTION_FILES, [isProSubscription]);
  const [generationState, setGenerationState] = useState<'idle' | 'uploading' | 'uploaded' | 'generating' | 'generated'>('idle');
  const isLoading = useMemo(() => generationState === 'uploading', [generationState]);
  const [currFiles, setCurrFiles] = useState<FileList | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic
  };

  if (generationState === 'generating') {
    return <GeneratingVideos />
  }

  if (generationState === 'generated') {
    return <DisplayGeneratedVideos setGenerationState={setGenerationState}/>
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto space-y-6">
      {/* Drag & Drop Area */}
      <div 
        className={`
          w-full border-2 border-dashed rounded-2xl p-4 sm:p-8 md:p-12
          ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-purple-200'}
          transition-all duration-200 ease-in-out
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <DocumentIcon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-purple-600" />
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-medium">
              Drag & drop <span className="text-purple-600">Pdf</span>'s
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              or <label htmlFor="file-upload" className="text-purple-600 underline cursor-pointer hover:text-purple-700">browse files</label> on your computer
            </p>
          </div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf"
            multiple
            onChange={handleFileUpload}
          />
          <button 
            className="mt-2 px-6 sm:px-8 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-sm sm:text-base"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Upload
          </button>
        </div>
      </div>

      {/* File Preview - Show when files are uploaded */}
      {currFiles && (
        <div className="w-full bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-2">Selected Files:</h3>
          <div className="space-y-2">
            {Array.from(currFiles).map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Text */}
      <div className="flex justify-center items-center text-xs sm:text-sm text-gray-500">
        <span className="mr-2">ℹ️</span>
        You can add up to {maxFilesAllowed} Pdf's at once on {isProSubscription ? 'Premium' : 'Freemium'} Tier
      </div>

      {/* Generate Reels Button - Show only when files are uploaded */}
      {generationState === 'uploaded' && (
        <button 
          onClick={handleGenerateVideos}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
        >
          Generate Reels
        </button>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-gray-200" />

      {/* URL Input Section */}
      <div className="w-full space-y-3">
        <p className="text-sm sm:text-base text-gray-600">
          Paste a URL below to upload a link or a file.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://www.apple.com/iphone-6/"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
          />
          <div className="flex gap-2 sm:flex-shrink-0">
            <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base">
              Upload
            </button>
            <button 
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              onClick={() => setUrlInput('')}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSection; 