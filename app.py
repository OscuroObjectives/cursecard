from flask import Flask, request, jsonify
import os
import subprocess

from flask_cors import CORS
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return "Curse Card Verification Server Running"


@app.route("/verify", methods=["POST"])
def verify():

    if "image" not in request.files:
        return jsonify({
            "verified": False,
            "message": "No image uploaded."
        })

    image = request.files["image"]

    filepath = os.path.join(
        UPLOAD_FOLDER,
        "test.jpeg"
    )

    image.save(filepath)

    result = subprocess.run(
        ["python", "compare.py"],
        capture_output=True,
        text=True
    )

    output = result.stdout.upper()

    if "CURSE CARD VERIFIED" in output:

        return jsonify({

            "verified": True

        })

    return jsonify({

        "verified": False

    })


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )