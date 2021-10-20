# 1erEntregaPF
## 1er pre entrega proyecto final curso backend coderhouse. Backend de un ecommerce.

Se creo una interfaz, sencilla pero se recomienda probar mediante postman
Toda la comunicacion entre servidor y cliente se hace mediante JSON  

Dispone de 2 rutas principales.  
- Ruta:  
  - /api/productos  
- Metodos:   
  - GET => Me permite listar todos los productos disponibles  
  - GET/id => Busca un producto por su id  
  - POST => Para incorporar productos al listado  
  - PUT /id => Actualiza un producto por su id  
  - DELETE /id => Borra un producto por su id    
- Ruta:  
  - /api/carrito  
- Metodos:  
  - POST => Crea un nuevo carrito y devuelve su idCarrito  
  - DELETE /idCarrito => Vacia un carrito y lo elimina  
  - GET /idCarrito => Lista todos los productos guardados en el carrito  
  - POST /idCarrito/idPto => Para incorporar productos al carrito por su id de producto  
  - DELETE /idCarrito/idPto => Elimina un producto de un carrito por su id de carrito y de producto  
