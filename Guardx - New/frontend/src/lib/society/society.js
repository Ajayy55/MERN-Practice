import axios from "axios"
import { PORT } from "../../port/Port"

export const getSocietyBySocietyID =async(id)=>{
    return await axios.get(`${PORT}getSocietyBySocietyID/${id}`)

}