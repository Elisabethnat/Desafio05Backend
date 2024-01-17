import local from "passport-local"; //Estrategia 
import passport from "passport"; //Handler de estrategia
import GithubStrategy from 'passport-github2';
import { createHash, validatePassword } from "../utils/bcrypt.js";
import { userModel } from "../models/users.model.js";


 const LocalStrategy = local.Strategy;
 //Función de mi estrategia
 const initializePassport = () => {
    //Defino qué y en qué ruta voy a utilizar mi estrategia
    passport.use('register', new LocalStrategy(
         {passReqToCallback: true, usernameField:'email'}, async (req, username, password, done) => {
            //Defino como registrar un usuario
            const {first_name, last_name, email, age} = req.body;
            try {
               const user = await userModel.findOne({ email: email});
               if (user) {
                  return done(null, false); 
               }
               //si no esta creado, se crea el usuario
               const hashPasword = createHash(password);
               const userCreated = await userModel.create({
               first_name, last_name, age, password: hashPasword, email
               });
               console.log(userCreated);
               return done (null, userCreated);
            } catch (error) {
               return done (error);
            }
         }
    ));
   
   
   passport.use('login', new LocalStrategy({ usernameField: 'email'}, async (username, password, done) => {
      try {
         const user = await userModel.findOne({ email: username });
          //Consulto por un Login. Si éste no existe, retorno null y false
         if (!user) {
            return done (null, false);
         }//SI existe el usuario, compruebo que la contraseña sea valida
         if (validatePassword(password, user.password)) { // compara la contraseña ingresada con la BDD
            return done (null, user) 
         }
         return done (null, false) // contraseña no valida con la de BDD  
      } catch (error) {
         return done (error)
      };
   }));
   
   //github strategy
   passport.use('github', new GithubStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
 
   }, async (accesToken, refreshToken, profile, done)=>{ //Para registrarse
      console.log(accesToken);
      console.log(refreshToken);
      try { 
         const user = await userModel.findOne({ email: profile._json.email}); 
         if (user) {
            done(null, user);
         } else {
            const userCreated = await userModel.create({
               first_name: profile._json.name,
               last_name:" ",
               email: profile._json.email,
               age: 18,  
               password: 'password' //le paso un pass generica.
            })
            done(null, userCreated)
         };    
      } catch (error) {
         done(error)
      };
   })); 
   //session del user
   passport.serializeUser((user, done) => {
      done(null, user._id);
   });
   //logout session
   passport.deserializeUser(async (id, done)=>{
      const user = await userModel.findById(id);
      done (null, user);
   });   
};

export default initializePassport;