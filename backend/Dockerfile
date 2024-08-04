FROM python:3 AS builder

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 8000
CMD ["uvicorn", "app.main:app","--port", "8000","--host", "0.0.0.0", "--forwarded-allow-ips", "*","--reload"]