from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/echo_marks")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key")

mongo = PyMongo(app)
jwt = JWTManager(app)

@app.route('/api/audio-notes', methods=['GET', 'POST'])
def manage_audio_notes():
    if request.method == 'POST':
        data = request.get_json()
        new_note = {
            'content': data['content'],
            'location': data['location'],
            'timeCreated': datetime.utcnow()
        }
        result = mongo.db.audio_notes.insert_one(new_note)
        return jsonify(str(result.inserted_id)), 201

    audio_notes = mongo.db.audio_notes.find()
    notes_list = [{
        'id': str(note['_id']),
        'content': note['content'],
        'location': note['location'],
        'timeCreated': note['timeCreated']
    } for note in audio_notes]
    return jsonify(notes_list)

if __name__ == '__main__':
    app.run(debug=True)
