export default function auth(req,res,next) {
    const {email, password} = req.body;
    console.log(email, password);

    if(email ==="adminCoder@coder.com" && password == "adminCoder123"){
        console.log("Bienvenido al login del admin", email);
        return res.redirect("/static/admin");
    }
    return next() //Continua con la ejecución normal de la ruta si no tiene acceso
};