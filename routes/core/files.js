// const slugify = require('@sindresorhus/slugify');
// const { makeTokenizer } = require('@tokenizer/s3');
// const S3 = require('aws-sdk/clients/s3');
// const dayjs = require('dayjs');
// const express = require('express');
// const FileType = require('file-type');
// const multer = require('multer');
// const yup = require('yup');
// const config = require('../../config');
// const MulterS3Storage = require('../../files/multer-s3-storage');
// const authenticate = require('../../middleware/authenticate');
// const authorize = require('../../middleware/authorize');
// const ActivityLog = require('../../models/activitylog');
// const s3Client = require('../../files/s3-client');

// const router = express.Router();

// const storage = new MulterS3Storage({
//   destination: function (req, file, cb) {
//     const date = dayjs().format('YYYY/MM');
//     const dir = `gsc-x-kuranglebih-contents/${date}`;

//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     const suffix = Math.random().toString(36).substr(2);
//     const parts = file.originalname.split('.');
//     const ext = parts.pop().toLowerCase();
//     const name = slugify(parts.join('.'));

//     cb(null, `${name}-${suffix}.${ext}`);
//   },
// });

// const uploader = multer({ storage });

// const upload = async (req, res, next) => {
//   const validator = yup.object().shape({
//     file: yup
//       .object()
//       .test('mime-type', '${path} is not allowed', async (value, context) => {
//         try {
//           const s3 = new S3({
//             accessKeyId: config.file.s3.accessKey,
//             secretAccessKey: config.file.s3.accessSecret,
//             region: config.file.s3.region,
//           });
//           const opt = {
//             Bucket: config.file.s3.bucket,
//             Key: value.path,
//           };
//           const s3Tokenizer = await makeTokenizer(s3, opt);
//           const fileType = await FileType.fromTokenizer(s3Tokenizer);
//           const allowedMimes = [
//             'image/gif',
//             'image/jpeg',
//             'image/png',
//             'video/mp4',
//             'image/svg+xml',
//           ];
//           const allowedExts = [
//             'gif',
//             'jpg',
//             'jpeg',
//             'png',
//             'mp4',
//             'svg+xml',
//             'svg',
//           ];
//           return (
//             allowedMimes.includes(fileType.mime) &&
//             allowedExts.includes(fileType.ext)
//           );
//         } catch {
//           return false;
//         }
//       }),
//   });

//   try {
//     await validator.validate({ file: req.file });
//     res.send({ data: { path: req.file.path } });
//     ActivityLog.create({
//       userId: req.user.id,
//       type: 'files.create',
//       key: req.file.path,
//     });
//   } catch (error) {
//     s3Client.removeFile(config.file.s3.bucket, req.file.path, () => {
//       res.status(422).json({ error });
//     });
//   }
// };

// router.use(authenticate);

// router.post('/', authorize('files.create'), uploader.single('file'), upload);

// module.exports = router;
