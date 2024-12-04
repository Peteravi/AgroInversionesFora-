from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc
from werkzeug.security import check_password_hash, generate_password_hash
from models import db, User
from productos import productos_bp  

app = Flask(
    __name__,
    template_folder=r'C:\\Users\\Andrews\\Desktop\\Nueva carpeta\\templates',
    static_folder=r'C:\\Users\\Andrews\\Desktop\\Nueva carpeta\\static'
)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = (
    "mssql+pyodbc://@DESKTOP-M9VJRRK\\SQLEXPRESS/dbAgroInversionesFora"
    "?driver=ODBC+Driver+17+for+SQL+Server"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos
db.init_app(app)

# Registrar el Blueprint de productos
app.register_blueprint(productos_bp)

# Ruta de inicio
@app.route('/')
def home():
    return redirect(url_for('login'))

# Ruta de registro
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        role = request.form['role']

        if password != confirm_password:
            return "Las contraseñas no coinciden.", 400

        user = User.query.filter_by(Username=username).first()
        if user:
            return "El nombre de usuario ya existe.", 400

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        try:
            new_user = User(Username=username, Password=hashed_password, Role=role)
            db.session.add(new_user)
            db.session.commit()
            return redirect(url_for('login'))
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            return f"Error al registrar el usuario: {e}", 500

    return render_template('register.html')

# Ruta de inicio de sesión
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(Username=username).first()
        if user is None:
            return "Nombre de usuario no encontrado.", 400

        if user and check_password_hash(user.Password, password):
            # Redirigir según el rol
            if user.Role == 'admin':
                return redirect(url_for('dashboard'))  # Redirige a dashboard.html si es admin
            else:
                return redirect(url_for('index'))  # Redirige a index.html si es usuario

        return "Nombre de usuario o contraseña incorrectos.", 400

    return render_template('login.html')

# Ruta del Dashboard (solo accesible para admin)
@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

# Ruta del Index (solo accesible para usuarios regulares)
@app.route('/index')
def index():
    return render_template('index.html')

# Crear la cuenta de administrador por defecto
def create_admin_account():
    with app.app_context():
        admin = User.query.filter_by(Username="administrador").first()
        if not admin:
            hashed_password = generate_password_hash("admin123", method='pbkdf2:sha256')
            try:
                new_admin = User(Username="administrador", Password=hashed_password, Role="admin")
                db.session.add(new_admin)
                db.session.commit()
                print("Cuenta de administrador creada.")
            except exc.SQLAlchemyError as e:
                db.session.rollback()
                print(f"Error al crear la cuenta de administrador: {e}")

@app.route('/Nosotros.html')
def nosotros():
    return render_template('Nosotros.html')

@app.route('/blog.html')
def blog():
    return render_template('blog.html')

@app.route('/Popular.html')
def Popular():
    return render_template('Popular.html')

@app.route('/Productos.html')
def Productos():
    return render_template('Productos.html')

@app.route('/Informacion.html')
def Informacion():
    return render_template('Informacion.html')

@app.route('/index.html')
def inicio():
    return render_template('index.html')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        create_admin_account()
    app.run(debug=True)
