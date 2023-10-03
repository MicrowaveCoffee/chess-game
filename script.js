//wait for the DOM to be fully loaded before executing code

document.addEventListener('DOMContentLoaded', () => {
    let board = null; //Initailize the chessboard
    const game = new Chess(); // Create new Chess.js game instance
    const moveHistory = document.getElementById('move-history')  //get move history
    let moveCount = 1; //Initialize the move count
    let userColor = 'w' //Initialize the user's color as white



    //Function to make a random move for the computer
    const makeRandomMove = () => {
        const possibleMoves = game.moves();

        if(game.game_over()) {
            alert('Checkmate');
        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount); //Record and display the move with move count
            moveCount++ //Increment the move count
        }
    };

    //function to record and display a move in the move history
    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil (count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight; //Auto-scroll to the latest move
    };

    //function to handle the start of a drag position
    const onDragStart = (source, piece) => {
        //allow the user to drag only their own pieces based on color
        return !game.game_over() && piece.search(userColor) === 0;
    };

    // function to handle a piece drop on the board
    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if(move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount);  //Record and display the move with move count
        moveCount++
    };

    //function to handle the end of a piece snap animation
    const onSnapEnd = () => {
        board.position(game.fen());
    }

    //configuration options for the chessboard
    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100
    };

    //Initialize the chessboard
    board = Chessboard('board', boardConfig);

    // Event listener for the 'Play Again' button
    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        useerColor = 'w';
    });

    //Event listner for the 'set position' button
    document.querySelector('.set-pos').addEventListener('click', () =>{
       const fen = prompt('Enter the FEN notation for the desired position!');
       if(fen !== null) {
        if (game.load(fen)) {
            board.position(fen);
            moveHistory.textContent = '';
            moveCount = 1;
            userColor = 'w';
        } else {
            alert('Invalid FEN notation. Please try again');
        }
       } 
    });

    //Event listener for the 'FLIP Board' button 
    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        makeRandomMove();

        //Toggle user's color after flipping the board
        userColor = userColor === 'w' ? 'b' : 'w';
    })
})
