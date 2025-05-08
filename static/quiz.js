document.addEventListener('DOMContentLoaded', () => {




    
  // --- Score Helpers ---
  const getScore = () => parseInt(localStorage.getItem('quizScore') || '0', 10);
  const setScore = v => localStorage.setItem('quizScore', String(v));
  const incScore = () => setScore(getScore() + 1);

  // --- Determine current question number from the “QX/Y” prefix ---
  const numEl = document.querySelector('.quiz-content .quiz-number');
  const qNum   = numEl 
    ? Number((numEl.textContent.trim().match(/^Q(\d+)/) || [])[1]) 
    : null;

  // Reset on question 1
  if (qNum === 1) setScore(0);

  // --- Quiz interaction: feedback + scoring + next button ---
  const explanationDiv = document.querySelector('[id^="explanation"]');
  if (explanationDiv && qNum !== null) {
    // Insert feedback <p> above explanation
    const fb = document.createElement('p');
    fb.id = 'feedback-msg';
    fb.className = 'mt-2';
    explanationDiv.parentNode.insertBefore(fb, explanationDiv);

    // Parse correct letter
    const raw = (explanationDiv.querySelector('strong')?.nextSibling?.textContent || '').trim();
    const correct = raw.charAt(0);

    // Bind all quiz-radio inputs
    document.querySelectorAll('.quiz-content input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', e => {
          // Show correct/incorrect
          if (e.target.value === correct) {
            fb.textContent = 'Correct!';
            fb.style.color = 'green';
            incScore();
          } else {
            fb.textContent = 'Incorrect';
            fb.style.color = 'red';
      
            // Highlight the correct answer label in green
            const correctInput = document.querySelector(
              `.quiz-content input[type="radio"][value="${correct}"]`
            );
            if (correctInput) {
              // assumes <label for="…"> immediately follows the input
              let label = correctInput.nextElementSibling;
              // fallback: use for="" selector
              if (!label || label.tagName !== 'LABEL') {
                label = document.querySelector(`label[for="${correctInput.id}"]`);
              }
              if (label) label.style.color = 'green';
            }
          }
      
          // Reveal explanation
          explanationDiv.style.display = '';
          // Enable & show next button
          const nextBtn = document.getElementById('next-btn');
          nextBtn.classList.remove('disabled');
          nextBtn.style.display = 'inline-block';
          // Disable all choices
          document.querySelectorAll('.quiz-content input[type="radio"]')
                  .forEach(r => r.disabled = true);
        });
      });
  }

  // --- Results page: write score + show GIF ---
  const scoreEl = document.getElementById('score-text');
  if (scoreEl) {
    const total = Number(scoreEl.dataset.total || 9);
    const score = getScore();
    scoreEl.textContent = `You scored ${score} out of ${total}`;

    // Insert appropriate GIF
    const container = document.getElementById('gif-container');
    if (container) {
      const img = document.createElement('img');
      img.className = 'img-fluid';
      img.style.maxWidth = '400px';
      if (score >= 7) {
        img.src = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGo4bDJkMnQyemVobHcyY3VycWJwbHNxYWlnbjYxNGJlYWV3NzJ4NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/I50ptvXJYHoLZBPFbV/giphy.gif';       // <-- replace with your “success” GIF path
        img.alt = 'Great job!';
      } else {
        img.src = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODd3bDY1YnJiM2s5dTd5c2VtM3lveGcwM2hkYzN6aG5wOWJxOTRtbiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/xRyIsRCVTN70tBZPP1/giphy.gif';     // <-- replace with your “try again” GIF path
        img.alt = 'Better luck next time!';
      }
      container.appendChild(img);
    }
  }


});

