class Model
{
    constructor(variant, minutes, increment)
    {
        this.variant = variant;
        this.chessboards = [new Chessboard(this.setupChessboard(variant))];
        this.moveNumber = 0;
        this.currentMoveNumber = 0;
        this.currentPlayer = 0;
        this.chessboardDirection = 0;
        this.currentSquare = undefined;
        this.legalMoves = [];
        this.whiteAdvantages = [0];
        this.clocks = [new Clock(0, minutes, 0, increment), new Clock(0, minutes, 0, increment)];
        this.hasStarted = false;
        this.gameOver = false;
        this.winner = undefined;
        this.squareNameOption = false;
        this.automatedSpinningOption = false;
        this.colors = COLORS;
        this.chessboardColor = this.colors[0];
    }

    /* ----------------------------------------- */
    /* ---------- GETTERS AND SETTERS ---------- */
    /* ----------------------------------------- */

    getVariant()
    {
        return this.variant;
    }

    setVariant(variant)
    {
        this.variant = variant;
    }

    getChessboards(moveNumber)
    {
        return this.chessboards[moveNumber];
    }

    getMoveNumber()
    {
        return this.moveNumber;
    }

    getCurrentMoveNumber()
    {
        return this.currentMoveNumber;
    }

    getCurrentPlayer()
    {
        return this.currentPlayer;
    }

    getChessboardDirection()
    {
        return this.chessboardDirection;
    }

    getCurrentSquare()
    {
        return this.currentSquare;
    }

    setCurrentSquare(square)
    {
        this.currentSquare = square;
    }

    getLegalMoves()
    {
        return this.legalMoves;
    }

    getWhiteAdvantages(moveNumber)
    {
        return this.whiteAdvantages[moveNumber];
    }

    spinChessboard()
    {
        this.chessboardDirection = 1 - this.chessboardDirection;
    }

    getPlayerClock(player)
    {
        return this.clocks[player];
    }

    setPlayerClocks(minutes, increment)
    {
        this.clocks[0] = new Clock(0, minutes, 0, increment);
        this.clocks[1] = new Clock(0, minutes, 0, increment);
    }

    getHasStarted()
    {
        return this.hasStarted;
    }

    getGameOver()
    {
        return this.gameOver;
    }

    getWinner()
    {
        return this.winner;
    }

    getSquareNameOption()
    {
        return this.squareNameOption;
    }

    setSquareNameOption()
    {
        this.squareNameOption = !this.squareNameOption;
    }

    getAutomatedSpinningOption()
    {
        return this.automatedSpinningOption;
    }

    setAutomatedSpinningOption()
    {
        this.automatedSpinningOption = !this.automatedSpinningOption;
    }

    getColors()
    {
        return this.colors;
    }

    getChessboardColor()
    {
        return this.chessboardColor;
    }

    setChessboardColor(value)
    {
        this.chessboardColor = value;
    }

    /* ----------------------------- */
    /* ---------- ACTIONS ---------- */
    /* ----------------------------- */

    setupChessboard()
    {
        let pieces = {};

        switch (variant)
        {
            case 'std':
                for (let j = MIN ; j <= MAX ; j++)
                {
                    pieces[getSquare(j, 1)] = new Piece(WHITE, NAMES[j-1]);
                    pieces[getSquare(j, 2)] = new Piece(WHITE, PAWN);
                    pieces[getSquare(j, 7)] = new Piece(BLACK, PAWN);
                    pieces[getSquare(j, 8)] = new Piece(BLACK, NAMES[j-1]);
                }
                break;
            case '960':
                let columns = [0,1,2,3,4,5,6,7];
                let names = [...NAMES];
                let randomNumber1, randomNumber2;
                // Even square bishop column
                randomNumber1 = Math.floor(Math.random() * 4) * 2; // Random number in [0,2,4,6]
                names[randomNumber1] = BISHOP;
                // Odd square bishop column
                randomNumber2 = Math.floor(Math.random() * 4) * 2 + 1; // Random number in [1,3,5,7]
                console.log(randomNumber2);
                names[randomNumber2] = BISHOP;
                columns = columns.filter(column => column !== randomNumber1 && column !== randomNumber2);
                // Queen column
                randomNumber1 = Math.floor(Math.random() * columns.length);
                names[columns[randomNumber1]] = QUEEN;
                columns = columns.filter((_,i) => i !== randomNumber1);
                // Knight columns
                for (let i=0 ; i<2 ; i++)
                {
                    randomNumber1 = Math.floor(Math.random() * columns.length);
                    names[columns[randomNumber1]] = KNIGHT;
                    columns = columns.filter((_,i) => i !== randomNumber1);
                }
                // Left rook, king and right rook columns
                names[columns[0]] = ROOK;
                names[columns[1]] = KING;
                names[columns[2]] = ROOK;

                for (let j = MIN ; j <= MAX ; j++)
                {
                    pieces[getSquare(j, 1)] = new Piece(WHITE, names[j-1]);
                    pieces[getSquare(j, 2)] = new Piece(WHITE, PAWN);
                    pieces[getSquare(j, 7)] = new Piece(BLACK, PAWN);
                    pieces[getSquare(j, 8)] = new Piece(BLACK, names[j-1]);
                }
                break;
        }

        return pieces;
    }

