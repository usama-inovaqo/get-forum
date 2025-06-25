import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function NoThreadsFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4 max-w-md text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-400" />
        </div>
        
        {/* Main heading */}
        <h3 className="text-lg font-semibold text-gray-900">
          No conversations yet
        </h3>
      </div>
    </div>
  );
} 