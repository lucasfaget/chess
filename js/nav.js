const header = document.querySelector('#header');
header.innerHTML = `
    <div class="header flex">
        <a href="/chess/index.html">
            <div>
                <img src="/chess/images/pieces/white/pawn.svg" draggable="false">
            </div>
        </a>

        <div class="mobile-nav-toggle nav-icon" aria-expanded="false">
            <div></div>
        </div>

        <nav>
            <ul class="nav flex" data-visible="false">
                <li>
                    <a href="/chess/index.html">
                        HOME
                    </a>
                </li>
                <li>
                    <a href="/chess/html/chessSelectMode.html">
                        CHESS
                    </a>
                </li>
                <li>
                    <a href="/chess/html/comingSoon.html">
                        SOON
                    </a>
                </li>
            </ul>
        </nav>
    </div>
`;

const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.mobile-nav-toggle');

navToggle.addEventListener('click', () => {
    const visibility = nav.getAttribute("data-visible");
    if (visibility === "false")
    {
        nav.setAttribute("data-visible", true);
        navToggle.setAttribute("aria-expanded", true);
    }
    else
    {
        nav.setAttribute("data-visible", false);
        navToggle.setAttribute("aria-expanded", false);
    }
});