class Controller
{
    constructor(model, view)
    {
        this.model = model;
        this.view = view;
        this.gameOverTimeoutId = undefined;
        // this.timeControlList = new bootstrap.Modal(document.getElementById('timeControlList'), {
        //     backdrop: 'static',
        //     keyboard: false,
        // });
    }

    startGame()
    {
        this.model.calculateAllMoves();
        // this.timeControlList.show();
        this.view.displayChessboard(this.model);
        this.view.displayProgressBar(this.model, false);
        this.view.displayPlayerData(this.model);
        this.view.displayClock(this.model, 0);
        this.view.displayClock(this.model, 1);
        this.view.displayButtons(this.model);
        this.view.displayOptions(this.model);
    }

    startGameOverTimeout(player)
    {
        this.gameOverTimeoutId = setTimeout(() => {
            //console.log('game over');
            this.model.closeGame(1 - player);
            this.view.displayChessboard(this.model, player);
            this.view.stopDisplayClock();
            this.view.displayClock(this.model, 0);
            this.view.displayClock(this.model, 1);
            this.view.displayProgressBar(this.model, true);
        }, this.model.getPlayerClock(player).getTime());
    }

    stopGameOverTimeout()
    {
        clearTimeout(this.gameOverTimeoutId);
    }

    changeVariant(value)
    {
        this.model.setVariant(value);
    }

    chooseTimeControl(data)
    {
        this.model.setPlayerClocks(data.minutes, data.increment);
        this.view.displayClock(this.model, 0);
        this.view.displayClock(this.model, 1);
        if (this.model.getVariant() === 'Chess 960')
        {
            // Setup the chessboard
            this.model.setChessBoard();
            // Display the chessboard
            this.view.displayChessboard(this.model);
        }
        // this.timeControlList.hide();
    }

    dragstart(event)
    {
        /* TODO disable drag image */
    }

    dragover(event)
    {
        event.preventDefault();
    }

    dropPiece(event)
    {
        event.preventDefault();

        if (!this.model.getGameOver())
        {
            let currentSquare = this.model.getCurrentSquare();
            let square = event.target.dataset.indexNumber;

            if (currentSquare !== undefined)
            {
                if (this.model.getLegalMoves()[currentSquare][square] !== undefined)
                {
                    this.saveMove(square);
                }
                this.model.setCurrentSquare(undefined);
                this.view.displayChessboard(this.model);
            }
        }
        
    }

    clickOnBoard(square)
    {
        // If the game is on
        if (!this.model.getGameOver())
        {
            let currentSquare = this.model.getCurrentSquare();
            // If the user clicked on a piece and the piece can be moved
            if (this.model.getLegalMoves()[square] !== undefined)
            {
                this.model.setCurrentSquare(square);
                this.view.displayChessboard(this.model);
            }
            else
            {
                if (currentSquare !== undefined)
                {
                    if (this.model.getLegalMoves()[currentSquare][square] !== undefined)
                    {
                        this.saveMove(square);
                    }
                    this.model.setCurrentSquare(undefined);
                    this.view.displayChessboard(this.model);
                }
            }
        }
    }

    saveMove(square)
    {
        this.model.saveMove(square);
        this.stopGameOverTimeout();
        this.view.stopDisplayClock();
        this.view.displayClock(this.model, 1 - this.model.getCurrentPlayer());
        this.view.displayButtons(this.model);
        // The player can't move
        if (this.model.noLegalMove())
        {
            // And the player is checked => 'Checkmate'
            if (this.model.currentPlayerIsChecked())
            {
                console.log('checkmate');
                this.model.closeGame(1 - this.model.getCurrentPlayer());
            }
            // And the player is not checked => 'Stalemate'
            else
            {
                console.log('stalemate');
                this.model.closeGame(undefined);
            }
            this.view.displayClock(this.model, 0);
            this.view.displayClock(this.model, 1);
        }
        // The player can move
        else
        {
            // And the material is insufficient => 'Draw by insufficient material'
            if (this.model.drawByInsufficientMaterial())
            {
                console.log('draw');
                this.model.closeGame(undefined);
                this.view.displayClock(this.model, 0);
                this.view.displayClock(this.model, 1);
            }
            // Else the game is on
            else
            {
                this.startGameOverTimeout(this.model.getCurrentPlayer());
                this.view.startDisplayClock(this.model, this.model.getCurrentPlayer());
            }
        }
        this.view.displayProgressBar(this.model, true);
    }

    spinChessboard()
    {
        this.model.spinChessboard();
        this.view.displayChessboard(this.model);
        this.view.displayProgressBar(this.model, false);
        this.view.displayPlayerData(this.model);
        this.view.displayClock(this.model, 0);
        this.view.displayClock(this.model, 1);
    }

    goToAnotherMove(data)
    {
        this.model.goToAnotherMove(data);
        // If the current move have changed
        if (data.moveNumber !== this.model.getCurrentMoveNumber())
        {
            this.view.displayChessboard(this.model);
        }
        this.view.displayButtons(this.model);
    }

    cancelMove()
    {
        if (!this.model.getGameOver())
        {
            if (this.model.getMoveNumber() > 0)
            {
                this.model.cancelMove();
                this.view.displayChessboard(this.model);
                this.view.displayProgressBar(this.model, false);
                this.view.displayPlayerData(this.model);
                this.view.stopDisplayClock();
                this.view.displayClock(this.model, 1 - this.model.getCurrentPlayer());
                this.view.startDisplayClock(this.model, this.model.getCurrentPlayer());
                this.view.displayButtons(this.model);
            }
        }
    }

    changeColor(value)
    {
        this.model.setChessboardColor(value);
        this.view.displayChessboard(this.model);
    }

    setSquareNameOption()
    {
        this.model.setSquareNameOption();
        this.view.displayChessboard(this.model);
    }

    setAutomatedSpinningOption()
    {
        this.model.setAutomatedSpinningOption();
    }
}
