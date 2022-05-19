const VARIANTS = ['std', '960'];

function isInteger(str)
{
    if (typeof str != 'string')
        return false
    let nbr = parseFloat(str);  
    return !isNaN(str) && !isNaN(nbr) && Number.isInteger(nbr);
}

const url = window.location.search;
const urlParams = new URLSearchParams(url);
const variant = urlParams.get('v');
const minutes = urlParams.get('m');
const increment = urlParams.get('i');

const game = new Controller(new Model(variant, minutes, increment), new View());

if (VARIANTS.includes(variant) && isInteger(minutes) && isInteger(increment) && minutes >= 0 && minutes <= 180 && increment >= 0 && increment <= 180)
{
    game.startGame();
}
else
{
    window.location.href="../html/chessSetupGame.html";
}
