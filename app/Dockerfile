FROM python


WORKDIR /app
COPY . /app

RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt
EXPOSE 8080


CMD ["gunicorn", "-b", "0.0.0.0:8080", "--timeout", "500", "app:app"]
