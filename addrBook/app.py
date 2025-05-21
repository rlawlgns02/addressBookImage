from flask import Flask, render_template, request, redirect
import csv
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/images'

# 이미지 업로드 폴더가 없으면 생성
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add', methods=['POST'])
def add_contact():
    name = request.form['pyname']
    phone = request.form['pyphone']
    birthday = request.form['pybirthday']
    
    # 이미지 처리
    image_filename = ''
    if 'pyphoto' in request.files:
        photo = request.files['pyphoto']
        if photo.filename != '':
            # 원본 파일의 확장자 추출
            file_ext = os.path.splitext(photo.filename)[1]
            # 파일명 생성 시 확장자 포함
            image_filename = f"{name}{file_ext}"
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))

    # CSV 파일에 저장
    with open('addbook.txt', 'a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow([name, phone, birthday, image_filename])

    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)