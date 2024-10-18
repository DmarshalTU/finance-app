from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
import json
import os
from pymongo import MongoClient

# Initialize MongoDB client
MONGODB_URI = os.environ.get("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client.finance_app

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        # Fetch transactions from MongoDB
        transactions = list(db.transactions.find({}, {'_id': False}))
        self.wfile.write(json.dumps(transactions).encode())

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        # Insert new transaction into MongoDB
        db.transactions.insert_one(data)

        self.send_response(201)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"message": "Transaction added successfully"}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type")
        self.end_headers()