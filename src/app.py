from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://aroitman:codoacodoSQL@aroitman.mysql.pythonanywhere-services.com/aroitman$cac_proyectofinal'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

class Expediente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    caratula = db.Column(db.String(400))
    numero_expediente = db.Column(db.String(100))
    juzgado = db.Column(db.String(400))
    estado_actual = db.Column(db.String(100))

    def __init__(self, caratula, numero_expediente, juzgado, estado_actual):
        self.caratula = caratula
        self.numero_expediente = numero_expediente
        self.juzgado = juzgado
        self.estado_actual = estado_actual

with app.app_context():
    db.create_all()  # aqui crea todas las tablas

class ExpedienteSchema(ma.Schema):
    class Meta:
        fields = ('id', 'caratula', 'numero_expediente', 'juzgado', 'estado_actual')

expediente_schema = ExpedienteSchema()
expedientes_schema = ExpedienteSchema(many=True)


@app.route('/expedientes/ordenar/id', methods=['GET'])
def ordenar_por_id():
    expedientes_ordenados = Expediente.query.order_by(-Expediente.id).all()  # Orden descendente por ID
    result = expedientes_schema.dump(expedientes_ordenados)
    return jsonify(result)

@app.route('/expedientes', methods=['GET'])
def get_expedientes():
    all_expedientes = Expediente.query.order_by(Expediente.estado_actual).all()
    result = expedientes_schema.dump(all_expedientes)
    return jsonify(result)

@app.route('/expedientes/<id>', methods=['GET'])
def get_expediente(id):
    expediente = Expediente.query.get(id)
    return expediente_schema.jsonify(expediente)

@app.route('/expedientes/<id>', methods=['DELETE'])
def delete_expediente(id):
    expediente = Expediente.query.get(id)
    db.session.delete(expediente)
    db.session.commit()
    return expediente_schema.jsonify(expediente)

@app.route('/expedientes', methods=['POST'])
def create_expediente():
    caratula = request.json['caratula']
    numero_expediente = request.json['numero_expediente']
    juzgado = request.json['juzgado']
    estado_actual = request.json['estado_actual']
    new_expediente = Expediente(caratula, numero_expediente, juzgado, estado_actual)
    db.session.add(new_expediente)
    db.session.commit()
    return expediente_schema.jsonify(new_expediente)

@app.route('/expedientes/<id>', methods=['PUT'])
def update_expediente(id):
    expediente = Expediente.query.get(id)
    expediente.caratula = request.json['caratula']
    expediente.numero_expediente = request.json['numero_expediente']
    expediente.juzgado = request.json['juzgado']
    expediente.estado_actual = request.json['estado_actual']
    db.session.commit()
    return expediente_schema.jsonify(expediente)

@app.route('/expedientes/buscar', methods=['GET'])
def buscar_expedientes():
    palabra_clave = request.args.get('q')  # Obtener la palabra clave de los parámetros de consulta (?q=palabraclave)
    expedientes_filtrados = Expediente.query.filter(
        db.or_(
            Expediente.caratula.like(f"%{palabra_clave}%"),  # Filtrar por el campo caratula
            Expediente.numero_expediente.like(f"%{palabra_clave}%"),  # Filtrar por el campo numero_expediente
            Expediente.juzgado.like(f"%{palabra_clave}%"),  # Filtrar por el campo juzgado
            Expediente.estado_actual.like(f"%{palabra_clave}%")  # Filtrar por el campo estado_actual
        )
    ).all()
    result = expedientes_schema.dump(expedientes_filtrados)
    return jsonify(result)

@app.route('/expedientes/estado/inicio', methods=['GET'])
def get_expedientes_inicio():
    expedientes_inicio = Expediente.query.filter_by(estado_actual='Inicio').all()
    result = expedientes_schema.dump(expedientes_inicio)
    return jsonify(result)

@app.route('/expedientes/estado/prueba', methods=['GET'])
def get_expedientes_prueba():
    expedientes_prueba = Expediente.query.filter_by(estado_actual='Prueba').all()
    result = expedientes_schema.dump(expedientes_prueba)
    return jsonify(result)

@app.route('/expedientes/estado/ejecucion', methods=['GET'])
def get_expedientes_ejecucion():
    expedientes_ejecucion = Expediente.query.filter_by(estado_actual='Ejecución').all()
    result = expedientes_schema.dump(expedientes_ejecucion)
    return jsonify(result)

@app.route('/expedientes/estado/archivado', methods=['GET'])
def get_expedientes_archivado():
    expedientes_archivado = Expediente.query.filter_by(estado_actual='Archivado').all()
    result = expedientes_schema.dump(expedientes_archivado)
    return jsonify(result)


@app.route('/')
def hello_world():
    return 'Hello from Flask!'



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
