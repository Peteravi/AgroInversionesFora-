from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(db.Model, UserMixin):  # Asegúrate de heredar de UserMixin
    __tablename__ = 'Login'
    UserID = db.Column(db.Integer, primary_key=True)
    Username = db.Column(db.String(255), unique=True, nullable=False)
    Password = db.Column(db.String(255), nullable=False)
    Role = db.Column(db.String(50), nullable=False)
    LastLogin = db.Column(db.DateTime)
    IsActive = db.Column(db.Boolean, default=True)
    CreatedAt = db.Column(db.DateTime, default=db.func.now())

    def get_id(self):  # Método para Flask-Login
        return str(self.UserID)

    # Método para verificar la contraseña
    def verify_password(self, password):
        return check_password_hash(self.Password, password)

    # Método para establecer el hash de la contraseña
    def set_password(self, password):
        self.Password = generate_password_hash(password)

    # Propiedad que Flask-Login utilizará para verificar si el usuario está activo
    @property
    def is_active(self):
        return self.IsActive

class Producto(db.Model):
    __tablename__ = 'Productos'
    ProductoID = db.Column(db.Integer, primary_key=True)
    Nombre = db.Column(db.String(100), nullable=False)
    CategoriaID = db.Column(db.Integer, db.ForeignKey('Categorias.CategoriaID'))
    Precio = db.Column(db.Numeric(10, 2), nullable=False)
    Descripcion = db.Column(db.Text)
    Descripcion1 = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.ProductoID,
            'nombre': self.Nombre,
            'categoria': self.CategoriaID,
            'precio': str(self.Precio),
            'descripcion': self.Descripcion,
            'descripcion1': self.Descripcion1
        }

class FechaVencimiento(db.Model):
    __tablename__ = 'FechasVencimiento'
    FechaVencimientoID = db.Column(db.Integer, primary_key=True)
    ProductoID = db.Column(db.Integer, db.ForeignKey('Productos.ProductoID'))
    Fecha = db.Column(db.Date, nullable=False)

class Categoria(db.Model):
    __tablename__ = 'Categorias'
    CategoriaID = db.Column(db.Integer, primary_key=True)
    Nombre = db.Column(db.String(100), nullable=False)
