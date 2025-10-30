// Auth validation service
export const validateName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return "Name is required";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }
  if (name.trim().length > 50) {
    return "Name must be less than 50 characters";
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email || email.trim().length === 0) {
    return "Email is required";
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password || password.length === 0) {
    return "Password is required";
  }
  
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  
  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }
  
  return null;
};