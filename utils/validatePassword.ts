export const validatePasswordStrength = (password: string) => {
    const regex = /^.{6,}$/;
    return regex.test(password);
};
