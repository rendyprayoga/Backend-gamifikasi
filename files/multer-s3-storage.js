// const sharp = require('sharp');
// const s3Client = require('./s3-client');
// const config = require('../config');

// class MulterS3Storage {
//   constructor(options) {
//     this.options = options;
//   }

//   _handleFile(req, file, cb) {
//     this.options.destination(req, file, (err, destination) => {
//       if (err) return cb(err);

//       this.options.filename(req, file, function (err, filename) {
//         if (err) return cb(err);

//         let stream = file.stream;
//         const ext = file.originalname.split('.').pop().toLowerCase();
//         const finalPath = `${destination}/${filename}`;
//         const uploader = s3Client.upload({
//           container: config.file.s3.bucket,
//           remote: finalPath,
//           contentType: file.mimetype,
//           acl: 'public-read',
//         });

//         // Compress before upload if it's a compressable image.
//         if (['jpg', 'jpeg', 'png'].includes(ext)) {
//           const transformer = sharp();

//           if (['jpg', 'jpeg'].includes(ext)) {
//             transformer.jpeg({ mozjpeg: true });
//           } else if (['png'].includes(ext)) {
//             transformer.png({ compressionLevel: 9 });
//           }

//           stream = stream.pipe(transformer);
//         }

//         stream.pipe(uploader);
//         uploader.on('error', cb);
//         uploader.on('finish', () => {
//           // Fix delay. File isn't immediatelly available.
//           // https://stackoverflow.com/a/58172782
//           const intervalId = setInterval(() => {
//             s3Client.getFile(config.file.s3.bucket, finalPath, (err) => {
//               if (err) return;

//               clearInterval(intervalId);
//               cb(null, {
//                 destination: destination,
//                 filename: filename,
//                 path: finalPath,
//               });
//             });
//           }, 100);
//         });
//       });
//     });
//   }
// }

// module.exports = MulterS3Storage;
