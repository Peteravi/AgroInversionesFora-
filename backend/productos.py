# productos.py
from flask import Blueprint, request, jsonify
from models import db, Producto, FechaVencimiento
import os
from datetime import datetime, timedelta

# Crear un Blueprint para los productos
productos_bp = Blueprint('productos', __name__)

# Ruta para obtener todos los productos
@productos_bp.route('/api/productos', methods=['GET'])
def get_productos():
    productos = Producto.query.all()
    return jsonify([producto.to_dict() for producto in productos])

# Ruta para obtener un producto específico
@productos_bp.route('/api/productos/<int:producto_id>', methods=['GET'])
def get_producto(producto_id):
    producto = Producto.query.get_or_404(producto_id)
    return jsonify(producto.to_dict())

# Ruta para agregar un nuevo producto
@productos_bp.route('/api/productos', methods=['POST'])
def add_product():
    data = request.form
    imagen = request.files.get('imagen')

    try:
        nombre = data['nombre']
        categoria_id = data['categoria']
        precio = data['precio']
        descripcion = data['descripcion']
        descripcion1 = data['descripcion1']

        producto = Producto(
            Nombre=nombre, 
            CategoriaID=categoria_id, 
            Precio=precio, 
            Descripcion=descripcion, 
            Descripcion1=descripcion1
        )
        
        if imagen:
            imagen_filename = imagen.filename
            imagen.save(os.path.join('static', 'images', imagen_filename))
            producto.Imagen = imagen_filename

        db.session.add(producto)
        db.session.commit()
        return jsonify({"message": "Producto creado exitosamente"}), 201
    except KeyError as e:
        return jsonify({"error": f"Falta el campo requerido: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para actualizar un producto existente
@productos_bp.route('/api/productos/<int:producto_id>', methods=['PUT'])
def update_product(producto_id):
    data = request.form
    producto = Producto.query.get_or_404(producto_id)
    imagen = request.files.get('imagen')

    try:
        producto.Nombre = data['nombre']
        producto.CategoriaID = data['categoria']
        producto.Precio = data['precio']
        producto.Descripcion = data['descripcion']
        producto.Descripcion1 = data['descripcion1']

        if imagen:
            imagen_filename = imagen.filename
            imagen.save(os.path.join('static', 'images', imagen_filename))
            producto.Imagen = imagen_filename

        db.session.commit()
        return jsonify({"message": "Producto actualizado exitosamente"}), 200
    except KeyError as e:
        return jsonify({"error": f"Falta el campo requerido: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para eliminar un producto
@productos_bp.route('/api/productos/<int:producto_id>', methods=['DELETE'])
def delete_product(producto_id):
    producto = Producto.query.get_or_404(producto_id)
    try:
        db.session.delete(producto)
        db.session.commit()
        return jsonify({"message": "Producto eliminado exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para productos con fechas de vencimiento cercanas
@productos_bp.route('/api/productos_vencimiento')
def productos_vencimiento():
    fecha_actual = datetime.now().date()
    rango_dias = timedelta(days=7)

    productos_cercanos_vencimiento = FechaVencimiento.query.filter(
        FechaVencimiento.Fecha <= fecha_actual + rango_dias
    ).all()

    productos = [{
        'ProductoID': fecha_vencimiento.ProductoID,
        'Fecha de Vencimiento': fecha_vencimiento.Fecha.strftime('%Y-%m-%d')
    } for fecha_vencimiento in productos_cercanos_vencimiento]

    return jsonify(productos)
