import React from 'react'
import useUIStore from '../../Zustand/openCloseSidebar';


const ChatHeader = ({ userdata }) => {
    const { openSidebar } = useUIStore();

    return (
        <>
            <div className="h-16 mt-0 px-4 sm:px-6 flex items-center justify-between bg-white/40 backdrop-blur-lg border-b border-white/30">

                {/* LEFT: Avatar + Info */}
                <div className="flex items-center gap-3">
                    {userdata.profilepic ? (
                        <img
                            src={userdata?.profilepic}
                            alt="user"
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-300"
                        />
                    ) : (
                        <span
                            className="
                             flex items-center justify-center
                             w-11 h-11
                             rounded-full
                             bg-gradient-to-br from-purple-400 to-indigo-500
                             text-white
                             font-bold
                             text-xl sm:text-2xl
                             uppercase
                             select-none
                            "
                        >
                            {userdata?.fullname?.trim().charAt(0)}
                        </span>)}

                    <div className="leading-tight">
                        <p className="font-semibold text-sm sm:text-base text-purple-900">
                           {userdata?.fullname}
                        </p>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Online
                        </p>
                    </div>
                </div>

                {/* RIGHT: Menu / Actions */}
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 transition">
                    <span onClick={openSidebar} className="text-xl font-bold text-gray-600">⋮</span>
                </button>

            </div>

        </>
    )
}

export default ChatHeader       