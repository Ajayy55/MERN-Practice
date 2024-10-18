import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'   
import axios from 'axios';
import { PORT } from '../../PORT/PORT';


export const fetchProducts=createAsyncThunk('fetchProducts',async(id)=>{
   
    const url=id?`${PORT}singleProduct/${id}`:`${PORT}allProducts`;
    // const url=`http://localhost:4000/allProducts`;

try {

    const res=await axios.get(url)
    console.log('in thunk ',res);
    return res.data;

} catch (error) {
    console.log(error); 
}
})

const productsSlice=createSlice({
    name:'products',
    initialState:{
        isLoading:false,
        data:null,
        isError:false,
    },

    extraReducers:(builder)=>{
        builder.addCase(fetchProducts.pending,(state,action)=>{
            state.isLoading=true;
        })
        builder.addCase(fetchProducts.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.data=action.payload;
        })
        builder.addCase(fetchProducts.rejected,(state,action)=>{
            state.isError=true;
            console.log("error :",action.payload);
            
        })
    },
})

export default productsSlice.reducer;