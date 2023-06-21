import Router from "express";
import ControlFileManager from "../control/controlFileManager.js";

const router = Router()

const path =  './FILES';
const nameFile = 'carts.json';
const controlFileManager = new ControlFileManager(nameFile,path);

// Obtiene el objeto del carrito con el ID asignado
router.get('/:cid', (req, res) =>{
    const {cid} = req.params;
    const objCart = controlFileManager.getProductID(cid);   
    if (!objCart) return res.status(400).json({message: 'error', method: "GET-id", payload: "El objeto con el ID especificado no existe"});
    const dataProduct = controlFileManager.findProductID(objCart.products);   
    res.status(201).json({message: 'success', method: "GET-id", idCarts: cid, payload: dataProduct});  
})

//  Agrega productos en el arreglo products del archivo .json
router.post('/', (req, res) => {
    const {products} = req.body;
    console.log(products);
    const cart = {products}
    controlFileManager.createCarts(cart);
    res.status(201).json({message: 'success', method: "POST", payload: "Se añadio un nuevo producto"});
});

// Agrega productos en el arreglo products según el id de carrito
router.post('/:cid/product/:pid', (req, res) => {
    const {cid, pid} = req.params;
    controlFileManager.addProductsCartID(cid, pid);
    
});

// Carga los datos desde una variable quemada
router.post('/writeFile', (req, res) => {
    const {write} = req.body;
    const e = controlFileManager.rewriteFileCarts(write);
    if (e) return res.status(401).json({message: 'error', method: "POST", result: 'Can not rewrite again'});
    res.status(201).json({message: 'success', method: "POST", result: 'Can rewrite again'});
});






export default router;