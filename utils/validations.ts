const isReservedUsername = (username: string): boolean => {
  const reservedUsernames = ['admin', 'support', 'system']; // Add more as needed
  return reservedUsernames.includes(username.toLowerCase());
};

// Store shared helper functions for both the API and the app
export function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')        // Remove all non-word chars
    .replace(/--+/g, '-');          // Replace multiple - with single -
}

export const validatePassword = (password: string): boolean => {
  const requirements = [
    { label: '8 characters', test: () => password.length >= 8 },
    { label: '1 uppercase', test: () => /[A-Z]/.test(password) },
    { label: '1 lowercase', test: () => /[a-z]/.test(password) },
    { label: '1 special character', test: () => /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { label: '1 number', test: () => /\d/.test(password) },
  ];

  return requirements.every(req => req.test());
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  return emailRegex.test(email);
}

export const validateUsername = (username: string): boolean => {
  username = username.toLowerCase();

  if (username.length < 3 || username.length > 15) {
    return false;
  }
  if (!/^[a-z0-9._]+$/.test(username)) {
    return false;
  }
  if (/\s/.test(username)) {
    return false;
  }
  if (/^[._]|[._]$/.test(username)) {
    return false;
  }
  if (/[._]{2,}/.test(username)) {
    return false;
  }
  if (isReservedUsername(username)) {
    return false;
  }
  return true;
};