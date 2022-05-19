class View
{
    constructor()
    {
        this.chessboard = document.getElementById('chessboard');
        this.progressBar = document.getElementById('progress-bar');
        this.progressBarAnimationId = undefined;
        this.bottomPlayerData = document.getElementById('bottom-player-data');
        this.topPlayerData = document.getElementById('top-player-data');
        this.displayClockIntervalId = undefined;
        this.bottomClock = document.getElementById('bottom-clock');
        this.topClock = document.getElementById('top-clock');
        // this.endGameMessage = document.getElementById('endGameMessage');
        this.buttons = document.getElementById('buttons');
        this.options = document.getElementById('options');
    }

    displayChessboard(model)
    {
        //console.log('display chessboard');
        const chessboard = model.getChessboards(model.getCurrentMoveNumber());
        const legalMoves = model.getLegalMoves();
        let htmlChessboard = '<div class="chessboard bg-white">';
        let line, column, square, piece, currentSquare, isLegal, htmlSquare, htmlPiece, legalSquare;

        for (let i = MIN ; i <= MAX ; i++)
        {
            for (let j = MIN ; j <= MAX ; j++)
            {
                column = model.getChessboardDirection() ? (MAX + MIN) - j : j;
                line = model.getChessboardDirection() ? i : (MAX + MIN) - i;
                square = getSquare(column, line);
                piece = chessboard.getPiece(square);
                currentSquare = model.getCurrentSquare();
                isLegal = currentSquare !== undefined && legalMoves[currentSquare][square] !== undefined;
                /* HTML */
                htmlSquare = model.getSquareNameOption() ? `<span>${square}</span>` : '';
                htmlPiece = piece !== undefined ? `<img src="../images/pieces/${piece.getPlayerColor()}/${piece.getName()}.svg" data-index-number="${square}" draggable="true" ondragstart="game.dragstart(event)"/>` : '';
                legalSquare = isLegal ? 'legal-square' : '';
                htmlChessboard += `
                    <div class="${model.getSquareColor(square)} ${legalSquare}" data-index-number="${square}" onmousedown="game.clickOnBoard('${square}')" ondrop="game.dropPiece(event)" ondragover="game.dragover(event)">
                        ${htmlSquare}    
                        ${htmlPiece}
                    </div>
                `;
            }
        }
        htmlChessboard += '</div>';

        this.chessboard.innerHTML = htmlChessboard;
    }

    stopProgressBarAnimation()
    {
        clearInterval(this.progressBarAnimationId);
    }

    displayProgressBar(model, withAnimation)
    {
        this.stopProgressBarAnimation();

        /* Get the white advantage from the model */
        let previousAdvantage = model.getMoveNumber() === 0 ? 0 : model.getWhiteAdvantages(model.getMoveNumber() - 1); /* White advantage of the previous move */
        let currentAdvantage = model.getWhiteAdvantages(model.getMoveNumber()); /* White advantage of the current move */

        /* Convert white advantage to an height of the progress bar */
        /* Set the visibility and the text color of the advantage score (e.g. '+3') */
        let currentHeight, /* Current progress bar height */ finalHeight; /* Progress bar height to reach */
        let bottomProgressBarColor, topProgressBarColor, bottomAdvantage, topAdvantage, bottomTextColor, topTextColor;
        if (model.getChessboardDirection() === WHITE)
        {
            currentHeight = convertAdvantageToHeight(previousAdvantage);
            finalHeight = !model.getGameOver() ? convertAdvantageToHeight(currentAdvantage) : model.getWinner() === WHITE ? 100 : model.getWinner() === BLACK ? 0 : 50;
            bottomProgressBarColor = 'bg-light-progress-bar';
            topProgressBarColor = 'bg-dark-progress-bar';
            bottomAdvantage = currentAdvantage > 0 ? '+' + currentAdvantage : '';
            topAdvantage = currentAdvantage < 0 ? '+' + Math.abs(currentAdvantage) : '';
            bottomTextColor = 'text-black';
            topTextColor = 'text-white';
        }
        else
        {
            currentHeight = 100 - convertAdvantageToHeight(previousAdvantage);
            finalHeight = !model.getGameOver() ? 100 - convertAdvantageToHeight(currentAdvantage) : model.getWinner() === WHITE ? 0 : model.getWinner() === BLACK ? 100 : 50;
            bottomProgressBarColor = 'bg-dark-progress-bar';
            topProgressBarColor = 'bg-light-progress-bar';
            bottomAdvantage = currentAdvantage < 0 ? '+' + Math.abs(currentAdvantage) : '';
            topAdvantage = currentAdvantage > 0 ? '+' + currentAdvantage : '';
            bottomTextColor = 'text-white';
            topTextColor = 'text-black';
        }

        /* With animation */
        if (withAnimation)
        {
            /* Display the progress bar */
            this.progressBar.innerHTML = `
                <div class="top-progress-bar ${topProgressBarColor}">    
                    <span class="${topTextColor}">${topAdvantage}</span>
                    <div class="bottom-progress-bar ${bottomProgressBarColor}" style="height: ${currentHeight}%;">
                        <span class="${bottomTextColor}">${bottomAdvantage}</span>
                    </div>
                </div>
            `;

            /* If the advantage have changed, host the progress bar animation */
            if (currentHeight !== finalHeight)
            {
                let lessOrMoreOne = currentHeight <= finalHeight ? 1 : -1; /* Direction of the bar progress */
                this.progressBarAnimationId = setInterval(() => {
                    currentHeight += lessOrMoreOne;
                    this.progressBar.innerHTML = `
                        <div class="top-progress-bar ${topProgressBarColor}">
                            <span class="${topTextColor}">${topAdvantage}</span>
                            <div class="bottom-progress-bar ${bottomProgressBarColor}" style="height: ${currentHeight}%;">
                                <span class="${bottomTextColor}">${bottomAdvantage}</span>
                            </div>
                        </div>
                    `;
                    /* Stop the animation when the progress bar height was reached */
                    if (currentHeight === finalHeight) {
                        this.stopProgressBarAnimation();
                    }
                }, 20);
            }
        }
        /* Without animation */
        else
        {
            this.progressBar.innerHTML = `
                <div class="top-progress-bar ${topProgressBarColor}">
                    <span class="${topTextColor}">${topAdvantage}</span>
                    <div class="bottom-progress-bar ${bottomProgressBarColor}" style="height: ${finalHeight}%;">
                        <span class="${bottomTextColor}">${bottomAdvantage}</span>
                    </div>
                </div>
            `;
        }
    }

    displayPlayerData(model)
    {
        let whitePlayerData = `
            <div class="player-data">
                <div>
                    <span>Player 1</span>
                    <img class="flag" src="../images/icons/f-fra.png" height="24" width="24" draggable="false">
                </div>
                <div>
                    <span>White</span>
                </div>
            </div>
        `;

        let blackPlayerData = `
            <div class="player-data">
                <div>
                    <span>Player 2</span>
                    <img class="flag" src="../images/icons/f-fra.png" height="24" width="24" draggable="false">
                </div>
                <div>
                    <span>Black</span>
                </div>
            </div>
        `;
        
        if (model.getChessboardDirection() === 0)
        {
            this.bottomPlayerData.innerHTML = whitePlayerData;
            this.topPlayerData.innerHTML = blackPlayerData;
        }
        else
        {
            this.bottomPlayerData.innerHTML = blackPlayerData;
            this.topPlayerData.innerHTML = whitePlayerData;
        }
    }

    startDisplayClock(model, player)
    {
        this.displayClock(model, player);
        this.displayClockIntervalId = setInterval(() => {
            this.displayClock(model, player);      
        }, 1000);
    }

    stopDisplayClock()
    {
        clearInterval(this.displayClockIntervalId);
    }

    displayClock(model, player)
    {
        //console.log('display clock');
        let clockColor, htmlClock;
        if (model.getGameOver())
        {
            clockColor = model.getWinner() === player ? 'bg-green-clock' : model.getWinner() === 1 - player ? 'bg-red-clock' : 'bg-gray-clock';
        }
        else
        {
            clockColor = model.getCurrentPlayer() === player && (model.getMoveNumber() > 0 || model.getHasStarted()) ? 'bg-blue-clock' : 'bg-white';
        }

        htmlClock = `
            <div class="clock ${clockColor}">
                <time>${model.getPlayerClock(player).getClock()}</time>
            </div>
        `;

        if (model.getChessboardDirection() === player)
        {
            this.bottomClock.innerHTML = htmlClock;
        }
        else
        {
            this.topClock.innerHTML = htmlClock;
        }
    }

    displayButtons(model)
    { 
        this.buttons.innerHTML = `
            <div class="buttons">
                <div>
                    <div onclick="game.spinChessboard()" data-visible="true">
                        <img src="../images/icons/spin.png" draggable="false">
                        <span class="tooltip">Spin chessboard</span>
                    </div>
                    <div onclick="game.goToAnotherMove({option: 'first', moveNumber: ${model.getCurrentMoveNumber()}})">
                        <img src="../images/icons/first.png" draggable="false">
                        <span class="tooltip">First move</span>
                    </div>
                    <div onclick="game.goToAnotherMove({option: 'previous', moveNumber: ${model.getCurrentMoveNumber()}})">
                        <img src="../images/icons/previous.png" draggable="false">
                        <span class="tooltip">Previous move</span>
                    </div>
                    <div onclick="game.goToAnotherMove({option: 'next', moveNumber: ${model.getCurrentMoveNumber()}})">
                        <img src="../images/icons/next.png" draggable="false">
                        <span class="tooltip">Next move</span>
                    </div>
                    <div onclick="game.goToAnotherMove({option: 'last', moveNumber: ${model.getCurrentMoveNumber()}})">
                        <img src="../images/icons/last.png" draggable="false">
                        <span class="tooltip">Last move</span>
                    </div>
                    <div onclick="game.cancelMove()">
                        <img src="../images/icons/back.png" draggable="false">
                        <span class="tooltip">Cancel move</span>
                    </div>
                </div>
            </div>
        `;
    }

    displayOptions(model)
    {
        let checkedSquareName = model.getSquareNameOption() ? 'checked' : '';
        let checkedAutomatedSpinning = model.getAutomatedSpinningOption() ? 'checked' : '';
        
        this.options.innerHTML = `
            <div class="options">
                <div>
                    <div>
                        <label for="colors">Choose a color :</label>
                        <select id="colors" onchange="game.changeColor(this.value)">
                            ${model.getColors().map(color => {
                                const selected = color === model.getChessboardColor() ? 'selected' : '';
                                return `<option value="${color}" ${selected}>${color}</option>`
                            }).join('')}
                        </select>
                    </div>
                </div>
                <div>
                    <div>
                        <input type="checkbox" onclick="game.setSquareNameOption()" ${checkedSquareName}>
                        <label">Display square's name</label>
                    </div>
                    <div>
                        <input type="checkbox" onclick="game.setAutomatedSpinningOption()" ${checkedAutomatedSpinning}>
                        <label>Automated spinning after each move</label>
                    </div>
                </div>
            </div>
        `;
    }
}
