const user=require("../Models/nonVerify")
exports.getPreviewImageData=async(req,res)=>{
    try {
        const { id } = req.params;
        const imageData = await user.findById(id);
        if (!imageData) {
          return res.status(404).json({ error: 'Image data not found' });
        }
        res.status(200).json({ data: imageData });
      } catch (error) {
        console.error('Error fetching preview image data:', error);
        res.status(500).json({ error: 'Server error' });
      }
}