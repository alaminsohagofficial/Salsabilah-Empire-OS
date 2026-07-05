import os
from flask import Flask

# Flask অ্যাপ ভেরিয়েবল তৈরি
app = Flask(__name__)

class SalsabilahEmpire:
    def __init__(self):
        self.brand = "Salsabilah Amin Empires Ltd."
        self.location = "SR Electronics Park, Hatboalia"
        self.target = 1000

    def get_status(self):
        return (
            f"<div style='font-family: monospace; padding: 20px; background: #0f172a; color: #38bdf8; border-radius: 8px; max-width: 500px; margin: 50px auto; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);'>"
            f"<h2 style='color: #f43f5e; margin-top: 0;'>👑 {self.brand}</h2>"
            f"<hr style='border-color: #334155;'>"
            f"<p><strong>Status:</strong> <span style='color: #4ade80;'>Online & Armed</span></p>"
            f"<p><strong>Goal:</strong> Managing {self.target} Businesses</p>"
            f"<p><strong>Location:</strong> {self.location}</p>"
            f"</div>"
        )

@app.route('/')
def home():
    os_sys = SalsabilahEmpire()
    return os_sys.get_status()

if __name__ == "__main__":
    # সার্ভার পোর্ট সেটআপ (ক্লাউড হোস্টিংয়ের জন্য প্রয়োজনীয়)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
