import { activeContentIndex } from "./index.js";
import { projectData } from "./data.js";

const ghostButtonContainers = document.querySelectorAll('.home__button-container');
const ghosts = document.querySelectorAll('.pacman-ghost');
const mainPage = document.querySelector('main');
const body = document.querySelector('body');
const skillsExperiencesPage = document.querySelector('.skills-and-experiences');
const projectPage = document.querySelector('.projects');
const projectFoldersContainer = document.querySelector('.projects__folders');
const projectDetailPage = document.querySelector('.project-detail-container');
const aboutPage = document.querySelector('.about ');
const yellowPacman = document.querySelector('.yellow-pacman');
const contentButtons = document.querySelectorAll('.content-button');
const callButton = document.querySelector('.about__contact__contact-button');
const socmedIcons = document.querySelector('.about__contact__social-media-icons');

let isGhostButtonClickable = true;
let buttonPreviewImageActive = 0


export function initUI() {
    // hide main
    mainPage.style.animation = 'none'
    mainPage.style.transform = 'translateX(calc(-100% - 71px))';

    // hide content
    hideAllContent();

    // show ghost & pacman
    isGhostButtonClickable = true;
    const color = ['cyan', 'pink', 'red'];
    ghosts.forEach((ghost, index) => {
        ghost.style.backgroundImage = `url('../assets/images/pacman_${color[index]}_ghost.png')`;
    });
    ghosts.forEach(ghost => ghost.style.animation = 'none');
    ghostButtonContainers.forEach(buttonContainer => buttonContainer.childNodes.forEach(child => {
        if(child.tagName == 'P') {
            child.style.display = 'block';
        }
    }))
    yellowPacman.style.animation = 'none';
}

export function showMainPage() {
    if (isGhostButtonClickable) {
        // ghost
        ghosts.forEach(ghost => ghost.classList = 'pacman-ghost');
        const selectedGhost = ghosts[activeContentIndex];
        selectedGhost.style.backgroundImage = `url('../assets/images/pacman_ghost_eatable.png')`;
        ghostButtonContainers[activeContentIndex].childNodes.forEach(child => {
            if(child.tagName == 'P') {
                child.style.display = 'none';
            }
        })
    
        // all run
        selectedGhost.style.animation = 'ghost-run 5s linear 1, ghost-run-foot 0.25s step-start infinite';
        selectedGhost.style.animationFillMode = 'both';
    
        yellowPacman.style.animation = 'pacman-run 5s linear 1, pacman-eat 0.25s step-start infinite';
        yellowPacman.style.animationFillMode = 'both';
    
        mainPage.style.animation = 'main-run 5s';
        mainPage.style.animationTimingFunction = 'linear';
        mainPage.style.animationFillMode = 'both';
    
        // show content
        showContent(activeContentIndex);

        isGhostButtonClickable = false;
    }
}

function hideAllContent() {
    skillsExperiencesPage.className = 'skills-and-experiences content-0 hidden';
    projectPage.className = 'projects content-1 hidden';
    projectDetailPage.className = 'project-detail-container hidden';
    aboutPage.className = 'about content-2 hidden';
    
    const projectDetails = document.querySelectorAll('.project-detail');
    // console.log(projectDetails)
    if(projectDetails.length > 0) projectDetails.forEach(e => e.style.display = 'none')
}


export function showContent(index) {
    hideAllContent();
    const selectContentPage = document.querySelector('.content-' + index);
    selectContentPage.className = selectContentPage.className.slice(0,selectContentPage.className.length-7);

    contentButtons.forEach(button => {
        button.style.color = 'var(--white)';
        button.style.textDecoration = 'none';
    })
    contentButtons[index].style.color = 'var(--yellow)';
    contentButtons[index].style.textDecoration = 'underline solid var(--yellow)';
}