    calculateAllMoves()
    {
        this.legalMoves = {};
        this.legalMoves = this.chessboards[this.moveNumber].allMoves(this.currentPlayer, this.moveNumber, this.variant);
    }

    pushChessclock()
    {
        this.clocks[1 - this.currentPlayer].stop();
        this.clocks[1 - this.currentPlayer].addIncrement();
        this.clocks[this.currentPlayer].start();
    }

    saveMove(newSquare)
    {
        this.hasStarted = true;
        let newChessboard = this.chessboards[this.moveNumber].cloneDeepChessboard();
        newChessboard.move(this.currentSquare, newSquare, this.legalMoves[this.currentSquare][newSquare].kindOfMove, this.moveNumber);
        this.chessboards.push(newChessboard);
        this.moveNumber++;
        this.currentMoveNumber = this.moveNumber;
        this.currentPlayer = 1 - this.currentPlayer;
        if (this.automatedSpinningOption)
        {
            this.chessboardDirection = this.currentPlayer;
        }
        this.pushChessclock();
        this.calculateAllMoves();
        this.calculateAdvantage();
    }

    calculateAdvantage()
    {
        this.whiteAdvantages[this.moveNumber] = this.chessboards[this.moveNumber].calculateWhiteAdvantage();
    }

    goToAnotherMove(data)
    {
        switch (data.option)
        {
            case 'first':
                this.currentMoveNumber = 0;
                break;
            case 'previous':
                if (this.currentMoveNumber > 0)
                {
                    this.currentMoveNumber--;
                }
                break;
            case 'next':
                if (this.currentMoveNumber < this.moveNumber)
                {
                    this.currentMoveNumber++;
                }
                break;
            case 'last':
                this.currentMoveNumber = this.moveNumber;
                break;
        }
    }

    cancelMove()
    {
        this.chessboards.pop();
        this.moveNumber--;
        this.currentMoveNumber = this.moveNumber;
        this.currentPlayer = 1 - this.currentPlayer;
        this.clocks[1 - this.currentPlayer].stop();
        this.clocks[this.currentPlayer].start();
        this.calculateAllMoves(this.currentPlayer);
    }

    currentPlayerIsChecked()
    {
        return this.chessboards[this.moveNumber].isChecked(this.currentPlayer);
    }

    noLegalMove()
    {
        return Object.keys(this.legalMoves).length === 0;
    }

    drawByInsufficientMaterial()
    {
        return this.chessboards[this.moveNumber].drawByInsufficientMaterial();
    }

    closeGame(player)
    {
        // We indicate that the game is over
        this.gameOver = true;
        // If there is a winner we indicate the winner
        if (player === 0 || player === 1)
        {
            this.winner = player;
        }
        // We stop the clock
        this.clocks[this.currentPlayer].stop();
    }

    /**
     * Get the css color class of a square
     * @param {string} square
     * @returns the color of the square
     */
    getSquareColor(square)
    {
        const color = (getLine(square) % 2 === 0) ? (getColumn(square) % 2 === 0) ? 'light-' + this.chessboardColor.toLowerCase() : 'dark-' + this.chessboardColor.toLowerCase() : (getColumn(square) % 2 === 0) ? 'dark-' + this.chessboardColor.toLowerCase() : 'light-' + this.chessboardColor.toLowerCase();
        
        return color;
    }
}
