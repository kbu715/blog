import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/index';
const { JWT_SECRET } = config;
// Model
import User from '../../models/user';

const router = express.Router();

// @routes  GET api/user
// @desc    Get all user
// @access  public

router.get('/', async(req, res) => {
    try {
         const users = await User.find()
         if(!users) throw Error("No users")
         res.status(200).json(users)
    } catch(e) {
        console.log(e)
        res.status(400).json({msg: e.message})
    }
})

// @routes     POST api/user
// @desc       Register  user
// @access     public

router.post("/", (req, res) => {
    console.log(req);
    const { name, email, password } = req.body;
  
    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "모든 필드를 채워주세요" });
    }
    // Check for existing user
    User.findOne({ email }).then((user) => {
      if (user)
        return res.status(400).json({ msg: "이미 가입된 유저가 존재합니다" });
      const newUser = new User({
        name,
        email,
        password,
      });
  
      bcrypt.genSalt(10, (err, salt) => { //hash: 어떤 값이 있다면 문장길이에 관계없이 이것을 어떤 일정한 길이의 값으로 변경할 수 있는 코드
        //bcrypt : 이 hash 값을 쉽게 만들어주는 모듈
        bcrypt.hash(newUser.password, salt, (err, hash) => {

          if (err) throw err;

          newUser.password = hash;
          newUser.save().then((user) => {
            jwt.sign( // 토큰생성한다.
              { id: user.id },//user.id라고 하는 것은 바로 User 모델의 _id를 바로 불러올때 사용하는 것입니다
              JWT_SECRET,
              { expiresIn: 3600 }, //"10h"  "10d" 이런식으로 쓸 수 있다. 3600 => 3600s
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                  },
                });
              }
            );
          });
        });
      });
    });
  });
  
  export default router;