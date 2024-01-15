import { Router } from 'express';
import productsModel from '../models/products.model.js';

const productRouter = Router();
//Ruta inicial de Products
productRouter.get('/', async (req, res) => {
    let { limit, page, category, status, sort } = req.query;
    
    const limitNumber = parseInt(limit) || 10;   //Por default traiga 10 productos en la página o que el usuario pueda ingresar el límite
    const pageNumber = parseInt(page) || 1; //Por defecto inicia en la página 1 o que el usuario elija qué página quiere navegar

    //Utilizamos la query.sort que viaja desde el lado del cliente para que según lo que ingrese ordene de forma Ascendente o Descendente
    let sortOption;
	sort == 'asc' && (sortOption = 'price'); 
	sort == 'desc' && (sortOption = '-price');
   
    const options = {
        page: pageNumber,
        limit:limitNumber,
        sort:sortOption || null
    };
      
        const query = {};
        category && (query.category = category);
        status && (query.status = status);
    try {     
        const prods = await productsModel.paginate(query, options)//Pasamos los objetos dentro de los paramétros
        res.status(200).send({ result: 'OK', message: prods })
    } catch (error) {
        res.status(400).send({ error: `Error displaying products:  ${error}` })
    };
});

//Ruta para traer un producto según su ID
productRouter.get("/:pid", async (req, res)=>{
    const {pid} = req.params;
    try {
        const prod = await productsModel.findById(pid);
        if (prod)
            res.status(200).send({resultado: 'ok', message: prod });
        else
            res.status(404).send({resultado: 'Not Found', message: prod });
            
    }catch (error){
         res.status(400).send({error: `Error al consultar productos: ${error}`});
    };
}); 

//Ruta para crear un producto
productRouter.post("/", async (req, res)=>{
    const { title, description, stock, code, price, category } = req.body;
    
    try {
        const respuesta = await productsModel.create({
            title, description, stock, code, price, category
        });
            res.status(200).send({resultado: 'ok', message: respuesta });           
    }catch (error){
         res.status(400).send({error: `Error al crear el producto: ${error}`});
    };
}); 
//Ruta para crear un producto o actualizar en caso de que exista
productRouter.put("/:pid", async (req, res)=>{
    const {pid} = req.params
    const { title, description, stock, code, price, category, status } = req.body;
    
    try {
        const prod = await productsModel.findByIdAndUpdate(pid, {
          title, description, stock, code, price, category, status
        });
      
        if (prod !== null && prod !== undefined) {
          res.status(200).send({ resultado: 'ok', message: prod });
        } else {
          res.status(404).send({ resultado: 'Not Found', message: 'Producto no encontrado' });
        }
      } catch (error) {
        res.status(400).send({ error: `Error al actualizar productos: ${error}` });
      }
      
      
}); 

//Ruta para borrar un producto según su ID
productRouter.delete("/:pid", async (req, res)=>{
    const {pid} = req.params;
    
    try {
        const prod = await productsModel.findByIdAndDelete(pid);
        
        if (prod)
            res.status(200).send({resultado: 'ok', message: prod });
        else
        res.status(404).send({resultado: 'Not Found', message: prod });
    
}catch (error){
    res.status(400).send({error: `Error al eliminar productos: ${error}`});
};
}); 


export default productRouter;