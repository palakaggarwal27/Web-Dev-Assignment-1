document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    loaded();
    
});



function loaded() {
    const cell = document.getElementsByClassName('cell');
    const reset=document.getElementById('resetBtn');
    console.log(reset);

    let currentplayer = 'X';
    let win=false;
    player=document.getElementById('player');

    


    for (let i = 0; i < cell.length; i++) {
      cell[i].addEventListener('click', mark);
      }

    reset.addEventListener('click', resetGame);
    reset.addEventListener('click', () => {
        currentplayer = 'X';
        player.textContent = 'X';
    });

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function resetGame(d) {
        await delay(d||0);
        for (let i = 0; i < cell.length; i++) {
            const p = cell[i].querySelector('p');
            p.textContent = '';
            cell[i].style.pointerEvents = 'auto';
            cell[i].style.animation = '';
        }
        win = false;

        winline=document.getElementsByClassName('winline');
        for(let i=0;i<winline.length;i++){
            winline[i].style.display='none';}

        result=document.getElementsByClassName('result');
        for(let j=0;j<result.length;j++){
            result[j].style.display='none';
        }
    };

    async function mark(e) {
        const cellEl= e.currentTarget;
        const p = cellEl.querySelector('p');
        cellEl.style.animation = 'popIn 0.5s forwards';
        cellEl.style.pointerEvents = 'none';
      


        if (p.textContent.trim() === '') {
            p.textContent = currentplayer;
            if (currentplayer === 'X') {
                currentplayer = 'O';
                player.textContent="O";
            } else {
                currentplayer = 'X';
                player.textContent="X";
            }
            await checkWin();
            if (win === false) {
                checkfull();
            }
        }
    async function checkWin() {
        const Xscore=document.getElementById('Xscore');
        const Oscore=document.getElementById('Oscore');
        const winCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
    
        for (const i of winCombinations) {
            const [a, b, c] = i;
            const pA = cell[a].querySelector('p').textContent;
            const pB = cell[b].querySelector('p').textContent;
            const pC = cell[c].querySelector('p').textContent;
            if (pA && pA === pB && pA === pC) {
                drawLine(a,c);
                await delay(500);
                
                
                if (pA === 'X') {
                    Xscore.textContent=parseInt(Xscore.textContent) + 1;
                    document.getElementById('Xscore').style.animation = 'fadeIn 0.5s forwards';
                    document.getElementById("X").style.display='block';
                    win = true;
                    
                }
                else{
                    Oscore.textContent=parseInt(Oscore.textContent) + 1;
                    document.getElementById('Oscore').style.animation = 'fadeIn 0.5s forwards';
                    document.getElementById("O").style.display='block';
                    win = true;

                }
                resetGame(900);
                
                continue;
        }   
        
    }
    }
    async function checkfull() {
        let full = true;    
        for (let i = 0; i < cell.length; i++) {
            const p = cell[i].querySelector('p');
            if (p.textContent.trim() === '') {
                full = false;
                break;
            }
        }
        if (full) {
            await delay(500);
            
            document.getElementById("draw").style.display='block';
            resetGame(1000);
        }
}
}
    function drawLine(start, end) {
        if (start === 0 && end === 2) {
            document.getElementById('winHorizontalTop').style.display = 'block';
        } else if (start === 3 && end === 5) {
            document.getElementById('winHorizontalMiddle').style.display = 'block';
        } else if (start === 6 && end === 8) {
            document.getElementById('winHorizontalBottom').style.display = 'block';
        } else if (start === 0 && end === 6) {
            document.getElementById('winVerticalLeft').style.display = 'block';
        } else if (start === 1 && end === 7) {
            document.getElementById('winVerticalMiddle').style.display = 'block';
        } else if (start === 2 && end === 8) {
            document.getElementById('winVerticalRight').style.display = 'block';
        } else if (start === 0 && end === 8) {
            document.getElementById('winDiagonalLeft').style.display = 'block';
        } else if (start === 2 && end === 6) {
            document.getElementById('winDiagonalRight').style.display = 'block';
        }

    }

    


}



