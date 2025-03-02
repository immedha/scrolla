import { ChevronLeftIcon, HomeIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import { CameraIcon as HeroCameraIcon } from '@heroicons/react/24/outline';

interface IconProps {
  className?: string;
}

export const NavHomeIcon = () => <HomeIcon className="w-6 h-6" />;
export const NavPlusIcon = () => <PlusIcon className="w-6 h-6" />;
export const NavProfileIcon = () => <UserIcon className="w-6 h-6" />; 
export const BackIcon = ({ className }: IconProps) => <ChevronLeftIcon className={className || "w-6 h-6"} />;
export const CameraIcon = ({ className }: IconProps) => <HeroCameraIcon className={className} />;