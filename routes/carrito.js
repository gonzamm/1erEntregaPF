const express = require("express");
const Contenedor = require("../claseContenedor.js");

const app = express();
const { Router } = express;
const router = new Router();

//CLASE CONTENEDORA DE CARRITO Y PRODUCTO
let carros = new Contenedor("carritos.txt");
let productos = new Contenedor("productos.txt");


//FUNCION FECHA
function darFecha() {
    const fecha = new Date();
    let fechaOK = fecha.getDate() + '/' + (fecha.getMonth()+1) + ' - ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
    return fechaOK;
  }

//POST VACIO CREA UN NUEVO CARRITO
router.post("/", (req, res) => {
    //Creo un nuevo carrito
    let carrito = {
        id: 0,
        timestamp: darFecha(),
        productos:[]
    };

    //Agrego el carrito a carritos.txt
    async function saveCarrito(){
        try {
        await carros.save(carrito);
        res.send({id: carrito.id});
        
        } catch (error) {
        throw Error("Error en post carrito");
        }
    }
    saveCarrito();
  });

//POST CON ID DE PTO
router.post("/:idCarrito/:idPto", (req, res) =>{
    async function agregarPtoXid(){
        try{
          //Busco el producto por ID  
          let ptoId = await productos.getById(parseInt(req.params.idPto));
          //Me fijo si existe el pto con el ID solicitado
          if (Object.keys(ptoId).length != 0) {
            //Pto con ID solicitado encontrado
            //Busco el carrito con el id enviado por parametro
            let carrito = await carros.getById(req.params.idCarrito);
            //Me fijo si existe el carrito con id solicitado
            if (carrito[0]){
                //Carrito encontrado agrego el producto
                let carrosTodos = await carros.read();
                carrosTodos = JSON.parse(carrosTodos);
                let auxId = parseInt(req.params.idCarrito) - 1;
                carrito[0].productos.push(ptoId[0]);
                carrosTodos.splice(auxId, 1, carrito[0]);
                //Escribo el archivo
                await carros.write(carrosTodos, "Producto agregado al carrito correctamente");
                res.send({carrito});
            }
            //Carrito no encontrado envio error
            else{
                res.status(400);
                res.send({error : 'carrito no encontrado'})
            }
          } 
          //Pto no encontrado envio error   
          else{
              res.status(400);
              res.send({ error : 'producto no encontrado' });
          }
        }
        catch(error){
          throw Error("Error agregando pto al carrito");
        }
        
      };
      agregarPtoXid();

});

//DELETE CARRITO SEGUN ID
router.delete("/:id", (req,res) =>{
    async function deletexId(){
        try {
          //Me fijo si existe el carrito con el ID solicitado
          let flag = await carros.getById(parseInt(req.params.id));
          if (Object.keys(flag).length != 0) {
            //Carritto con ID solicitado encontrado
            //Borro el carrito con el ID solicitado, y envio respuesta
            await carros.deleteById(parseInt(req.params.id));
            res.send(await carros.getAll());   
          }
          //Carro con ID no encontrado, envio error
          else{
            res.status(400);
            res.send({ error : 'Carrito con ID solicitado no existe' });
          }
        } catch (error) {
          throw Error ("Error borrando carro por ID");
        }
      }

deletexId();

});

//DELETE DE UN PRODUCTO DE UN CARRITO SEGUN ID
router.delete("/:idCarrito/:idPto", (req,res) =>{
    async function deletePtoxid(){
        try{
          let carritoId = await carros.getById(parseInt(req.params.idCarrito));
          //Me fijo si existe el carrito con el ID solicitado
          if (Object.keys(carritoId).length != 0) {
            //Carro con ID solicitado encontrado
            //Armo un array con los productos que tiene el carro
            let ptosCarro = carritoId[0].productos;
            //Busco el index del producto a eliminar
            let indexPto = ptosCarro.findIndex(aux => aux.id == req.params.idPto);
            if (indexPto>= 0){
                //Producoto en carrito encontrado borro el producto
                carritoId[0].productos.splice(indexPto, 1);

                //Modificando carritos.txt
                let carrosTodos = await carros.read();
                carrosTodos = JSON.parse(carrosTodos);
                let auxId = parseInt(req.params.idCarrito) - 1;
                carrosTodos.splice(auxId, 1, carritoId[0]);
                //Escribo el archivo
                await carros.write(carrosTodos, "Producto eliminado del carrito correctamente");
                res.send(carritoId);
            }
            //El ID de producto no esta en el carrito, envio error
            else{
            res.status(400);
            res.send({error: "Pto con ID solicitado no existe en el carrito"})
            }
 
          }
          //No existe el carrito con id solicitado envio error
          else{
            res.status(400);
            res.send({error: "Carrito con ID solicitado no existe"})
          }
        }
        catch(error){
            throw Error ("Error borrando producto de carro por ID");
        }

    }

    deletePtoxid();
});

//GET PRODUCTOS EN CARRITO POR ID
router.get("/:id", (req, res) =>{
    async function todosPtos(){
        try {
            //Busco el carrito con el id enviado por parametro
            let carrito = await carros.getById(parseInt(req.params.id));
            if (carrito[0]){
                ptos = carrito[0].productos;
                res.send(ptos);
            }
            //No existe el carrito con el id solicitado, envio error
            else{
                res.status(400);
                res.send({error: "Carrito con ID solicitado no existe"})
            }   
        }
        catch(error){
            throw Error ("Error obteniendo todos los producto del carrito por ID");
        }
    }
    
    todosPtos();

});

//GET TODOS LOS CARRITOS
router.get("/", (req,res)=>{

    async function carrito(){
        try{
            let aux = await carros.getAll();
            res.send(aux);
        }
        catch{
            console.log("ERROR");
        }
    }
    carrito();
})

//EXPORT MODULO ROUTER
module.exports = router;
