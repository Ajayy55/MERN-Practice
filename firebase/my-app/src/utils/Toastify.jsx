import { ToastContainer, toast } from 'react-toastify';


export const handleSuccess =(msg)=>{
  // console.log(msg);

    toast.success(msg);
}

export const handleError=(msg)=>{
  
    toast.error(msg);
}