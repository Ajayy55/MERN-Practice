// // import multer from 'multer'

// //  const storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //       cb(null, './public/')
// //     },
// //     filename: function (req, file, cb) {
// //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
// //       cb(null, uniqueSuffix + '-' + file.originalname)
// //     }
// //   })
  
// //   export const upload = multer({ storage: storage })

//   import multer from 'multer';
//   import path from 'path';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Set dynamic paths based on file field name
//     switch (file.fieldname) {
//       case 'rwaImage':
//         cb(null, './public/user/rwaimages');
//         break;
//       case 'rwaDocument':
//         cb(null, './public/user/rwadocuments');
//         break;
//       case 'vehicleImage':
//         cb(null, './public/vehicleimages');
//         break;
//       case 'societyLogo':
//         cb(null, './public/society/images');
//         break;
//       case 'SocietyDocuments':
//         cb(null, './public/society/documents');
//         break;
//       // Add more cases as needed
//       default:
//         cb(null, './public/others'); // Default directory for other files
//         break;
//     }
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + '-'  + file.originalname);
//   }
// });

// const upload = multer({ storage });

// export { upload };

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define a function to ensure the directory exists, and create it if not
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set dynamic paths based on file field name
    let dir;
    switch (file.fieldname) {
      case 'rwaImage':
        dir = './public/user/rwaimages';
        break;
      case 'rwaDocument':
        dir = './public/user/rwadocuments';
        break;
      case 'societyLogo':
        dir = './public/society/images';
        break;
      case 'SocietyDocuments':
        dir = './public/society/documents';
        break;
      case 'entryIcon':
        dir = './public/icons';
        break;
      case 'purposeIcon':
        dir = './public/icons';
        break;
      case 'ownerImage':
        dir = './public/house/owner';
        break;
      case 'vehicleImage':
        dir = './public/house/vehicle';
        break;
      case 'aadhaarImage':
        dir = './public/house/aadhar';
        break;
      case 'regularProfileImage':
        dir = './public/regularEntries/profile';
        break;
      case 'regularAadharImage':
        dir = './public/regularEntries/aadhar';
        break;
      default:
        dir = './public/others'; // Default directory for other files
        break;
    }
    
    // Ensure the directory exists
    ensureDirectoryExists(dir);

    // Proceed to save the file
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

export { upload };

