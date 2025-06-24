export const getEmailDomain = (email: string) => {
  return email.split("@")[1];
};
