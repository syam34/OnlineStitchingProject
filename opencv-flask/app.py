from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

def simple_measurements(img):
    # Convert to gray
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Simple threshold to find body shape
    _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None
    
    c = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(c)

    # Estimation based on bounding box
    shoulder = int(w * 0.21)  # Assume shoulder width is 80% of bbox width
    chest = int(w * 0.4)
    waist = int(w * 0.29)
    neck = int(w * 0.23)
    sleeve = int(h * 0.21)

    return {
        "shoulder": shoulder,
        "chest": chest,
        "waist": waist,
        "neck": neck,
        "sleeve": sleeve
    }

@app.route('/analyze', methods=['POST'])
def analyze_pose():
    file = request.files['media']
    if file:
        nparr = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        measurements = simple_measurements(img)
        if measurements:
            return jsonify({"measurements": measurements})
        else:
            return jsonify({"error": "No body detected"}), 400

    return jsonify({"error": "No file uploaded"}), 400

if __name__ == '__main__':
    app.run(port=5001)
