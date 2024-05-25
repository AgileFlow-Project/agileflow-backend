const allowedSymbols = '-$@#?!%^&*()';

// export const passwordRegex = /^[\w\-$@#?!%^&*()]{6,}$/;
export const passwordRegex = new RegExp(`^[\\w\\${allowedSymbols}]{6,}$`);
export const passwordErrorMessage = `Password must be at least 6 characters and can contain letters numbers and following symbols: ${allowedSymbols}.`;
