from flask import Flask, request, jsonify, send_from_directory
import mysql.connector
import os
from werkzeug.utils import secure_filename
from db import cursor,db
import mimetypes
app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def insert_file(filename, filepath, filesize, filetype, tags):
    query = """
        INSERT INTO files (filename, filepath, filesize, filetype, tags)
        VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(query, (filename, filepath, filesize, filetype, tags))
    db.commit()

def search_files_by_tag(tag):
    query = "SELECT * FROM files WHERE tags LIKE %s"
    cursor.execute(query, (f"%{tag}%",))
    return cursor.fetchall()

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files['file']
    tags = request.form.get('tags', '')

    if file.filename == '':
        return jsonify({"error": "No selected file"})

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    filesize = os.path.getsize(filepath) 
    filetype = mimetypes.guess_type(filepath)[0] or 'unknown'  

    insert_file(filename, filepath, filesize, filetype, tags)
    return jsonify({
        "message": "File uploaded successfully!",
        "filename": filename,
        "filepath": filepath,
        "filesize": filesize,
        "filetype": filetype,
        "tags": tags
    })

@app.route('/files', methods=['GET'])
def list_files():
    cursor.execute("SELECT * FROM files")
    files = cursor.fetchall()
    return jsonify(files)

@app.route('/search', methods=['GET'])
def search_files():
    tag = request.args.get('tag')
    results = search_files_by_tag(tag)
    return jsonify(results)

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
