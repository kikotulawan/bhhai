import { updateEmailAndUsername, uploadAvatar, updatePassword } from '../api/user';

export const submitEmailAndUsername = async (userId, username, email, originalUsername, originalEmail, setIsLoading, setMessage, setIsError) => {
    if (!username || !email) {
        setMessage("Username and Email are required.");
        setIsError(true);
        return;
    }

    // Check if the username or email is unchanged
    if (username === originalUsername && email === originalEmail) {
        setMessage("No changes have been made.");
        setIsError(true); // Treat this as an informational message
        return;
    }

    try {
        setIsLoading(true);
        await updateEmailAndUsername(userId, username, email);
        setMessage('Changes saved successfully');
        setIsError(false);
    } catch (error) {
        setMessage('Failed to save changes');
        setIsError(true);
    } finally {
        setIsLoading(false);
    }
};

export const submitAvatar = async (userId, file, setIsLoading, setMessage, setIsError) => {
    if (!file) {
        setMessage('Please select a file to upload');
        setIsError(true);
        return;
    }

    try {
        setIsLoading(true);
        await uploadAvatar(userId, file);
        setMessage('Profile picture uploaded successfully');
        setIsError(false);
    } catch (error) {
        setMessage('Failed to upload profile picture');
        setIsError(true);
    } finally {
        setIsLoading(false);
    }
};

export const submitPassword = async (currentPassword, newPassword, confirmPassword, passwordStrength, setIsLoading, setMessage, setIsError, resetFields) => {
    if (newPassword !== confirmPassword) {
        setMessage('New password and confirm password do not match.');
        setIsError(true);
        return;
    }

    if (passwordStrength < 3) {
        setMessage('Password is too weak.');
        setIsError(true);
        return;
    }

    try {
        setIsLoading(true);
        const response = await updatePassword(currentPassword, newPassword, confirmPassword);

        if (response.error) {
            setMessage(response.error);
            setIsError(true);
        } else {
            setMessage('Password changed successfully!');
            setIsError(false);
            resetFields();  // Reset password fields after successful update
        }
    } catch (error) {
        setMessage(error.message || 'Error updating password.');
        setIsError(true);
    } finally {
        setIsLoading(false);
    }
};
