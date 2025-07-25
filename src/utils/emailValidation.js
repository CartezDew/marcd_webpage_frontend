// Email validation utility that matches Django serializer restrictions

/**
 * Comprehensive email validation that matches Django serializer restrictions
 * @param {string} email - The email address to validate
 * @param {boolean} checkDuplicate - Whether to check for duplicates (for waitlist)
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email, checkDuplicate = false) => {
  // Check if email is empty
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailValue = email.trim();

  // Check if email contains @ symbol
  if (!emailValue.includes('@')) {
    return { isValid: false, error: 'Email must contain @ symbol' };
  }

  // Check if email contains . symbol
  if (!emailValue.includes('.')) {
    return { isValid: false, error: 'Email must contain a domain (e.g., .com, .org)' };
  }

  // Check if email is 'noemail' or contains 'noemail'
  if (emailValue.toLowerCase() === 'noemail' || emailValue.toLowerCase().includes('noemail')) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Basic email format validation using the same regex as Django
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailValue)) {
    return { isValid: false, error: 'Please enter a valid email address format' };
  }

  // Additional checks for common invalid patterns
  if (emailValue.startsWith('@') || emailValue.endsWith('@')) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (emailValue.includes('..') || emailValue.includes('@@')) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Check for spaces in email
  if (emailValue.includes(' ')) {
    return { isValid: false, error: 'Email address cannot contain spaces' };
  }

  // Check for consecutive dots in domain
  const domain = emailValue.split('@')[1];
  if (domain && domain.includes('..')) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Check if domain has at least 2 characters after the last dot
  const domainParts = domain?.split('.');
  if (domainParts && domainParts.length > 0) {
    const lastPart = domainParts[domainParts.length - 1];
    if (lastPart.length < 2) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
  }

  // For waitlist entries, we would check for duplicates here
  // Since we can't access the database from frontend, this will be handled by the backend
  if (checkDuplicate) {
    // This would typically make an API call to check for duplicates
    // For now, we'll let the backend handle this validation
  }

  return { isValid: true, error: '' };
};

/**
 * Validate email for waitlist entries (includes duplicate check message)
 * @param {string} email - The email address to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateWaitlistEmail = (email) => {
  const result = validateEmail(email, true);
  
  // If basic validation passes but we want to show a specific message for duplicates
  // This will be caught by the backend, but we can prepare the user
  if (result.isValid) {
    return { isValid: true, error: '' };
  }
  
  return result;
};

/**
 * Validate email for contact form submissions
 * @param {string} email - The email address to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateContactEmail = (email) => {
  return validateEmail(email, false);
};

/**
 * Real-time email validation for input fields
 * @param {string} email - The email address to validate
 * @param {string} type - 'waitlist' or 'contact'
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateEmailRealTime = (email, type = 'contact') => {
  // Don't show errors for empty fields during typing
  if (!email || email.trim() === '') {
    return { isValid: true, error: '' };
  }

  if (type === 'waitlist') {
    return validateWaitlistEmail(email);
  } else {
    return validateContactEmail(email);
  }
}; 