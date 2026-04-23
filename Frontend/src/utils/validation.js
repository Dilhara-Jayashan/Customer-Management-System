import { format, parse } from 'date-fns';

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Allow 7-13 digit phone numbers (international format support)
  const phoneRegex = /^[+]?[0-9]{7,13}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

export const validateNIC = (nic) => {
  if (!nic || nic.length < 5 || nic.length > 20) {
    return false;
  }
  return true;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

export const validateDateOfBirth = (date) => {
  if (!date) return false;
  const today = new Date();
  return date <= today;
};

export const formatDate = (date) => {
  if (!date) return '';
  if (typeof date === 'string') {
    return date;
  }
  return format(new Date(date), 'yyyy-MM-dd');
};

export const parseDate = (dateString) => {
  if (!dateString) return null;
  try {
    return parse(dateString, 'yyyy-MM-dd', new Date());
  } catch {
    return null;
  }
};

export const formatErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
