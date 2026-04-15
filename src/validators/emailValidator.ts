const EMAIL_REGEX =
  /^[a-zA-Z0-9]([a-zA-Z0-9._+%-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export const validateEmail = (
  email: string | null | undefined
): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  if (email.includes('..')) {
    return false;
  }

  return EMAIL_REGEX.test(email);
};
