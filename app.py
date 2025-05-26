from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")  # আপনার PythonAnywhere env var-এ সেট করুন

DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    prompt = data.get("prompt", "")

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "deepseek-chat",  # DeepSeek-এর উপযুক্ত মডেল নাম
        "messages": [
            {"role": "system", "content": "You are a helpful mental health counseling assistant who understands both Bangla and English."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload)
        result = response.json()

        if "choices" in result and result["choices"]:
            return jsonify({"response": result["choices"][0]["message"]["content"]})
        else:
            return jsonify({"error": "No response received from DeepSeek."})
    except Exception as e:
        return jsonify({"error": str(e)})
