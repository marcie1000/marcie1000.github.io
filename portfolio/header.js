const template = document.createElement('template');

template.innerHTML = `
        <header>
            <div class="myHeader">
                <div class="headerElem">
                    <a href="index.html">Portefolio</a>
                </div>
                <!-- <div class="headerElem"><a>Présentation</a></div> -->
                <div class="headerElem"><a href="competences.html">Compétences</a></div>
                <div class="headerElem"><a href="travaux.html">Travaux réalisés en BTS SIO</a></div>
                <div class="headerElem"><a href="projets.html">Projets</a></div>
                <div class="headerElem"><a>Certifications</a></div>
                <div class="headerElem"><a>CV</a></div>
            </div>
            <div class="topMargin"></br></div>
        </header>
`;

// document.body.appendChild(template.content);
document.body.prepend(template.content);
