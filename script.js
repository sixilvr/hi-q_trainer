//TODO: TTS

window.onerror = function(msg, url, linenumber) {
  alert('Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
  return true;
}

const isMob = window.innerHeight / window.innerWidth > 1;

document.addEventListener("keyup", (e) => {
  if (e.ctrlKey && e.key == "Enter") {
    submitQuestions();
  }
});

const textArea = document.getElementById("textArea");
textArea.value = window.localStorage.getItem("questions");

function submitQuestions() {
  const questionsText = textArea.value;
  window.localStorage.setItem("questions", questionsText);
  if (!questionsText) {
    alert("ERROR: No questions entered");
    return;
  }
  const questionsAndAnswers = textArea.value.split("\n");
  let questions = [];
  let excludeInvalid = document.getElementById("ignoreBox").checked;
  for (let i = 0; i < questionsAndAnswers.length; i++) {
    if (questionsAndAnswers[i] == "") {
      continue;
    }
    if (!questionsAndAnswers[i].includes("?")) {
      if (!excludeInvalid) {
        if (confirm(`ERROR: Question ${i + 1} does not contain a question mark:
${questionsAndAnswers[i]}
Do you want to ignore lines without question marks?`)) {
          excludeInvalid = true;
          continue;
        } else {
          return;
        }
      } else {
        continue;
      }
    }
    questions.push(questionsAndAnswers[i].split("?"));
    questions[questions.length - 1][0] += "?";
  }
  const shuffleBox = document.getElementById("shuffleBox");
  const board = document.getElementById("board");
  board.innerHTML = `<h2>Questions:</h2>
<p><em>${isMob ? "Select" : "Mouse over"} answers to reveal them.
If you know a question, click on its ${isMob ? "its button" : "answer"} to remove it.
Click on the Shuffle button to randomize the questions.</em></p>
<div id="questionArea"></div>
<button onclick="shuffleBoard()">Shuffle</button>
<button onclick="location.reload()">Back</button>
`;
  document.getElementById("footer").remove();
  if (shuffleBox.checked) {
    shuffle(questions);
  }
  askQuestions(questions);
}

function askQuestions(questions) {
  const questionArea = document.getElementById("questionArea");
  for (let i = 0; i < questions.length; i++) {
    if (isMob) {
      questionArea.innerHTML += '<div><button onclick="this.parentNode.remove();" style="font-size: 10px;">X</button>&nbsp;<p style="display: inline;">' 
        + questions[i][0] + '&nbsp;<span class="answer">' + questions[i][1] + "</span></p></div>";
    } else {
      questionArea.innerHTML += '<p>'+ questions[i][0] + '&nbsp;<span class="answer" onclick="this.parentNode.remove()">'
        + questions[i][1] + "</span></p>";
    }
  }
}

function shuffleBoard() {
  const questionArea = document.getElementById("questionArea");
  let questions = [];
  for (let i = 0; i < questionArea.children.length; i++) {
    questions.push(questionArea.children[i].outerHTML);
  }
  shuffle(questions);
  questionArea.innerHTML = questions.join("");
}

function shuffle(arr) {
  for (let i = 0; i < arr.length; i++) {
    let index = Math.floor(Math.random() * arr.length);
    [arr[i], arr[index]] = [arr[index], arr[i]]
  }
  return arr;
}
