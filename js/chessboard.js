class Chessboard
{
    constructor(pieces)
    {
        this.pieces = pieces;
    }

    /**
     * Find the piece on a square
     * @param {string} square  
     * @returns the piece if a piece was found, else undefined
     */
    getPiece(square)
    {
        return this.pieces[square];
    }

    /**
     * Check if a square holds no piece
     * @param {string} square  
     * @returns true if the square is empty 
     */
    isEmptySquare(square)
    {
        return square !== undefined && this.pieces[square] === undefined;
    }

    /**
     * Check if a square if capturable by the player
     * @param {string} square 
     * @param {0 or 1} player 
     * @returns true if the square is capturable
     */
    isCapturableSquare(square, player)
    {
        if (square === undefined)
        {
            return false;
        }

        let piece = this.getPiece(square)
        return piece !== undefined && piece.getPlayer() === 1 - player && piece.getName() !== KING;
    }

    areCloseSquares(square1, square2)
    {
        return (Math.abs(getColumn(square1) - getColumn(square2)) === 0 && Math.abs(getLine(square1) - getLine(square2)) === 1 || 
                Math.abs(getColumn(square1) - getColumn(square2)) === 1 && Math.abs(getLine(square1) - getLine(square2)) === 0 || 
                Math.abs(getColumn(square1) - getColumn(square2)) === 1 && Math.abs(getLine(square1) - getLine(square2)) === 1)
    }

    /**
     * Find a specified piece on the chessboard
     * @param {0 or 1} player 
     * @param {string} name 
     * @returns the piece if found, else undefined
     */
    findSquare(player, name)
    {
        for (const [square, piece] of Object.entries(this.pieces))
        {
            if (piece.getName() === name && piece.getPlayer() === player)
            {
                return square;
            }
        }

        return undefined;
    }

    /**
     * Remove a piece from the chessboard
     * @param {square} square 
     */
    removePiece(square)
    {
        delete this.pieces[square];
    }

    /**
     * Set the square of a piece
     * @param {square} square
     * @param {newSquare} square  
     */
    setSquare(square, newSquare)
    {
        this.pieces[newSquare] = this.pieces[square];
        this.pieces[newSquare].setWasMoved();
        this.removePiece(square);
    }

    move(square, newSquare, kindOfMove, moveNumber)
    {
        this.setSquare(square, newSquare);
        switch(kindOfMove)
        {
            case 'moving':
                break;
            case 'capture':
                break;
            case 'pawnBoost':
                this.pieces[newSquare].setPawnBoostMoveNumber(moveNumber);
                break;
            case 'enPassant':
                this.removePiece(getSquare(getColumn(newSquare), getLine(square)));
                break;
            case 'promotion':
                this.pieces[newSquare].setName(QUEEN);
                break;
            case 'captureWithPromotion':
                this.pieces[newSquare].setName(QUEEN);
                break;
            case 'kingsideCastling':
                this.setSquare(getSquare(getColumn(newSquare) + 1, getLine(square)), getSquare(getColumn(newSquare) - 1, getLine(square)));
                break;
            case 'queensideCastling':
                this.setSquare(getSquare(getColumn(newSquare) - 2, getLine(square)), getSquare(getColumn(newSquare) + 1, getLine(square)));
                break;
        }
    }

    cloneDeepChessboard()
    {
        let newPieces = _.cloneDeep(this.pieces);
        let newChessboard = new Chessboard(newPieces);

        return newChessboard;
    }

    /**
     * Calculate all legal moves of the player
     * @param {0 or 1} player 
     * @returns an object which includes all legal moves
     */
    allMoves(player, moveNumber, variant)
    {
        let allMoves = {};
        let pieceMoves = {};
        
        for (const [square, piece] of Object.entries(this.pieces))
        {
            pieceMoves = {};

            if (piece.getPlayer() === player)
            {
                switch (piece.getName())
                {
                    case PAWN:
                        pieceMoves = this.pawnMoves(square, player, moveNumber);
                        break;
                    case KNIGHT:
                        pieceMoves = this.knightMoves(square, player);
                        break;
                    case BISHOP:
                        pieceMoves = this.bishopMoves(square, player);
                        break;
                    case ROOK:
                        pieceMoves = this.rookMoves(square, player);
                        break;
                    case QUEEN:
                        pieceMoves = this.queenMoves(square, player);
                        break;
                    case KING:
                        pieceMoves = this.kingMoves(square, player, variant);
                        break;
                }
                
                if (Object.keys(pieceMoves).length !== 0)
                {
                    allMoves[square] = pieceMoves;
                }
            }
        }
        
        return allMoves;
    }

    /**
     * Calculate all the pawn moves
     * @param {string} square 
     * @param {0 or 1} player
     * @param {int} moveNumber
     * @returns an array of moves
     */
    pawnMoves(square, player, moveNumber)
    {
        let pawnMoves = {};
        let column = getColumn(square);
        let line = getLine(square);
        let newSquare, newChessboard;
        let lineIncrement, startingLine, finishLine;

        switch (player)
        {
            case 0:
                lineIncrement = WHITE_LINE_INCREMENT;
                startingLine = WHITE_STARTING_LINE;
                finishLine = WHITE_FINISH_LINE;
                break;
            case 1:
                lineIncrement = BLACK_LINE_INCREMENT;
                startingLine = BLACK_STARTING_LINE;
                finishLine = BLACK_FINISH_LINE;
                break;
        }

        // Test the advance of one square
        if (line < WHITE_FINISH_LINE && line > BLACK_FINISH_LINE)
        {
            newSquare = getSquare(column, line + lineIncrement);
            if (this.isEmptySquare(newSquare))
            {
                if (line + lineIncrement === finishLine)
                {
                    newChessboard = this.cloneDeepChessboard();
                    newChessboard.move(square, newSquare, 'promotion');
                    if (!newChessboard.isChecked(player))
                    {
                        pawnMoves[newSquare] = {
                            kindOfMove: 'promotion',
                        };
                    }
                }
                else
                {
                    newChessboard = this.cloneDeepChessboard();
                    newChessboard.move(square, newSquare, 'moving');
                    if (!newChessboard.isChecked(player))
                    {
                        pawnMoves[newSquare] = {
                            kindOfMove: 'moving'
                        };
                    }
                    // Test the advance of two squares
                    if (line === startingLine)
                    {
                        newSquare = getSquare(column, line + 2*lineIncrement);
                        if (this.isEmptySquare(newSquare))
                        {
                            newChessboard = this.cloneDeepChessboard();
                            newChessboard.move(square, newSquare, 'pawnBoost', moveNumber);
                            if (!newChessboard.isChecked(player))
                            {
                                pawnMoves[newSquare] = {
                                    kindOfMove: 'pawnBoost',
                                };
                            }
                        }
                    }
                }
            }
            // Test diagonal capture
            for (let j = -1 ; j <= 1 ; j+=2)
            {
                newSquare = getSquare(column + j, line + lineIncrement);
                if (this.isCapturableSquare(newSquare, player))
                {
                    if (line + lineIncrement === finishLine)
                    {
                        newChessboard = this.cloneDeepChessboard();
                        newChessboard.move(square, newSquare, 'captureWithPromotion');
                        if (!newChessboard.isChecked(player))
                        {
                            pawnMoves[newSquare] = {
                                kindOfMove: 'captureWithPromotion',
                            };
                        }
                    }
                    else
                    {
                        newChessboard = this.cloneDeepChessboard();
                        newChessboard.move(square, newSquare, 'capture');
                        if (!newChessboard.isChecked(player))
                        {
                            pawnMoves[newSquare] = {
                                kindOfMove: 'capture',
                            };
                        }
                    }
                }

                let piece = this.getPiece(column + j, line);
                if (piece !== undefined)
                {
                    if (piece.getPawnBoostMoveNumber() === moveNumber - 1)
                    {
                        newSquare = getSquare(column + j, line + lineIncrement);
                        newChessboard = this.cloneDeepChessboard();
                        newChessboard.move(square, newSquare, 'enPassant');
                        if (!newChessboard.isChecked(player))
                        {
                            pawnMoves[newSquare] = {
                                kindOfMove: 'enPassant',
                            };
                        }
                    }
                }
            }
        }
        
        return pawnMoves;
    }

    /**
     * Calculate all the knight moves
     * @param {string} square 
     * @param {0 or 1} player 
     * @returns an array of moves
     */
    knightMoves(square, player)
    {
        let knightMoves = {};
        let column = getColumn(square);
        let line = getLine(square);
        let newSquare, newChessboard;

        for (let j = -2 ; j <= 2 ; j++)
        {
            if (j !== 0)
            {
                for (const i of [3 - Math.abs(j), 0 - (3 - Math.abs(j))])
                {
                    newSquare = getSquare(column + j, line + i);
                    if (this.isEmptySquare(newSquare))
                    {
                        newChessboard = this.cloneDeepChessboard();
                        newChessboard.move(square, newSquare, 'moving');
                        if (!newChessboard.isChecked(player))
                        {
                            knightMoves[newSquare] = {
                                kindOfMove: 'moving',
                            };
                        }
                    }
                    else
                    {
                        if (this.isCapturableSquare(newSquare, player))
                        {
                            newChessboard = this.cloneDeepChessboard();
                            newChessboard.move(square, newSquare, 'capture');
                            if (!newChessboard.isChecked(player))
                            {
                                knightMoves[newSquare] = {
                                    kindOfMove: 'capture',
                                };
                            }
                        }
                    }
                }
            }
        }
        
        return knightMoves;
    }

    /**
     * Calculate all the bishop moves
     * @param {string} squaree 
     * @param {0 or 1} player 
     * @returns an array of moves
     */
    bishopMoves(square, player)
    {
        let bishopMoves = {};
        let column = getColumn(square);
        let line = getLine(square);
        let newSquare, newChessboard, n, stopDiagonal;

        // Test the 4 diagonals
        for (let j = -1 ; j <= 1 ; j+=2)
        {
            for (let i = -1 ; i <= 1 ; i+=2)
            {
                n = 1; // Square number
                stopDiagonal = false;
                while (!stopDiagonal)
                {
                    newSquare = getSquare(column + n*j, line + n*i);
                    // If the square is empty
                    if (this.isEmptySquare(newSquare))
                    {
                        newChessboard = this.cloneDeepChessboard();
                        newChessboard.move(square, newSquare, 'moving');
                        if (!newChessboard.isChecked(player))
                        {
                            bishopMoves[newSquare] = {
                                kindOfMove: 'moving',
                            };
                        }
                    }
                    else
                    {
                        // If the square can be captured
                        if (this.isCapturableSquare(newSquare, player))
                        {
                            newChessboard = this.cloneDeepChessboard();
                            newChessboard.move(square, newSquare, 'capture');
                            if (!newChessboard.isChecked(player))
                            {
                                bishopMoves[newSquare] = {
                                    kindOfMove: 'capture',
                                };
                            }
                        }
                        stopDiagonal = true;
                    }
                    n++;
                }
            }
        }
    
        return bishopMoves;
    }

    /**
     * Calculate all the rook moves
     * @param {string} square 
     * @param {0 or 1} player 
     * @returns an array of moves
     */
    rookMoves(square, player)
    {
        let rookMoves = {};
        let column = getColumn(square);
        let line = getLine(square);
        let newSquare, newChessboard, n, stopLine;

        // Test the 4 lines
        for (let zeroOrOne = 0 ; zeroOrOne <= 1 ; zeroOrOne++)
        {
            for (let direction = -1 ; direction <= 1 ; direction+=2)
            {
                n = 1; // Square number
                stopLine = false;
                while (!stopLine)
                {
                    newSquare = getSquare(column + zeroOrOne*n*direction, line + (1-zeroOrOne)*n*direction);
                    // If the square is empty
                    if (this.isEmptySquare(newSquare))
                    {
                        newChessboard = this.cloneDeepChessboard();
                        newChessboard.move(square, newSquare, 'moving');
                        if (!newChessboard.isChecked(player))
                        {
                            rookMoves[newSquare] = {
                                kindOfMove: 'moving',
                            };
                        }
                    }
                    else
                    {
                        // If the square can be captured
                        if (this.isCapturableSquare(newSquare, player))
                        {
                            newChessboard = this.cloneDeepChessboard();
                            newChessboard.move(square, newSquare, 'capture');
                            if (!newChessboard.isChecked(player))
                            {
                                rookMoves[newSquare] = {
                                    kindOfMove: 'capture',
                                };
                            }
                        }
                        stopLine = true;
                    }
                    n++;
                }  
            }
        }

        return rookMoves;
    }

    /**
     * Calculate all the queen moves
     * @param {string} square 
     * @param {0 or 1} player 
     * @returns an array of moves
     */
    queenMoves(square, player)
    {
        return Object.assign(this.bishopMoves(square, player), this.rookMoves(square, player));
    }

    kingMoves(square, player, variant)
    {
        let kingMoves = {};
        let column = getColumn(square);
        let line = getLine(square);
        let newSquare, newChessboard;
        const opposingKingSquare = this.findSquare(1 - player, KING);

        for (let j = -1 ; j <= 1 ; j++)
        {
            for (let i = -1 ; i <= 1 ; i++)
            {
                if (j != 0 || i != 0)
                {
                    newSquare = getSquare(column + j, line + i);
                    if (this.isEmptySquare(newSquare))
                    {
                        if (!this.areCloseSquares(newSquare, opposingKingSquare))
                        {
                            newChessboard = this.cloneDeepChessboard();
                            newChessboard.move(square, newSquare, 'moving');
                            if (!newChessboard.isChecked(player))
                            {
                                kingMoves[newSquare] = {
                                    kindOfMove: 'moving',
                                };
                            }
                        }
                    }
                    else
                    {
                        if (this.isCapturableSquare(newSquare, player))
                        {
                            if (!this.areCloseSquares(newSquare, opposingKingSquare))
                            {
                                newChessboard = this.cloneDeepChessboard();
                                newChessboard.move(square, newSquare, 'capture');
                                if (!newChessboard.isChecked(player))
                                {
                                    kingMoves[newSquare] = {
                                        kindOfMove: 'capture',
                                    };
                                }
                            }
                        }
                    }
                }
            }           
        }

        if (variant !== '960')
        {
            // Castling
            let initialKingSquare = player === 0 ? WHITE_INITIAL_KING_SQUARE : BLACK_INITIAL_KING_SQUARE;
            if (square === initialKingSquare)
            {
                // Testing kingside Castling
                let column = getColumn(square);
                let line = getLine(square);
                if (this.getPiece(square).getWasMoved() === false)
                {
                    // Testing kingside Castling
                    if (this.isEmptySquare(getSquare(column + 1, line)) && 
                        this.isEmptySquare(getSquare(column + 2, line)))
                    {
                        let rook = this.getPiece(getSquare(column + 3, line));
                        if (rook !== undefined && rook.getWasMoved() === false)
                        {
                            newSquare = getSquare(column + 1, line);
                            newChessboard = this.cloneDeepChessboard();
                            newChessboard.move(square, newSquare, 'moving');
                            if (!newChessboard.isChecked(player))
                            {
                                newSquare = getSquare(column + 2, line);
                                // Test if the opposing king is not near the new square of the king
                                if (!this.areCloseSquares(newSquare, opposingKingSquare))
                                {
                                    newChessboard = this.cloneDeepChessboard();
                                    newChessboard.move(square, newSquare, 'kingsideCastling');
                                    if (!newChessboard.isChecked(player))
                                    {
                                        kingMoves[newSquare] = {
                                            kindOfMove: 'kingsideCastling',
                                        };
                                    }
                                }
                            }
                        }
                    }

                    // Testing queenside Castling
                    if (this.isEmptySquare(getSquare(column - 1, line)) && 
                        this.isEmptySquare(getSquare(column - 2, line)) &&
                        this.isEmptySquare(getSquare(column - 3, line)))
                    {
                        let rook = this.getPiece(getSquare(column - 4, line));
                        if (rook !== undefined && rook.getWasMoved() === false)
                        {
                            newSquare = getSquare(column - 1, line);
                            newChessboard = this.cloneDeepChessboard();
                            newChessboard.move(square, newSquare, 'moving');
                            if (!newChessboard.isChecked(player))
                            {
                                newSquare = getSquare(column - 2, line);
                                // Test if the opposing king is not near the new square of the king
                                if (!this.areCloseSquares(newSquare, opposingKingSquare))
                                {
                                    newChessboard = this.cloneDeepChessboard();
                                    newChessboard.move(square, newSquare, 'queensideCastling');
                                    if (!newChessboard.isChecked(player))
                                    {
                                        kingMoves[newSquare] = {
                                            kindOfMove: 'queensideCastling',
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return kingMoves;
    }

    /**
     * Check if the player is checked 
     * @param {0 or 1} player 
     * @returns true if the player is checked
     */
    isChecked(player)
    {
        const kingSquare = this.findSquare(player, KING);
        
        let isChecked = false;
        for (const [square, piece] of Object.entries(this.pieces))
        {
            if (piece.getPlayer() === 1 - player)
            {
                if (isChecked === true)
                {
                    return isChecked;
                }
                switch (piece.getName())
                {
                    case PAWN:
                        isChecked = this.checkByPawn(getColumn(kingSquare), getLine(kingSquare), getColumn(square), getLine(square), player);
                        break;
                    case KNIGHT:
                        isChecked = this.checkByKnight(getColumn(kingSquare), getLine(kingSquare), getColumn(square), getLine(square));
                        break;
                    case BISHOP:
                        isChecked = this.checkByBishop(getColumn(kingSquare), getLine(kingSquare), getColumn(square), getLine(square));
                        break;
                    case ROOK:
                        isChecked = this.checkByRook(getColumn(kingSquare), getLine(kingSquare), getColumn(square), getLine(square));
                        break;
                    case QUEEN:
                        isChecked = this.checkByQueen(getColumn(kingSquare), getLine(kingSquare), getColumn(square), getLine(square));
                        break;
                }
            }
        }
        
        return isChecked;
    }

    checkByPawn(kingColumn, kingLine, pawnColumn, pawnLine, player)
    {
        let lineIncrement = 1 - player === 0 ? WHITE_LINE_INCREMENT : BLACK_LINE_INCREMENT;

        return (pawnLine + lineIncrement === kingLine && pawnColumn - 1 === kingColumn)
            || (pawnLine + lineIncrement === kingLine && pawnColumn + 1 === kingColumn);
    }

    checkByKnight(kingColumn, kingLine, knightColumn, knightLine)
    {
        return (Math.abs(kingColumn - knightColumn) === 1 && Math.abs(kingLine - knightLine) === 2)
            || (Math.abs(kingLine - knightLine) === 1 && Math.abs(kingColumn - knightColumn) === 2)
    }

    checkByBishop(kingColumn, kingLine, bishopColumn, bishopLine)
    {
        if (Math.abs(kingColumn - bishopColumn) !== Math.abs(kingLine - bishopLine))
        {
            return false;
        }
        else
        {
            let isChecked = true;
            let n = 1;
            let j = kingColumn < bishopColumn ? 1 : -1;
            let i = kingLine < bishopLine ? 1 : -1;

            while (isChecked && (kingColumn + n*j !== bishopColumn) && (kingLine + n*i !== bishopLine))
            {
                if (!this.isEmptySquare(getSquare(kingColumn + n*j, kingLine + n*i)))
                {
                    isChecked = false;
                }
                n++;      
            }

            return isChecked;
        }
    }

    checkByRook(kingColumn, kingLine, rookColumn, rookLine)
    {
        if (kingColumn !== rookColumn && kingLine !== rookLine)
        {
            return false;
        }
        else
        {
            let isChecked = true;
            let n = 1;
            if (kingColumn === rookColumn)
            {
                let i = kingLine < rookLine ? 1 : -1;
                while (isChecked && kingLine + n*i !== rookLine)
                {
                    if (!this.isEmptySquare(getSquare(kingColumn, kingLine + n*i)))
                    {
                        isChecked = false;
                    }
                    n++;
                }          
            }
            // kingLine === rookLine
            else
            {
                let j = kingColumn < rookColumn ? 1 : -1;
                while (isChecked && kingColumn + n*j !== rookColumn)
                {
                    if (!this.isEmptySquare(getSquare(kingColumn + n*j, kingLine)))
                    {
                        isChecked = false;
                    }
                    n++;
                }
            }

            return isChecked;
        }
    }

    checkByQueen(kingColumn, kingLine, queenColumn, queenLine)
    {
        return this.checkByBishop(kingColumn, kingLine, queenColumn, queenLine) || this.checkByRook(kingColumn, kingLine, queenColumn, queenLine);
    }

    drawByInsufficientMaterial()
    {
        let whitePieceNumber = {
            total: 0,
            knight: 0,
            bishop: 0,
        }

        let blackPieceNumber = {
            total: 0,
            knight: 0,
            bishop: 0,
        }

        for (const piece of Object.values(this.pieces))
        {
            if (piece.getPlayer() === 0)
            {
                whitePieceNumber.total++;
                switch (piece.getName())
                {
                    case KNIGHT:
                        whitePieceNumber.knight++;
                        break;
                    case BISHOP:
                        whitePieceNumber.bishop++;
                        break;
                }

            }
            else
            {
                blackPieceNumber.total++;
                switch (piece.getName())
                {
                    case KNIGHT:
                        blackPieceNumber.knight++;
                        break;
                    case BISHOP:
                        blackPieceNumber.bishop++;
                        break;
                }
            }
        }

        let isDraw = false;
        if (whitePieceNumber.total <= 2 && blackPieceNumber.total <= 2)
        {
            // Case king vs king
            if (whitePieceNumber.total === 1 && blackPieceNumber.total === 1)
            {
                isDraw = true;
            }
            else
            {
                if ((whitePieceNumber.total !== 2 || blackPieceNumber.total !== 2))
                {
                    // Case king and knight vs king
                    // Case king and bishop vs king
                    if (whitePieceNumber.knight === 1 || blackPieceNumber.knight === 1 || 
                        whitePieceNumber.bishop === 1 || blackPieceNumber.bishop === 1)
                    {
                        isDraw = true;
                    }
                }
                else
                {
                    // Case king and bishop vs king and bishop with the same color
                    if (whitePieceNumber.bishop === 1 && blackPieceNumber.bishop === 1)
                    {
                        let whiteBishopSquare = this.findSquare(0, BISHOP);
                        let blackBishopSquare = this.findSquare(1, BISHOP);
                        if (0)
                        // if (getSquareColor(whiteBishopSquare) === getSquareColor(blackBishopSquare))
                        {
                            isDraw = true;
                        }
                    }
                }
            }
        }

        return isDraw;
    }

    calculateWhiteAdvantage()
    {
        let piecesNumber =
        [
            /* white */
            {
                'pawn': 0,
                'bishop': 0,
                'knight': 0,
                'rook': 0,
                'queen': 0,
            },
            /* black */
            {
                'pawn': 0,
                'bishop': 0,
                'knight': 0,
                'rook': 0,
                'queen': 0,
            },
        ];

        for (const piece of Object.values(this.pieces))
        {
            if (piece.getName() !== KING)
            {
                piecesNumber[piece.getPlayer()][piece.getName()]++;
            }
        }

        return (PAWN_VALUE * (piecesNumber[0].pawn - piecesNumber[1].pawn) + 
                KNIGHT_VALUE * (piecesNumber[0].knight - piecesNumber[1].knight) +
                BISHOP_VALUE * (piecesNumber[0].bishop - piecesNumber[1].bishop) +
                ROOK_VALUE * (piecesNumber[0].rook - piecesNumber[1].rook) +
                QUEEN_VALUE * (piecesNumber[0].queen - piecesNumber[1].queen));
    }
}