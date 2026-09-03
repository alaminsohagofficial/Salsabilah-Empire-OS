import os
from flask import Flask, jsonify

# Initialize Flask Application for Salsabilah Empire OS
app = Flask(__name__)

class SalsabilahEmpireOS:
    def __init__(self):
        self.company = "Salsabilah Amin Empires Ltd."
        self.brand = "Salsabilah Empire POS"
        self.location = "SR Electronics Park, Hatboalia, Chuadanga"
        self.status = "Operational & Secured"
        self.co_operation = "Gemini AI Core"

    def get_dashboard_html(self):
        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{self.brand} | Control Center</title>
            <style>
                body {{
                    font-family: 'Inter', sans-serif;
                    background-color: #020617;
                    color: #f8fafc;
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }}
                .terminal-card {{
                    background: rgba(15, 23, 42, 0.95);
                    border: 1px solid #D4AF37;
                    padding: 40px;
                    border-radius: 12px;
                    max-width: 600px;
                    width: 100%;
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.5);
                }}
                h1 {{
                    color: #D4AF37;
                    font-size: 1.5rem;
                    margin-bottom: 5px;
                    letter-spacing: 1px;
                }}
                .badge {{
                    background: #34A853;
                    color: #000;
                    padding: 4px 10px;
                    font-size: 0.75rem;
                    font-weight: bold;
                    border-radius: 4px;
                    display: inline-block;
                    margin-bottom: 20px;
                }}
                .info-row {{
                    display: flex;
                    justify-content: space-between;
                    margin: 12px 0;
                    border-bottom: 1px solid #1e293b;
                    padding-bottom: 8px;
                    font-size: 0.95rem;
                }}
                .label {{ color: #94a3b8; }}
                .value {{ color: #38bdf8; font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="terminal-card">
                <h1>👑 {self.company}</h1>
                <div class="badge">{self.status}</div>
                
                <div class="info-row">
                    <span class="label">System Core:</span>
                    <span class="value">{self.brand}</span>
                </div>
                <div class="info-row">
                    <span class="label">Location Base:</span>
                    <span class="value">{self.location}</span>
                </div>
                <div class="info-row">
                    <span class="label">Partnership:</span>
                    <span class="value">{self.co_operation}</span>
                </div>
                <div class="info-row">
                    <span class="label">SMS Service:</span>
                    <span class="value">Salsabilah Lifetime Free API</span>
                </div>
            </div>
        </body>
        </html>
        """

@app.route('/')
def home():
    os_kernel = SalsabilahEmpireOS()
    return os_kernel.get_dashboard_html()

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
