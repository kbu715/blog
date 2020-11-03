import express from 'express';
import auth from '../../middleware/auth';

//Model
import Post from '../../models/post';
import Category from '../../models/category';

const router = express.Router();

import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import User from '../../models/user';
import moment from "moment";


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


// @route    POST api/post
// @desc     Create a Post
// @access   Private
router.post("/", auth, uploadS3.none(), async (req, res, next) => {
    try {
        console.log(req, "req")
        const { title, contents, fileUrl, creator, category } = req.body;
        const newPost = await Post.create({ // mongoose에서 method를 사용할때는 반드시 async await을 써준다.
            title,
            contents,
            fileUrl,
            creator: req.user.id,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
        });

        const findResult = await Category.findOne({
          categoryName: category
        })

        console.log(findResult, "Find Result!!!!");

        if (findResult === null | findResult === undefined) {
          const newCategory = await Category.create({
            categoryName: category,
          });
          await Post.findByIdAndUpdate(newPost._id, {
            $push: { category: newCategory._id }, //배열에 값을 넣을 경우 $push를 쓴다. (Post 모델의 category를 참조하자.)
          });
          await Category.findByIdAndUpdate(newCategory._id, {
            $push: { posts: newPost._id },
          });
          await User.findByIdAndUpdate(req.user.id, {
            $push: {
              posts: newPost._id,
            },
          });
        } else {
          await Category.findByIdAndUpdate(findResult._id, {
            $push: { posts: newPost._id },
          });
          await Post.findByIdAndUpdate(newPost._id, {
            category: findResult._id,
          });
          await User.findByIdAndUpdate(req.user.id, {
            $push: {
              posts: newPost._id,
            },
          });
        }
        return res.redirect(`/api/post/${newPost._id}`);
      } catch (e) {
        console.log(e);
      }
})





// @route    POST api/post/:id
// @desc     Detail Post
// @access   Public

router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("creator", "name") // creator는 user Type 이고 그 속성중 name만 볼 것이다.
      .populate({ path: "category", select: "categoryName" }); //원래 이렇게 적는게 정석... category는 category Type이고 그 속성 중 categoryName만 본다.
    post.views += 1;
    post.save();
    console.log(post);
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});





export default router;

//export default 로 내보내면 후에 이름을 자유롭게 지어서 사용할 수 있다. 
//export const name = () => {} : 이렇게 내보내면 name으로 밖에 이름을 사용할 수 없다. 그리고 import { } from ''  이런식으로 괄호안에 불러 올 수 밖에 없다.

