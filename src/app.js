import express from 'express';
import session from 'express-session';
import { ProductRouter} from './router/products.routers.js';
import { CartRouter } from './router/carts.routers.js';
import { engine } from 'express-handlebars';
import viewsRouter from './router/views.routers.js'
import cookieParser from 'cookie-parser';
//import { Server } from 'socket.io';
import { __dirname } from './utils.js';
//import path from 'path';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import mongoConnect from './dataBase.js';
import passport from 'passport';
import initializePassport from './config/passport.js';
import sessionRouter from './router/sessions.routers.js'


import userRouter from './router/user.routes.js';
import productRouter from './router/product.routes.js';
import cartRouter from './router/carts.routes.js'; 
//import messageRouter from './router/messages.routes.js';
//import staticsRouter from './router/statics.routes.js';
//import sessionRouter from './router/sessions.routes.js';
//import profileRouter from './router/profile.routes.js';

const app = express();
const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const MONGO = "mongodb+srv://lissynose0:@cluster0.qajqy4x.mongodb.net/?retryWrites=true&w=majority";

const connection = mongoose.connect(MONGO);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

app.engine("handlebars",engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use("/", express.static(__dirname + "/public"));

app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl:3600
    }),
    secret:"SecrectCode",
    resave:false,
    saveUninitialized:false

}))

app.use("/", viewsRouters)
app.use("/api/sessions", sessionRouters)
app.use("/api/products", ProductRouters);
app.use("/api/carts", CartRouters);


