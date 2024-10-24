import supabase from '@/api/supabaseClient';

// Fetch notifications for the current user
export const fetchNotifications = async () => {
  try {
    // Get current user information from Supabase Auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Failed to get user information.');
    }

    const currentUserEmail = user.email;

    // Fetch user profile based on email to get volunteer_id (id from the profiles table)
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', currentUserEmail)
      .single();

    if (profileError || !userProfile) {
      throw new Error('Failed to get user profile or user ID.');
    }

    const volunteerId = userProfile.id;

    // Fetch notifications for the current user based on volunteer_id
    const { data, error } = await supabase
      .from('notifications')
      .select('id, message, created_at, event_name, date, time, location, description, is_read')
      .eq('volunteer_id', volunteerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const formattedNotifications = data.map((notification: any) => ({
      id: notification.id,
      message: notification.message,
      created_at: new Date(notification.created_at).toLocaleDateString(),
      event_name: notification.event_name,
      date: notification.date,
      time: notification.time,
      location: notification.location,
      description: notification.description,
      is_read: notification.is_read,
    }));

    return { notifications: formattedNotifications, error: null };
  } catch (error) {
    return { notifications: null, error: (error as Error).message || 'Error fetching notifications' };
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: number) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message || 'Error marking notification as read' };
  }
};
