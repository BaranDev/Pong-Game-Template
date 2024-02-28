from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def pong_game():
    return render_template('pong.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=False)
