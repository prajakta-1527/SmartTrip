'use client';

interface HeaderProps {
  groupName?: string;
  userNames: string[];
}

const Header: React.FC<HeaderProps> = ({ groupName, userNames }) => {
  return (
    <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-start items-center shadow-sm gap-3">
      <div className="flex flex-col">
        {/* Group Name */}
        <div className="font-large text-lg">{groupName || 'Unnamed Group'}</div>
        
        {/* User Names */}
        <div className="text-sm text-gray-500">{userNames.join(', ')}</div>
      </div>
    </div>
  );
};

export default Header;
