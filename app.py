import os
from flask import Flask, render_template, jsonify

# Initialize Flask Application for Salsabilah Empire OS
app = Flask(__name__)

@app.route('/')
def home():
    # templates/index.html ফাইলটি রেন্ডার করবে
    return render_template('index.html')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "success": True,
        "system": "Salsabilah-Empire-OS",
        "message": "All systems operational under Digit Theory."
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
