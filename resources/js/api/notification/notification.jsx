import axios from 'axios';

const createNotification = async (userId, message) => {
  try {
    const response = await axios.post('/api/notifications', {
      user_id: userId,
      message: message,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

export default createNotification;
