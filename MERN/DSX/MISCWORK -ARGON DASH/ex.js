
export const genrateID=()=>{
const Alphabet = Array.from(Array(52), (_, i) => String.fromCharCode(i + 65));
const Numbers=[1,2,3,4,5,6,7,8,9,0]
const CombinedString=Numbers.concat(Alphabet)
let password='DSX'
for(let i=0;i<6;i++){
    let random=Math.round(Math.random()*60,0);    
    password+=CombinedString[random]
}
return password; 
}