export function addProject() {
    projectData.forEach((data, index) => {
        const folderImage = document.createElement('img');
        folderImage.setAttribute('src', data.folderImage);
        folderImage.setAttribute('alt', 'folder '+ data.name);

        const paraghraf = document.createElement('p') ;
        paraghraf.innerText = data.name;

        const button = document.createElement('button');
        button.appendChild(folderImage);

        const folder = document.createElement('div');
        folder.className = 'folder-project project-' + (index+1);
        folder.appendChild(button);
        folder.appendChild(paraghraf);

        projectFoldersContainer.appendChild(folder);

        buildProjectDetail(index);
    })

    
    // console.log(projectFoldersContainer)
    projectFoldersContainer.childNodes.forEach((folder, index) => {
        if (folder.tagName == "DIV") {
            const button = folder.children[0];
            button.addEventListener('click', function() {
                showProjectDetail(folder.className[folder.className.length-1]-1);
            })
        }
    }) 
}

export function showProjectDetail(index) {
    projectDetailPage.className = 'project-detail-container';
    projectPage.className = 'projects content-1 hidden';
    projectDetailPage.childNodes.forEach((page, i) => {
        if (i == index) {
            console.log(i)
            page.style.display = 'flex';
            fixPositionShortTable(page.children[3]);
            fixExitButton(page);
        } else {
            page.style.display = 'none';
        }
    })
}

function addDragEvent(image, buttonParent, srcImage) {
    let dragStartX = null
    image.addEventListener("dragstart", function(e) {
        var clone = this.cloneNode(true);
        clone.style.opacity = 0;
        document.body.appendChild(clone);
        e.dataTransfer.setDragImage(clone, 0, 0);
        dragStartX = e.x;
    }, false);
    image.addEventListener("drag", (e) => {
        image.style.cursor = "grab !important";
    })
    image.addEventListener("dragend", (e) => {
        let dragEndX = e.x;
        if (dragEndX < dragStartX) {
            console.log('next')
            if (buttonPreviewImageActive < srcImage.length-1) {
                buttonPreviewImageActive++
            }
        } else {
            console.log('back')
            if (buttonPreviewImageActive > 0) {
                buttonPreviewImageActive--
            }
        }
        updatePreviewImage(buttonParent, buttonParent.childNodes[buttonPreviewImageActive], image)

    })

}

function fixExitButton(page) {
    const exitButton = page.childNodes[page.childNodes.length-1]
    exitButton.style.position = 'absolute';
    exitButton.style.top = projectDetailPage.offsetTop + 'px';
    exitButton.style.left = (projectDetailPage.offsetLeft + projectDetailPage.offsetWidth - exitButton.offsetWidth) + 'px';
}


