const key = '!23Big45Basket#Hasing@666#!';
const keyPair = ['1','5', '1', '7', '6', '4', '5', '7', '6', '0'];
export const hashPassword = (password) => {
    let result = '';
    for (let i = 0; i < password.length; i++) {
      result += password[i] + key[keyPair[i % keyPair.length]];
    }
    // console.log("Hashed password:", result);
    return result;
  };

  // Unhash password function
 export const unHashPassword = (hashedPassword) => {
    let result = '';
    for (let i = 0; i < hashedPassword.length; i += 2) {
      result += hashedPassword[i];
    }
    // console.log("Unhashed password:", result);
    return result;
  };