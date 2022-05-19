class Piece
{
    constructor(player, name)
    {
        this.player = player;
        this.name = name;
        this.wasMoved = false;
        this.pawnBoostMoveNumber = undefined;
    }

    getPlayer()
    {
        return this.player;
    }

    getName()
    {
        return this.name;
    }

    setName(name)
    {
        this.name = name;
    }

    getWasMoved()
    {
        return this.wasMoved;
    }

    setWasMoved()
    {
        this.wasMoved = true;
    }

    getPawnBoostMoveNumber()
    {
        return this.pawnBoostMoveNumber;
    }

    setPawnBoostMoveNumber(moveNumber)
    {
        this.pawnBoostMoveNumber = moveNumber;
    }

    getPlayerColor()
    {
        return this.player === 0 ? 'white' : 'black';
    }
}
