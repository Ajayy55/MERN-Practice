export const genratePID=(cat)=>{
    const Alphabet = Array.from(Array(26), (_, i) => String.fromCharCode(i + 65));
    const Numbers=[1,2,3,4,5,6,7,8,9,0]
    const CombinedString=Numbers.concat(Alphabet)

    let PID=`${cat.slice(0,5).toUpperCase()}-`    //uppercase
    for(let i=0;i<12;i++){
        let random=Math.round(Math.random()*35,0);    
        PID+=CombinedString[random]
    }
    return PID; 
    }