import { projectData } from "./data.js";
import { 
    addProject,
    initUI,
    showMainPage,
    showContent,
    settingCallButtonForMobile,
} from "./ui.js";

const ghostButtonContainers = document.querySelectorAll('.home__button-container');
const contentButtons = document.querySelectorAll('.content-button');
const menuButton = document.querySelector('.menu-button');

export let activeContentIndex = null;
let isPGhostDynamic = true;


// media query
function changePGhost(x) {
    isPGhostDynamic = !x.matches
}
let mqTabletMobile = window.matchMedia("(max-width: 768px)")
changePGhost(mqTabletMobile);
mqTabletMobile.addEventListener("change", function() {
    changePGhost(mqTabletMobile);
});


document.addEventListener('DOMContentLoaded', function () {
    initUI();

    ghostButtonContainers.forEach(buttonContainer => {
        const button = buttonContainer.children[0];

        button.addEventListener('mouseover', function() {
            buttonContainer.childNodes.forEach(child => {
                if(child.tagName == 'P' && isPGhostDynamic) {
                    child.style.opacity = 1;
                }
            })
        });
        
        button.addEventListener('mouseout', function() {
            buttonContainer.childNodes.forEach(child => {
                if(child.tagName == 'P' && isPGhostDynamic) {
                    child.style.opacity = 0;
                }
            })
        });

        button.addEventListener('click', function() {
            activeContentIndex = Number(button.id[13]);
            showMainPage();
        });

    });
    
    menuButton.addEventListener('click', function() {
        initUI();
    });

    contentButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            activeContentIndex = index;
            showContent(activeContentIndex);
        })
    })

    addProject();

    settingCallButtonForMobile();
});
