/* Squares */
const MIN = 1; /* Minimum square index number */
const MAX = 8; /* Maximun square index number */
const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

/* Players */
const WHITE = 0;
const BLACK = 1;

/* Piece names */
const PAWN = 'pawn';
const BISHOP = 'bishop';
const KNIGHT = 'knight';
const ROOK = 'rook';
const QUEEN = 'queen';
const KING = 'king';

/* Piece Values */
const PAWN_VALUE = 1;
const BISHOP_VALUE = 3;
const KNIGHT_VALUE = 3;
const ROOK_VALUE = 5;
const QUEEN_VALUE = 9;

/* Piece column order */
const NAMES = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];

/* White pawn data */
const WHITE_LINE_INCREMENT = 1;
const WHITE_STARTING_LINE = MIN + 1;
const WHITE_FINISH_LINE = MAX;

/* Black pawn data */
const BLACK_LINE_INCREMENT = -1;
const BLACK_STARTING_LINE = MAX - 1;
const BLACK_FINISH_LINE = MIN;

/* King data*/
const WHITE_INITIAL_KING_SQUARE = 'e1';
const BLACK_INITIAL_KING_SQUARE = 'e8';

/* Colors */
const COLORS = ['Brown', 'Blue', 'Green', 'Red', 'Gray'];

/**
 * Get a column number and a line number and return the square
 * @param {int} column 
 * @param {int} line 
 * @returns the square
 */
function getSquare(column, line)
{
    if (column < MIN || column > MAX || line < MIN || line > MAX)
    {
        return undefined
    }

    return LETTERS[column - 1] + line;
}

/**
 * Get the column number of a square
 * @param {string} square 
 * @returns the column
 */
function getColumn(square)
{
    return square.charCodeAt(0) - 97 + MIN;
}

/**
 * Get teh line number of a square
 * @param {string} square 
 * @returns the line
 */
function getLine(square)
{
    return parseInt(square.charAt(1));
}

function convertAdvantageToHeight(advantage)
{
    if (advantage < -9)
    {
        return 2;
    }
    else if (advantage > 9)
    {
        return 98;
    }
    else
    {
        return 50 + 5*advantage;
    }
}
