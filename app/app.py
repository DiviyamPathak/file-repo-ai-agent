from flask import Flask, request, jsonify
from google.cloud import storage
import os
from werkzeug.utils import secure_filename
from db import pool
import mimetypes
from flask_cors import CORS
from sqlalchemy import text

app = Flask(__name__)
# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
BUCKET_NAME = "filerepouploads"
storage_client = storage.Client()
bucket = storage_client.bucket(BUCKET_NAME)
CORS(app)


def upload_to_gcs(file, filename):

    blob = bucket.blob(filename)
    blob.upload_from_file(file)
    return f"https://storage.googleapis.com/{BUCKET_NAME}/{filename}"


def insert_file(filename, filepath, filesize, filetype, tags):
    query = text("""
        INSERT INTO files (filename, filepath, filesize, filetype, tags)
        VALUES (:filename, :filepath, :filesize, :filetype, :tags)
    """)
    with pool.connect() as db_con: 
        print("data exec")   
        db_con.execute(query, {"filename":filename, "filepath":filepath, "filesize":filesize, "filetype":filetype, "tags":tags})
        db_con.commit()

def search_files_by_tag(tag):
    query = "SELECT * FROM files WHERE tags LIKE %s"
    with pool.connect() as db_con:
        return db_con.execute(query, (f"%{tag}%",)).fetchall()

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files['file']
    tags = request.form.get('tags', '')

    if file.filename == '':
        return jsonify({"error": "No selected file"})

    filename = secure_filename(file.filename)
    
    # filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    # file.save(filepath)
    filesize = file.content_length if file.content_length else 0
    filetype = mimetypes.guess_type(filename)[0] or 'unknown'  
    file_url = upload_to_gcs(file, filename)
    
    insert_file(filename, file_url, filesize, filetype, tags)
    return jsonify({
        "message": "File uploaded successfully!",
        "filename": filename,
        "filepath": file_url,
        "filesize": filesize,
        "filetype": filetype,
        "tags": tags
    })

@app.route('/files', methods=['GET'])
def list_files():
    with pool.connect() as db_con:
        
        result = db_con.execute(text('SELECT * FROM files')).fetchall()
        files = [dict(row._mapping) for row in result]
        print(files)
        return files

@app.route('/search', methods=['GET'])
def search_files():
    tag = request.args.get('tag')
    results = search_files_by_tag(tag)
    return jsonify(results)

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    BUCKET_NAME = "filerepouploads"
    storage_client = storage.Client()
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(filename)

    if not blob.exists():
        return jsonify({"error": "File not found"}), 404

    public_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{filename}"

    if blob.acl.get_entity("allUsers"):
        return jsonify({"download_url": public_url})

    signed_url = blob.generate_signed_url(expiration=3600)
    return jsonify({"download_url": signed_url})

# @app.route('/delete/<filename>',methods=['DELETE'])

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))  
    app.run(host="0.0.0.0", port=port, debug=True)