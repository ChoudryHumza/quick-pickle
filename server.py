import json
from flask import Flask, render_template, abort, redirect, url_for, request
app = Flask(__name__)

# Load tutorial and quiz data
with open('tutorial_data.json', 'r') as f:
    tut_data = json.load(f)['tutorial_pages']
pages = {item['page']: item for item in tut_data}

with open('quiz_data.json', 'r') as f:
    quiz_list = json.load(f)['quiz_questions']
quiz_map = {q['number']: q for q in quiz_list}



@app.route('/learn/<int:page>')
def learn(page):
    page_data = pages.get(page)
    if not page_data:
        abort(404)
    return render_template('page.html', page=page_data)

@app.route('/quiz')
def quiz_start():
    return redirect(url_for('quiz_question', num=1))



@app.route('/quiz/<int:num>', methods=['GET', 'POST'])
def quiz_question(num):
    question = quiz_map.get(num)
    if not question:
        return redirect(url_for('quiz_results'))
    if request.method == 'POST':
        # handle answer submission (store score via session or DB)
        next_num = num + 1
        return redirect(url_for('quiz_question', num=next_num))
    return render_template('quiz.html', question=question)


@app.route('/quiz/results')
def quiz_results():
    # Render your results template
    return render_template('results.html')


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True, port=50001)