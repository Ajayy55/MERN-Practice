import { readData, writeData } from "../utils/fileHandling.js";
import { genratePID } from "../utils/generateProductID.js";
const DATA_FILE='./src/db/ProductsDb.json'


const addProduct =async(req,res)=>{
    const product=req.body;
    console.log('product',product);
    const files=req?.files;
    console.log('kk',files);
    // return res.status(200).json({m:'hi'})

    const items = readData(DATA_FILE);

    if (
        !product.product  ||
        !product.category ||
        !product.price ||
        !product.stock ||
        !product.weight||
        !product.desc ||
        !product.discount
     
      ) {
        return res.status(400).json({ message: "all fields required" });
      }
      
    
      try {
        const date=new Date();
        product.createdAt=date.toLocaleString();
        product.updatedAt=date.toLocaleString();
        product.id=genratePID(product.category)
        let images=[];
        let videos=[];


        files?.map((file,index)=>{
            console.log('inside map' ,file);
            
            if(file?.mimetype.split('/')[0]=='image' )
            {
                console.log('inside img');
                
                images.push({image:`http://localhost:4000/products/${file.filename}`})
            }
            if(file?.mimetype.split('/')[0]=='video')
            {
                videos.push({video:`http://localhost:4000/products/${file.filename}`})
            }
        })
        console.log('images',images);
        
        product.media= [...images, ...videos];
        // product.media+=video;
        

        items.push(product)
        writeData(DATA_FILE,items);
        res.status(201).json({message:'Product added successfully ...!',product})


      } catch (error) {
        console.log('server error while adding product',error);
       res.status(500).json({message:'error while adding product'})
        
      }



}



//all products

const allProducts =(req,res)=>{
    const products= readData(DATA_FILE)

    if(!products){
        return res.status(400).json({message:'No Product Found ...!'})
    }
    res.status(200).json(products)
}


//remove product0
const removeProduct=(req,res)=>{
    const id=req.params.id;
    console.log(id);
    
    const products= readData(DATA_FILE);

    const index=products.findIndex((record)=> record.id=== id)

    console.log(index);

    if(index===-1){
        return res.status(500).json({message:'No record found to delete'})
    }

    const isdeleted=products.splice(index,1)
    
    if(isdeleted.length<=0)
    {
        return res.status(500).json({message:'An error occured while deleting Product'})
    }

    writeData(DATA_FILE,products)

    res.status(200).json({message:'Record Deleted Successfully ...!'})
    
}



//update

const editProduct=async(req,res)=>{
    const id=req?.params?.id;
    const data=req?.body;
    const files=req?.files;
    console.log('kk',files);
    console.log(id);
    console.log(req.body); 
   
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ message: "empty set of data recieved ..!" });
      }
    

    const products= readData(DATA_FILE);

    const index=products.findIndex((record)=> record.id=== id)
    if(index===-1){
        return res.status(500).json({message:'No record found to edit'})
    }

    //edit fields
    for (const key in data) {
        products[index][key]= data[key]
        }

    //edit files
    // files?.map((file,index)=>{
    //         console.log('inside map' ,file);
            
    //         if(file?.mimetype.split('/')[0]=='image' )
    //         {
    //             console.log('inside img');
                
    //             images.push('http://localhost:4000/products/'+file.filename)
    //         }
    //         if(file?.mimetype.split('/')[0]=='video')
    //         {
    //             video.push('http://localhost:4000/products/'+file.filename)
    //         }
    //     })
    let images=[];
    let videos=[];
    if(data.del){
        let arr=data.del.split(',').map(Number).sort(function(a, b){return b - a}); 
        console.log('inside del',arr);
        arr.forEach(element => {
            console.log('sss',products[index].media?.splice(element,1));
            products[index].media
        });
        
    }

    files?.map((file,index)=>{
        console.log('inside map' ,file);
        
        if(file?.mimetype.split('/')[0]=='image' )
        {
            console.log('inside img');
            
            images.push({image:`http://localhost:4000/products/${file.filename}`})
        }
        if(file?.mimetype.split('/')[0]=='video')
        {
            videos.push({video:`http://localhost:4000/products/${file.filename}`})
        }
    })
    console.log('images',images);
    
        if(files.length>0){
            products[index].media.push(...images, ...videos);
        }
    


    //update updated time
    const date=new Date();
    products[index].updatedAt=date.toLocaleString();

    writeData(DATA_FILE,products)

    res.status(200).json({message:'Record Updated Successfully ...!'})

}

const singleProduct=(req,res)=>{
    const id=req.params.id;
    // console.log(id);
    const products= readData(DATA_FILE);

    const product=products.find((product)=>product.id===id)

    res.status(200).json(product)
}

export {addProduct,allProducts,removeProduct,editProduct,singleProduct}



