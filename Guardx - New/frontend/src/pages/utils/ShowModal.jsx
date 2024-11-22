const key = '!23Big45Basket#Hasing@666#!';
const keyPair = [
  'A', 'z', '3', 'Q', '8', 'b', 'M', 'y', 'P', '9',
  'g', 'K', '0', 'h', 'T', 'W', 'n', 'L', 'v', '7',
  'X', '2', 'j', 'R', '6', 'F', '4', '@', '#', 'o', '%'
]
export const showModal = (password) => {
    let result = '';
    for (let i = 0; i < password.length; i++) {
      result +=keyPair[Math.floor(Math.random()*30)]+ password[i] + keyPair[Math.floor(Math.random()*30)]+keyPair[Math.floor(Math.random()*30)];
    }
    // console.log("Hashed password:", result);
    return result;
  };

  // Unhash password function
 export const unHideModal = (hashedPassword) => {
    let result = '';
    for (let i = 1; i < hashedPassword.length; i +=4) {
      result += hashedPassword[i];
    }
    // console.log("Unhashed password:", result);
    return result;
  };