let modalSelect = document.querySelector('.modal-select');

function setupGame(minutes, increment)
{
    let variant = modalSelect.value;
    window.location.href=`../html/chessLocalGame.html?v=${variant}&m=${minutes}&i=${increment}`;
}
