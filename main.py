# app.py
from flask import Flask

app = Flask(__name__)

class SalsabilahEmpire:
    def __init__(self):
        self.brand = "Salsabilah Amin Empires Ltd."
        self.location = "SR Electronics Park, Hatboalia"
        self.target = 1000

    def get_status(self):
        return f"--- {self.brand} ---<br>Status: Online & Armed<br>Goal: Managing {self.target} Businesses<br>Location: {self.location}"

@app.route('/')
def home():
    os_sys = SalsabilahEmpire()
    return os_sys.get_status()

if __name__ == "__main__":
    app.run(debug=True)
