import express from 'express';
import auth from '../../middleware/auth';

//Model
import Post from '../../models/post';

const router = express.Router();

import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_PRIVATE_KEY
})

const uploadS3 = multer({
    storage: multerS3({
      s3,
      bucket: "paulprojectbucket2020/upload",
      region: "ap-northeast-2",
      key(req, file, cb) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, basename + new Date().valueOf() + ext);
      },
    }),
    limits: { fileSize: 100 * 1024 * 1024 },
  });
  

// @route     POST api/post/image
// @desc      Create a Post
// @access    Private

router.post("/image", uploadS3.array("upload", 5), async (req, res, next) => {
    try {
      console.log(req.files.map((v) => v.location));
      res.json({ uploaded: true, url: req.files.map((v) => v.location) });
    } catch (e) {
      console.error(e);
      res.json({ uploaded: false, url: null });
    }
  });


// api/post
router.get('/', async(req, res) => {
    const postFindResult = await Post.find();
    console.log(postFindResult, "All Post Get");
    res.json(postFindResult);
})

router.post('/', auth, async(req, res, next) => {
    try {
        console.log(req, "req")
        const { title, contents, fileUrl, creator } = req.body;
        const newPost = await Post.create({ // mongoose에서 method를 사용할때는 반드시 async await을 써준다.
            title,
            contents,
            fileUrl,
            creator,
        });
        res.json(newPost);
    } catch(e) {
        console.log(e);
    }
})


export default router;

//export default 로 내보내면 후에 이름을 자유롭게 지어서 사용할 수 있다. 
//export const name = () => {} : 이렇게 내보내면 name으로 밖에 이름을 사용할 수 없다. 그리고 import { } from ''  이런식으로 괄호안에 불러 올 수 밖에 없다.

