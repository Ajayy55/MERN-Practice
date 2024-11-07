// import multer from 'multer'

//  const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, uniqueSuffix + '-' + file.originalname)
//     }
//   })
  
//   export const upload = multer({ storage: storage })

  import multer from 'multer';
  import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set dynamic paths based on file field name
    switch (file.fieldname) {
      case 'rwaImage':
        cb(null, './public/user/rwaimages');
        break;
      case 'rwaDocument':
        cb(null, './public/user/rwadocuments');
        break;
      case 'vehicleImage':
        cb(null, './public/vehicleimages');
        break;
      // Add more cases as needed
      default:
        cb(null, './public/others'); // Default directory for other files
        break;
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-'  + file.originalname);
  }
});

const upload = multer({ storage });

export { upload };
