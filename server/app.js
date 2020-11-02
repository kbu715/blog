import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import config from './config';


//Routes
import postRoutes from './routes/api/post';
import userRoutes from "./routes/api/user";
import authRoutes from "./routes/api/auth";


const app = express();
const { MONGO_URI } = config

//서버의 보안적인 측면을 보완해주는 라이브러리
app.use(hpp())
app.use(helmet())

//브라우저가 다른 도메인이나 port가 다른 서버의 자원을 요청하게 해준다.
//Single Page Application(SPA)에서는 보통 서버에서 설정하게 해준다.
app.use(cors({origin: true, credentials: true})) //origin : 허락하고자 하는 주소를 적는데 true라고 하면 모두 허용.
app.use(morgan("dev")) //morgan: 개발을 할 때 로그를 볼 수 있게     "dev" : 개발환경설정으로 해서 로그를 확인할 수 있게

//예전에는 body-parser를 추가로 설치해서 body에 담겨져있는 내용을 서버가 이해하도록 했었는데
//요즘엔 express 자체에 내장되어 있기 때문에 이것을 사용하겠다.
app.use(express.json()) // 브라우저에서 json 형태로 데이터를 보내면 서버에서는 json 형태로 해석해주세요

mongoose.connect(MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(()=>console.log('MongoDB connecting Success!!!')).catch(e=>console.log(e));

//Use routes // router: 책갈피 같은것
app.get('/');
app.use('/api/post', postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);


export default app;