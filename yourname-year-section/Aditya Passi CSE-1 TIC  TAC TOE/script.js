let boxes = document.querySelectorAll(".box")
let reset_btn = document.querySelector("#reset-btn")
let container = document.querySelector(".container")

const win_pattern = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8]
]

let turn = true;


boxes.forEach((box) => {
  box.addEventListener("click", () => {
    console.log("box was clicked");
    if (turn) {
      box.innerText = "O";
      turn = false
    } else {
      box.innerText = "X";
      turn = true
    }
    box.disabled = true
    checkwinner()
  })



})



    
function checkwinner() {
  let winnerFound = false;

  for (let pattern of win_pattern) {
    let box1 = boxes[pattern[0]].innerText;
    let box2 = boxes[pattern[1]].innerText;
    let box3 = boxes[pattern[2]].innerText;

    if (box1 && box2 && box3 && box1 === box2 && box2 === box3) {
      console.log("winner", box1);
      highlight_winner(pattern);
      display_winner(box1);
      boxes.forEach((box) => (box.disabled = true));
      winnerFound = true;
      break; 
    }
  }


  if (!winnerFound && [...boxes].every((box) => box.innerText !== "")) {
    display_winner("DRAW");
  }
}


function display_winner(winner) {
  let winner_name = document.createElement("p");
  winner_name.setAttribute("class", "winner-text")
  winner_name.style.cssText = "font-size:2rem; font-weight:bold; color:white; text-align:center; margin-top:20px;";
  let winner_text = `WINNER IS ${winner}`;
  winner_name.innerText = winner_text
  container.appendChild(winner_name)
}

function highlight_winner(pattern) {
  pattern.forEach((index) => {
    boxes[index].style.backgroundColor = "lightgreen";
    boxes[index].style.transition = "0.4s";
  });
}




reset_btn.addEventListener("click", () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
    box.style.backgroundColor = "";
  });


  let winner_text = document.querySelector(".winner-text");
  if (winner_text) {
    winner_text.remove();
  }

  turn = true;
});


