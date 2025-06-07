export const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};
export const isValidPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
  return regex.test(password);
};
