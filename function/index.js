export const generateConfirmationCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

export const generateSuccessProbability = () => {
    return Math.floor(Math.random() * 100) + 1; 
};