function buildProjectDetail(index) {
    const data = projectData[index];

    // projectDetail
    const projectDetail = document.createElement('div');
    projectDetail.className = 'project-detail';

    // build
    // project-detail__preview-images
    const image = document.createElement('img');
    image.setAttribute('src', data.images[0]);
    

    const imageButtons = document.createElement('div');
    imageButtons.className = 'project-detail__preview-images__buttons';
    data.images.forEach((srcImage, i) => {
        const button = document.createElement('button')
        button.setAttribute('data-srcImage', srcImage);
        if (i == 0) button.style.backgroundColor = 'var(--yellow)';
        button.addEventListener('mouseover', () => {
            if (buttonPreviewImageActive != i) button.style.backgroundColor = 'var(--yellow)'
        });
        button.addEventListener('mouseout', () => {
            if (buttonPreviewImageActive != i) button.style.backgroundColor = 'var(--white)'
        });
        button.addEventListener('click', () => {
            buttonPreviewImageActive = i;
            updatePreviewImage(imageButtons, button, image);
        })
        imageButtons.appendChild(button)

    })

    
    addDragEvent(image, imageButtons, data.images);

    const previewImage = document.createElement('div');
    previewImage.className = 'project-detail__preview-images';
    previewImage.appendChild(image);
    previewImage.appendChild(imageButtons);

    projectDetail.appendChild(previewImage);

    // project-detail__article
    const title = document.createElement('h3');
    title.innerText = data.name;

    const pContainer = document.createElement('div');
    pContainer.className = 'project-detail__article__p-container';
    data.detailTexts.forEach(text => {
        const p = document.createElement('p');
        p.innerText = text;
        pContainer.appendChild(p);
    })

    const article = document.createElement('article');
    article.className = 'project-detail__article';
    article.appendChild(title);
    article.appendChild(pContainer);

    projectDetail.appendChild(article);

    // project-detail__long-table
    const longTable = document.createElement('div');
    longTable.className = 'project-detail__long-table';
    longTable.innerHTML = `
        <p class="thead thead-year">Year</p>
        ${data.role ? `<p class="thead thead-role">Role</p>` : `` }
        <p class="thead thead-tools">Tools</p>
        <p class="thead thead-langnframe">Language & Framework</p>
    `;

    let numColumn = 0;
    const typeColumn = ['year', 'role', 'tools', 'langnframe'];
    typeColumn.forEach(type => {
        if (data[type]) {
            numColumn++;
            const p = document.createElement('p');
            p.className = 'tbody tbody-' + type;
            p.innerHTML = `${data[type][0]}${(data[type][1]) ? `,<span class="block-text">${data[type][1]}</span>` : ``}` ;
            longTable.appendChild(p);
        }
    })
    longTable.style.gridTemplateColumns = `repeat(${numColumn}, max-content)`;

    projectDetail.appendChild(longTable);

    // project-detail__short-table
    const shortTable = document.createElement('div');
    shortTable.className = 'project-detail__short-table';
    const typeTexts = ['Year', 'Role', 'Tools', 'Language & Framework']
    typeColumn.forEach((type, i) => {
        if (data[type]) {
            const button = document.createElement('button');
            button.className = 'thead thead-' + type;
            button.innerText = typeTexts[i];
            // button.style.width = 'fit-content';

            const p = document.createElement('p');
            p.className = 'tbody tbody-' + type;
            p.innerHTML = `${data[type][0]}${(data[type][1]) ? `,<span class="block-text">${data[type][1]}</span>` : ``}` ;

            const div = document.createElement('div');
            div.className = 'short-table__' + type;
            div.appendChild(button);
            div.appendChild(p);

            shortTable.appendChild(div);
        }
    })

    projectDetail.appendChild(shortTable);

    // project-detail__links
    const links = document.createElement('div');
    links.className = 'project-detail__links';
    if(data.linkLiveWeb) {
        const link = document.createElement('a');
        link.setAttribute('href', data.linkLiveWeb);
        link.innerText = 'Live Website'
        links.appendChild(link);
    }
    if(data.linkCodeSource) {
        const link = document.createElement('a');
        link.setAttribute('href', data.linkCodeSource);
        link.innerText = 'Source Code'
        links.appendChild(link);
    }

    projectDetail.appendChild(links);
    
    // project-detail__exit-button
    const exitImage = document.createElement('img');
    exitImage.setAttribute('src', "./assets/images/x-button.png");

    const exitButton = document.createElement('button');
    exitButton.className = 'project-detail__exit-button';

    exitButton.addEventListener('mouseover', () => exitImage.setAttribute('src', "./assets/images/x-button-hover.png"));
    exitButton.addEventListener('mouseout', () => exitImage.setAttribute('src', "./assets/images/x-button.png"));

    exitButton.addEventListener('click', function() {
        projectDetail.style.display = 'none';
        projectDetailPage.className = 'project-detail-container hidden';
        projectPage.className = 'projects content-1';
    })

    exitButton.appendChild(exitImage);

    projectDetail.appendChild(exitButton);

    projectDetailPage.appendChild(projectDetail);


    
}

function updatePreviewImage(buttonParent, button, image) {
    // console.log(buttonParent, button)
    console.log(buttonParent.childNodes)
    buttonParent.childNodes.forEach(btn => {
        btn.style.backgroundColor = 'var(--white)';
    })
    button.style.backgroundColor = 'var(--yellow)';
    console.log(button)
    console.log(button.getAttribute("data-srcimage"))
    image.setAttribute('src', button.getAttribute("data-srcimage"));
}

