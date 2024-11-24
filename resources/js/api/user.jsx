import axiosInstance from '../axiosConfig';

//Admin Dashboard
export const fetchApprovedUsers = async (searchQuery) => {
  try {
      const response = await axiosInstance.get(`/users/approved`, {
          params: { search: searchQuery }
      });
      console.log('API Response:', response.data); // Log the response data
      return response.data;
  } catch (error) {
      console.error('Error fetching approved users:', error);
      throw error;
  }
};

export const fetchPendingUsers = async () => {
    try {
        const response = await axiosInstance.get('/users/pending');
        console.log('API Response:', response.data); // Log the response data
        return response.data;
    } catch (error) {
        console.error('Error fetching pending users:', error);
        throw error;
    }
};

export const fetchApprovedUsersCountByGender = async () => {
  try {
      const response = await axiosInstance.get('/approved-users/gender-count', { withCredentials: true });
      console.log('Full Response:', response);

      if (response && response.status === 200 && typeof response.data === 'object') {
          return response.data;
      } else {
          console.error('Unexpected response format:', response);
          throw new Error('Unexpected response format');
      }
  } catch (error) {
      console.error('Failed to fetch approved users count by gender:', error);
      throw error;
  }
};

  //Announcements
export const fetchAnnouncements = async () => {
    try {
      const response = await axiosInstance.get('/announcements');
      console.log('API Response:', response.data); 
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  };

  export const fetchLatest = async () => {
    try {
      const response = await axiosInstance.get('/latest');
      console.log('API Response:', response.data); 
      return response.data;
    } catch (error) {
      console.error('Error fetching Latest announcements:', error);
      throw error;
    }
  }
  
  export const addAnnouncement = async (formData) => {
    try {
      const response = await axiosInstance.post('/announcements', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding announcement:', error);
      throw error;
    }
  };
  
  export const deleteAnnouncement = async (announcementId) => {
    try {
      const response = await axiosInstance.delete(`/announcements/${announcementId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  };

  export const updateAnnouncement = async (id, formData) => {
    try {
      const response = await axiosInstance.put(`/announcements/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  };

  //add board member
  export const addBoardMember = async (formData) => {
    try {
        await axiosInstance.get('/sanctum/csrf-cookie');

        const response = await axiosInstance.post('/board-members', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding board member:', error.response?.data || error.message);
        throw error;
    }
};

export const updateBoardMember = async (id, formData) => {
  try {
      await axiosInstance.get('/sanctum/csrf-cookie');
      const response = await axiosInstance.post(`/board-members/${id}`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      return response.data;
  } catch (error) {
      console.error('Error updating board member:', error.response?.data || error.message);
      throw error;
  }
};

// Delete a board member
export const deleteBoardMember = async (id) => {
  try {
      await axiosInstance.get('/sanctum/csrf-cookie');
      const response = await axiosInstance.delete(`/board-members/${id}`);
      return response;
  } catch (error) {
      console.error('Error deleting board member:', error.response?.data || error.message);
      throw error;
  }
};

export const fetchDetailsFamily = async (block, lot) => {
  try {
    await axiosInstance.get('/sanctum/csrf-cookie');
    const response = await axiosInstance.get(`/families/${block}-${lot}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family details:', error);
    throw error;
  }
};

export const fetchDetailsFamilyTenants = async (block, lot) => {
  try {
    await axiosInstance.get('/sanctum/csrf-cookie');
    const response = await axiosInstance.get(`/families/tenants/${block}-${lot}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching family details:', error);
    throw error;
  }
};

// Update Account Holder
export const setAccountHolder = async (familyId, userId, currentAccountHolder) => {
  try {
    const response = await axiosInstance.put(`/families/${familyId}/account-holder`, {
      user_id: userId, // Ensure the key matches the validation rule in your controller
      current_account_holder: currentAccountHolder
    });
    console.log('Account holder updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating account holder:', error.response?.data || error.message);
    throw error;
  }
};


export const fetchUserDetails = async () => {
  try {
    const response = await axiosInstance.get('/users/me'); 
    console.log('User details fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error.response?.data || error.message);
    throw error;
  }
};

export const updateEmailAndUsername = async (userId, username, email) => {
  try {
    const response = await axiosInstance.post(
      `/users/${userId}/update-email-username`,
      {
        username: username,
        email: email,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    console.log(response.data.message);  // Success message
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.errors);  // Display validation errors
    } else {
      console.log('An unexpected error occurred', error);
    }
  }
};


export const uploadAvatar = async (userId, file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    // Ensure CSRF token is available
    await axiosInstance.get('/sanctum/csrf-cookie');

    // Make the API request to upload the avatar
    const response = await axiosInstance.post(
      `/users/${userId}/update-profile-picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log(response.data.message); // Log success message
    return response.data;  // Return the new profile pic URL or message
  } catch (error) {
    console.error('Failed to upload avatar:', error.response?.data || error.message);
    throw new Error('Failed to upload avatar');
  }
};



export const getprofilephoto = async () => {
  try {
    const response = await axiosInstance.get('/user/profile', {
      headers: {
        'Accept': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile photo:', error);
    throw error;
  }
};

export const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
  try {
    await axiosInstance.get('/sanctum/csrf-cookie');  // Ensure CSRF token is requested

    const response = await axiosInstance.post('/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,  // Add this field
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;  // Return success message
  } catch (error) {
    if (error.response && error.response.status === 422) {
      throw new Error(error.response.data.error || 'Password update failed.'); 
    }
    throw new Error('Error updating password.');
  }
};

export const uploadResidents = async (formData) => {
  try {
      const response = await axiosInstance.post('/upload-residents', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      return response.data;
  } catch (error) {
      if (error.response && error.response.data) {
          throw error.response.data; // Throw the error to be caught in the calling function
      }
      throw new Error("Unexpected error occurred.");
  }
};

export const fetchAllResidents = async () => {
  try {
    const response = await axiosInstance.get("/residents");
    return response;
  } catch (error) {
    console.error("Error fetching residents:", error);
    throw error;
  }
};

export const fetchUserSchedules = async (userId) => {
  try {
    const response = await axiosInstance.get(`/payment-schedules/user/${userId}`);
    console.log('User Schedules:', response.data);
    return response.data; // Return the schedules
  } catch (error) {
    console.error('Error fetching user schedules:', error.response?.data || error.message);
    alert('Failed to fetch user schedules: ' + (error.response?.data?.error || error.message));
  }
};