from flask import Flask, request, jsonify
import openai
import os

app = Flask(__name__)

# Use environment variable for OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")

@app.route("/")
def home():
    return "Bangla Counseling AI is running."

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        client = openai.OpenAI(api_key=openai_api_key)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=150
        )

        reply = response.choices[0].message.content
        return jsonify({"response": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