function fixPositionShortTable(shortTable) {
    // console.log(shortTable)
    let hRef = null
    shortTable.childNodes.forEach((divShortTable, index) => {
        const w = divShortTable.childNodes[0].offsetWidth
        // console.log(divShortTable.childNodes[0])
        divShortTable.style.width = w + 'px';

        const h = divShortTable.childNodes[0].offsetHeight
        if (index == 0) {
            hRef = h;
        } else {
            if (h > hRef) divShortTable.style.width = (w - 50) + 'px';
        }

        const p = divShortTable.childNodes[1]
        const isPSingle = p.childNodes.length == 1;
        p.style.transform = `translate(calc(-50% + (0.5 * ${w}px)), ${isPSingle ? -180 : -149}% )`;
    })

    

}


/*
<div class="project-detail__preview-images">
    <img src="./assets/images/projects/project1-1.png" alt="project1-1">
    <div class="project-detail__preview-images__buttons">
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
    </div>
</div>
<article class="project-detail__article">
    <h3>Quamus Academy</h3>
    <div class="project-detail__article__p-container">
        <p>Quamus Arabic is an Arabic learning platform with the Mustaqilli Method. Quamus Arabic provides learning media in the form of videos, games, exercises, quizzes and fill-in-the-blank exercise sheets. In addition, Quamus Arabic also provides bonuses in the form of vocabulary applications from Q.S. Al-Baqarah, shalah readings, and du'a readings that can be accessed for free.</p>
        <p>As an HTML5 game developer, I collaborate with a team to develop games and exercises to evaluate students' understanding, as well as develop vocabulary applications.</p>
    </div>
</article>
<div class="project-detail__long-table">
    <p class="thead thead-year">Year</p>
    <p class="thead thead-role">Role</p>
    <p class="thead thead-tools">Tools</p>
    <p class="thead thead-langnframe">Language & Framework</p>
    <p class="tbody tbody-year">2021 - 2022</p>
    <p class="tbody tbody-role">HTML5 Game Developer</p>
    <p class="tbody tbody-tools">Visual Studio Code,<span class="block-text">Adobe Animate (for slicing assets)</span></p>
    <p class="tbody tbody-langnframe">Javascript,<span class="block-text">Phaser.js</span></p>
</div>
<div class="project-detail__short-table">
    <div class="short-table__year">
        <button class="thead thead-year">Year</button>
        <p class="tbody tbody-year">2021 - 2022</p>
    </div>
    <div class="short-table__role">
        <button class="thead thead-role">Role</button>
        <p class="tbody tbody-role">HTML5 Game Developer</p>
    </div>
    <div class="short-table__tools">
        <button class="thead thead-tools">Tools</button>
        <p class="tbody tbody-tools">Visual Studio Code,<span class="block-text">Adobe Animate (for slicing assets)</span></p>
    </div>
    <div class="short-table__langnframe">
        <button class="thead thead-langnframe">Language & Framework</button> 
        <p class="tbody tbody-langnframe">Javascript,<span class="block-text">Phaser.js</span></p>
    </div>
</div>

<div class="project-detail__links">
    <a href="https://quamus.id/">Check out the live web here!</a>
</div>
<button class="project-detail__exit-button">
    <img src="./assets/images/x-button.png" alt="exit-button">
</button>
*/

export function settingCallButtonForMobile() {
    callButton.addEventListener('mouseover', () => callButton.children[0].setAttribute('src', "./assets/images/contact/contact-icon-hover.png"));
    callButton.addEventListener('mouseout', () => callButton.children[0].setAttribute('src', "./assets/images/contact/contact-icon.png"));
    callButton.addEventListener('click', () => {
        callButton.style.opacity = 0;
        callButton.style.transform = 'translateX(50%) scaleX(0)';

        socmedIcons.style.scale = 1;
        socmedIcons.style.opacity = 1;
    });

    

}
