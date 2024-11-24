import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axiosConfig';



const AboutPage = ({ missionRef, visionRef, boardRef }) => {
    const [boardMembers, setBoardMembers] = useState([]);
    const [error, setError] = useState('');


    useEffect(() => {
        const loadBoardMembers = async () => {
            try {
                const response = await axiosInstance.get('/board-members');
                if (Array.isArray(response.data)) {
                    const positionOrder = {
                        "President": 1,
                        "Vice President": 2,
                        "Secretary": 3,
                        "Treasurer": 4,
                        "Member": 5
                    };
                    const sortedBoardMembers = response.data.sort((a, b) => positionOrder[a.position] - positionOrder[b.position]);
                    setBoardMembers(sortedBoardMembers);
                } else {
                    console.error('Unexpected response format:', response.data);
                    setBoardMembers([]);
                }
            } catch (error) {
                console.error('Error loading board members:', error.response || error.message || error);
                setError('Failed to load board members. Please try again later.');
            }
        };
        loadBoardMembers();
    }, []);

    return (
        <div className="max-h-full overflow-y-auto bg-[#FAFAFA]">
           
            {/* Background Image Section */}
            <div className="relative w-full h-64 bg-cover bg-center" style={{ backgroundImage: 'url(/images/announcement.jpg)' }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl font-extrabold text-center text-white py-6 px-4 rounded-lg shadow-lg">
                        About Us
                    </h1>
                </div>
            </div>

            {/* Mission Section */}
            <div ref={missionRef} className="flex flex-col md:flex-row items-center my-8 p-4 md:p-8 mx-4 md:mx-16">
                <div className="md:w-1/2 md:pr-8">
                    <h2 className="text-4xl font-bold mb-4 text-center md:text-center">Mission</h2>
                    <div className="h-1 w-24 mb-4 mx-auto md:mx-0"></div>
                    <p className="text-base text-center">
                        To create a vibrant and secure community that promotes an exceptional quality of life for all residents, fostering a sense of belonging and unity while providing accessible and sustainable living spaces in the heart of Guiguinto, Bulacan.
                    </p>
                </div>
                <div className="md:w-1/2 mt-4 md:mt-0">
                    <img src="/images/mission.jpg" alt="Mission Image" className="w-full rounded-lg shadow-xl" />
                </div>
            </div>

            {/* Vision Section */}
            <div ref={visionRef} className="flex flex-col md:flex-row-reverse items-center my-8 p-4 md:p-8 mx-4 md:mx-16">
                <div className="md:w-1/2 md:pl-8">
                    <h2 className="text-4xl font-bold mb-4 text-center md:text-center">Vision</h2>
                    <div className="h-1 w-24 mb-4 mx-auto md:mx-0"></div>
                    <p className="text-base text-center">
                        To be a model residential subdivision in Bulacan that embodies harmonious living, where families thrive in a safe, well-maintained, and eco-friendly environment, with modern amenities and a commitment to community development.
                    </p>
                </div>
                <div className="md:w-1/2 mt-4 md:mt-0">
                    <img src="/images/vission.jpg" alt="Vision Image" className="w-full rounded-lg shadow-xl" />
                </div>
            </div>

            {/* Board Members Section */}
            <div ref={boardRef} className="bg-[#FAFAFA] p-4 mt-8">
                <h1 className="text-4xl font-extrabold text-center text-[#333333] py-6 px-4 mb-4">Board Of Directors</h1>
                {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {boardMembers.map(member => (
                        <div key={member.id} className="bg-[#FAFAFA] overflow-hidden">
                            <img 
                                src={`/storage/${member.image || 'board_members/default-avatar.png'}`} 
                                alt={member.user ? `${member.user.firstName} ${member.user.lastName}` : 'Default Avatar'} 
                                className="w-full h-60 object-contain" 
                            />
                            <div className="px-3 py-2 text-center">
                                <h3 className="text-lg font-semibold mb-1">{member.user ? `${member.user.firstName} ${member.user.lastName}` : 'Unknown User'}</h3>
                                <p className="text-gray-600 text-sm mb-1">{member.position}</p>
                                <p className="text-gray-500 text-sm">{`Term: ${member.start_of_term} - ${member.end_of_term}`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
