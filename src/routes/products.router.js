import {Router} from "express";
import ControlFileManager from "../control/controlFileManager.js"

const router = Router();

const path =  './FILES';
const nameFile = 'products.json';
const controlFileManager = new ControlFileManager(nameFile, path);

//  Lista todos los productos existentes hasta un limite
router.get('/', (req, res) => {
    let {limit} = req.query;
    if (!limit) limit = 0;
    const result = controlFileManager.getProductsLimit(limit);
    res.status(201).json({message: 'success', method: "GET", payload: result});
});

//  Agrega un producto al archivo .json
router.post('/', (req, res) =>{
    const {title, description, code, price, status, stock, category, thumbnails} = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) return res.status(400).json({message: 'error', method: "POST", payload: "los valores requeridos no estan completos"});
    const objProduct = {title, description, code, price, status, stock, category, thumbnails};
    controlFileManager.createProduct(objProduct);
    res.status(201).json({message: 'success', method: "POST", payload: "Se añadio un nuevo producto"});
});

//  GET     ---> Solo trae un objeto según su ID
//  PUT     ---> Actualiza un producto según su ID
//  DELETE  ---> Elimina un producto según el ID
router.route('/:id')
.get((req, res) => {
    const {id} = req.params;
    const result = controlFileManager.getProductID(id);
    !result ? res.status(400).json({message: 'error', method: "GET-id", payload: "El objeto con el ID especificado no existe"}) : res.status(201).json({message: 'success', method: "GET-id", payload: result});  
})
.put((req, res) =>{
    const {id} = req.params;
    const {title, description, code, price, status, stock, category, thumbnails} = req.body;
    const objProduct = {title, description, code, price, status, stock, category, thumbnails};
    console.log(objProduct);
    controlFileManager.updateProducts(id, objProduct);
    res.status(201).json({message: 'success', method: "PUT", payload: `Actualiza producto con ID: ${id}`});
})
.delete((req, res) => {
    const {id} = req.params;
    const result = controlFileManager.deleteProducts(id);
    if (!result) return res.status(400).json({message: 'error', method: "DELETE", payload: `No se pudo eliminar el producto con ID: ${id}`});
    else res.status(201).json({message: 'success', method: "DELETE", payload: `Se elmino producto con ID ${id}`}); 
});

//  Para escribir el archivo que contrendra los productos inicialmente
router.post('/writeFile', (req, res) => {
    const {write} = req.body;
    const e = controlFileManager.rewriteFileProducts(write);
    if (e) return res.status(401).json({message: 'error', method: "POST", result: 'Can not rewrite again'});
    res.status(201).json({message: 'success', method: "POST", result: 'Can rewrite again'});
});

export default router;