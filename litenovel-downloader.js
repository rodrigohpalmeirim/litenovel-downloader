const fs = require('fs');
const request = require('request');
const jsdom = require('jsdom');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

queryURL();

var novelUrl;
function queryURL() {
    rl.question("What's the URL for the novel?\n", function(input) {
        if (/https:\/\/www\.wuxiaworld\.com\/novel\/.+$/.test(input)) {
            novelUrl = input.match(/https:\/\/www\.wuxiaworld.com\/novel\/[^\/]+/)[0];
            getInfo();
        } else {
            console.log("That is not a valid WuxiaWorld URL.");
            queryURL();
        }
    });
}
/* function query() {
    rl.question("What's the name of the novel?\n", function(input) {
        process.stdout.write("Searching...");
        request({uri: "https://www.google.com/search?q="+input.replace(" ", "%20")+"%20site:wuxiaworld.com"}, function(error, response, body) {
            clearLine();
            if (!error && response.statusCode == 200) {
                const {JSDOM} = jsdom;
                var dom = new JSDOM(body);
                var searchPage = dom.window.document;
                
                try {
                    novelUrl = searchPage.getElementsByTagName("cite")[0].textContent;
                    if (/https:\/\/www.wuxiaworld.com\/novel\/[^\/]+$/.test(novelUrl)) {
                        console.log("Found it!");
                        getInfo();
                    } else {
                        console.log("Could not find any novel with that name.\n");
                        query();
                    }
                } catch (err) {
                    console.log("Could not find any novel with that name.\n");
                    query();
                }
            } else {
                console.log("Could not complete search. Please check your Internet connection.\n");
                query();
            }
        });
    });
} */

var novelTitle;
var chapterAmount;
var chapterUrl;
function getInfo() {
    request({uri: novelUrl}, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            const {JSDOM} = jsdom;
            var dom = new JSDOM(body);
            var novelPage = dom.window.document;

            console.log("Alright!");

            novelTitle = novelPage.getElementsByClassName("panel")[0].getElementsByTagName("h4")[0].textContent;
            chapterAmount = novelPage.getElementsByClassName("chapter-item").length;
            chapterUrl = "https://www.wuxiaworld.com"+novelPage.getElementsByClassName("chapter-item")[0].getElementsByTagName("a")[0].href;
            
            confirm();
        } else {
            console.log("That page does not exist.");
            queryURL();
        }
    });
}

function confirm() {
    console.log(novelTitle + " - " + chapterAmount + " chapters");
    rl.question("Is this it?\n", function(input) {
        if (/^(y|Y)/.test(input)) {
            rl.close();
            start();
        } else if (/^(n|N)/.test(input)) {
            console.log("No? Hmm... Let's try again!");
            queryURL();
        } else {
            console.log("Excuse me, wtf?");
            confirm();
        }
    });
}

var pageBeginning = `
<head>
    <title>Litnovel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" charset="UTF-8" /> 
    <script>

        openMenuImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA5klEQVRoge2awQrCMAxA39aC3hQmePC7ZN84/B73FZMeNnea4EHwpDjZuqUh71hGm0dKSFmyEMIVOAAP0sQBjQdOwG7lYKayyYFh7ShmYMjXjmAuTEQaJiKMQouImozgY218qaqP6+eyjHKemoyYiDRMRBpaRG5aRNRkxETEoUYkCyE0QPHrw2+9U2xG9mZWtcRhItJQIzK6av3Lwi9Eq1riMBFpmIg0TEQaJiINNSLReq2FsV5LHCYijZzXUErqOO+ca4EtaU8Htb6u6x64k+5wjQd633XdEdivHc1E3lcr2m/qhWifGGUuvIR+qZ4AAAAASUVORK5CYII=";
        closeMenuImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA0UlEQVRoge3asQrCMBSF4d8moJuCgoPPJX3G4vPYp1AytDpVcBDchEIrOQ3nmzPcn9uhhKxSSlfgALxYpgDcInACtpmHmWpdAUPuKWYwVLknmItD1DhEzL6UkGI24hA5DlHjEDWlhNxLCSlmIw6RU0xIHHvw0jT/nOOnc12POlfMRhyixiFqVimlG7DPPchE/teS4xA1DlHjEDUOUeMQNQ5R4xA1FZ9HKUsXYgihAzYs+3VQF9u2fQIPlvu4JgLP2Pf9Edjlnmai76c1+upUVPcG870fTGPdRYsAAAAASUVORK5CYII=";
        darkmodeImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAFLaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz6eHGDvAAACZklEQVRoQ+2Yz27aQBCH14gbEm/QqJBLU/5cSsIjVDlXecmox6hnLiFBSSNCIPSSpkeOCISEUoLrnxknhBpY784EG/FJiNkVQv48s97xOoPBwJ1Op8pxHJVEXNdVqVRKOf1+34tdmk4mSEKK4sSzE4kbO5G4sRUieOpaP357vZ66ub5Wo9GIZt6SyWTU50JBfczlaEYGI5F1Fx+GtJCRyI+zs0gS80gJGa2R/P4+RQugzVnT6uAG/PSy+fvhgWZ4sFoj309P/YVmCjJTKBZpZIfVU6tYKlFERJS673TUr26XRnawNI24mLtWazbAf0XopNG5fjs5oZE5LPvIp4MDVSqXZwNIRLgxeIXgyArbhqgtEzLfabf9b7TjYZ914DesO7uWTMiFISt/Hh+9n7uhHx1YRYBpmeGRbAO7CIAMFrGPJ6NTHsiKDSIiYH5/0C0PG8REkJWlCIiJiaxEo9SishkRAXYi3CztqDWJjciXSoUiM8RE8Bapy4e9PYrMERO5ajQoWs9RtUqROWIi4/GYotVgbbx0ARaIiOiWFUrKdm0EiIjolhVHSQWwi+BQ4aWsVuzgXCUVwCqCkmoFr7xgSU8FCa6SCmATgcTlxYX6+/REMzMWcyIhAVhE/pOYK6n5nEhJAGuRZZlYRFICGB8HQUD3/Debzaqvx8c04sc/pDA9xK6fn6vnyWQ2gVJ6x4W9iLGIziF2Lp9XlcNDGsliLOKfLN7evmYC3x7vcffDMBaJGxBh3RA3yU4kbmyNiDMcDv3FjgWTRIJrd5rNpjvxNrYki6TTaeXUajVfJMn4IvV6fQtE0uofOG1EcF88yFIAAAAASUVORK5CYII=";
        lightmodeImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAFLaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz6eHGDvAAAC8klEQVRoQ+2ZzW4TMRRGPVF2eQZKSzeUlG5I6YNA2mesIhYVFdsmQkqpKCgqi8KqLKOsokSRohBlyOfaYJmxxz/XhEE9UlTPKJnxmXttX0+zyWSSr1YrlmUZqyJ5nrNarcay8Xi8bufidDVBEGqiXXkeRGIZDoesd3HBvt/diTNxbEQEEh8uL9loNGKfrq/F2Tg2IvLx6or9WCx4GzMmBd4isSmB38/nc3HE2JPdXdEKh0/Bou0MnqZMiRAZ/F7lRaslWnF4iyyUlPDN7xTRkHiLNPf3RetexicqqaIBvEWe7u3xkkDiE5VU0QDeIkCPiivqA6CMBggSQVRUXNNLPgDqaIDgovFNp/MrGnjSr9pt3t4UQREBoemVimARfdDHglLc9NHBNP7u/Jx/kNb8ezH7ka+3t+zLzQ3PeerBq4KOf17PjrPZTJz5DR7m6+PjNBsr/caNRoP/xTHaz5pNtr2zw8+ZsHVeBQ+xdXhIL4IOoLKVRaEJm5DrNWQmRKeWjmsHJEgLdESXQe4XRcKUwuQib8/O/li91RvLMaVSNHWr33MZf6QiiMb7Xk8c2TugC7VPTkQrDIiQzZ8+BaFeGVBAJpKyIHSBbkVTKMtppCE1SURsyJmNmiQitmpYffEAqNKQTEStu4o2W4gE1gfb9BwDmYhtC4w20kld5B5tbZFJANIFUd2j2IDEy6MjsurZe0FEeqCQA0V1UtHKrWNKp7Jr23AWkTdRU6OotAAmmbIo6PWVa5UMnETkdKkXgpQDFdiiWSZlFSmKgoRaQlKWmiYhowhVFHCdb+vOPd7e9sp5XyGjiF6Og5AoyOtgXOC3PjISk5Q6RiFSOPLk+10AAZTZIakU855YgkoZ939+cCDO3KNP84Ui6ou0mLFA+cpIF0LfVJym3xg6p6eiFb+BMmFMrSryIPKvkVyEqjAsI/ldUv4rQSX5rPU34Cv7dDrlIjioIrLv2WAwyJfLZaVF6vU6y7rdLhepMlyk3+//ByJ19hPEFTMcsW+gewAAAABJRU5ErkJggg==";
        
        window.addEventListener('contextmenu', function (e) { // Not compatible with IE < 9
            e.preventDefault();
        }, false);
        
        var pageName = document.title.toLowerCase().replace(" ", "-");
        if (localStorage.getItem(pageName)) {
            var storage = JSON.parse(localStorage.getItem(pageName));
        } else {
            var storage = {};
            localStorage.setItem(pageName, JSON.stringify(storage));
        }
        function storageSet(name, value) {
            storage[name] = value;
            localStorage.setItem(pageName, JSON.stringify(storage));
        }
        function storageGet(name) {
            storage = JSON.parse(localStorage.getItem(pageName));
            return storage[name];
        }

        window.onscroll = function() {
            storageSet("scroll", window.pageYOffset);
            if (extended) toggleDropdown();
        };
        window.onload = function() {
            selectChapter(storageGet("chapter"));
            window.scrollTo(0, storageGet("scroll"));
            document.getElementById("page").style.fontSize = storageGet("fontSize");
            changeMode(storageGet("mode"));
            setTimeout(function() {document.body.removeAttribute("class");}, 0);
        };
        
        var extended = false;
        function toggleDropdown() {
            extended = !extended;
            updateDropdown();
        }
        function updateDropdown() {
            if (storageGet("chapter") <= 0) {
                document.getElementById("previous").removeAttribute("class");
                document.getElementById("previous").style.left = 20;
                document.getElementById("previous").style.opacity = 0;
            } else {
                document.getElementById("previous").className = "nav-button";
            }
            if (storageGet("chapter") >= document.getElementsByClassName("chapter").length-1) {
                document.getElementById("next").removeAttribute("class");
                document.getElementById("next").style.left = 20;
                document.getElementById("next").style.opacity = 0;
            } else {
                document.getElementById("next").className = "nav-button";
            }

            if (extended) {
                for (var i=0; i<document.getElementsByClassName("button").length; i++) {
                    document.getElementsByClassName("button")[i].style.bottom = 20+(i+1)*60;
                    document.getElementsByClassName("button")[i].style.opacity = 1;
                }
                for (var i=0; i<document.getElementsByClassName("nav-button").length; i++) {
                    document.getElementsByClassName("nav-button")[i].style.left = 20+(document.getElementsByClassName("nav-button").length-i)*60;
                    document.getElementsByClassName("nav-button")[i].style.opacity = 1;
                }
                document.getElementById("menu").setAttribute("src", closeMenuImg);
                document.getElementById("menu").style.opacity = 1;
            } else {
                for (var i=0; i<document.getElementsByClassName("button").length; i++) {
                    document.getElementsByClassName("button")[i].style.bottom = 20;
                    document.getElementsByClassName("button")[i].style.opacity = 0;
                }
                for (var i=0; i<document.getElementsByClassName("nav-button").length; i++) {
                    document.getElementsByClassName("nav-button")[i].style.left = 20;
                    document.getElementsByClassName("nav-button")[i].style.opacity = 0;
                }
                document.getElementById("menu").setAttribute("src", openMenuImg);
                setTimeout(function() {
                    if (!extended) {
                        document.getElementById("menu").style.removeProperty("opacity");
                    }
                }, 400);
            }
        }
        
        if (!storageGet("chapter")) {
            storageSet("chapter", 0);
        }
        function selectChapter(chapter) {
            if (chapter >= 0 && chapter < document.getElementsByClassName("chapter").length) {
                document.getElementsByClassName("chapter")[storageGet("chapter")].style.display = "none";
                storageSet("chapter", chapter);
                document.getElementsByClassName("chapter")[storageGet("chapter")].removeAttribute("style");
                storageSet("scroll", 0);
                window.scrollTo(0, storageGet("scroll"));
                updateDropdown();
            }
        }
        var holdTimer = null;
        var holdLoop = null;
        function holdNext() {
            holdCancel();
            holdTimer = setTimeout(function() {
                holdLoop = setInterval(function() {
                    selectChapter(storageGet('chapter')+1);
                }, 20);
            }, 300);
        }
        function holdPrevious() {
            holdCancel();
            holdTimer = setTimeout(function() {
                holdLoop = setInterval(function() {
                    selectChapter(storageGet('chapter')-1);
                }, 20);
            }, 300);
        }
        function holdCancel() {
            if (holdTimer || holdLoop) {
                clearTimeout(holdTimer);
                holdTimer = null;
                clearInterval(holdLoop);
                holdLoop = null;
            }
        }

        if (!storageGet("fontSize")) {
            storageSet("fontSize", 16);
        }
        function reduceFontSize() {
            if (storageGet("fontSize") >= 2) {
                storageSet("fontSize", storageGet("fontSize") - 1);
                document.getElementById("page").style.fontSize = storageGet("fontSize");
            }
        }
        function resetFontSize() {
            storageSet("fontSize", 16);
            document.getElementById("page").style.fontSize = storageGet("fontSize");
        }
        function augmentFontSize() {
            storageSet("fontSize", storageGet("fontSize") + 1);
            document.getElementById("page").style.fontSize = storageGet("fontSize");
        }
        
        if (!storageGet("mode")) {
            storageSet("mode", "lightmode");
        }
        function changeMode(mode) {
            if (mode == "darkmode") {
                storageSet("mode", "darkmode");
                document.getElementsByClassName("button")[3].setAttribute("src", lightmodeImg);
                document.getElementsByClassName("button")[3].setAttribute("onclick", "changeMode('lightmode')");
                document.body.style.background = "#222";
                document.getElementById("page").style.background = "#2b2b2b";
                document.getElementById("page").style.color = "lightGrey";
            } else if (mode == "lightmode") {
                storageSet("mode", "lightmode");
                document.getElementsByClassName("button")[3].setAttribute("src", darkmodeImg);
                document.getElementsByClassName("button")[3].setAttribute("onclick", "changeMode('darkmode')");
                document.body.style.background = "#dadada";
                document.getElementById("page").style.background = "#e8e8e8";
                document.getElementById("page").style.color = "black";
            }
        }
    </script>
    <style type="text/css">
        .preload, .preload * {
            transition: none !important;
        }
        body {
            margin: 0;
            transition: background-color 200ms linear;
            font-family: open sans, sans-serif;
        }
        #page {
            margin-left: auto;
            margin-right: auto;
            max-width: 800px;
            padding: 15px;
            transition: background-color 200ms linear, color 200ms linear;
        }
        #menu, .button, .nav-button, #next, #previous {
            position: fixed;
            left: 20;
            bottom: 20;
            transition-duration: 500ms;
            -webkit-user-drag: none;
            user-select: none;
            cursor: pointer;
        }
        #menu {
            z-index: 1;
            opacity: 0.2;
            transition-duration: 200ms;
        }
        #menu:hover {
            opacity: 1;
        }
        .button, .nav-button {
            opacity: 0;
        }
    </style>
</head>

<body class="preload">
    <img id="menu" onclick="toggleDropdown()" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA5klEQVRoge2awQrCMAxA39aC3hQmePC7ZN84/B73FZMeNnea4EHwpDjZuqUh71hGm0dKSFmyEMIVOAAP0sQBjQdOwG7lYKayyYFh7ShmYMjXjmAuTEQaJiKMQouImozgY218qaqP6+eyjHKemoyYiDRMRBpaRG5aRNRkxETEoUYkCyE0QPHrw2+9U2xG9mZWtcRhItJQIzK6av3Lwi9Eq1riMBFpmIg0TEQaJiINNSLReq2FsV5LHCYijZzXUErqOO+ca4EtaU8Htb6u6x64k+5wjQd633XdEdivHc1E3lcr2m/qhWifGGUuvIR+qZ4AAAAASUVORK5CYII=">
    <img class="button" onclick="reduceFontSize()" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTY4QTNFMzdEMEU2MTFFNzgzQUY5NjY3M0RGREJCODEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTY4QTNFMzhEMEU2MTFFNzgzQUY5NjY3M0RGREJCODEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNjhBM0UzNUQwRTYxMUU3ODNBRjk2NjczREZEQkI4MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNjhBM0UzNkQwRTYxMUU3ODNBRjk2NjczREZEQkI4MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhdvXpsAAAS1SURBVHja7FrZUhpBFL0MI7igIigouESjFauSx1T+/zGWeUtp4ktwRRAiKpvsOaczPYWKOixhMXRVO8PM0HPPveduLa5MJnMgIouYNRnN4cZMm/gTxZyX0R5eA3+qMvqjasgbGWMgYyBjIP8JEHPQAkxPT4vb7W590+WSWq0m98WiOrrweSiBULBv+/uSy+VaClmtVmXW55P3OzsyOzurPg+tRWKxmKSSSXEZT1leKpUkFArJ6vq6+P3+/gIxQBOvxyONRuOJ9svlshKmWfuTk5MyPTPT0iKmacrU1JQYAPl4vX8KxJyYkOTlpex9/SpeCKgHhagAxOcvX2RtbU3u7+/te/V6/Vn+8zrv99XZqbUyBDw5PpYkqOKBVZpHEQ4bjcclHA6rZykgAUajUQkGgy2B8BlajJZ5DVBPgVDYi4sLFYmMR5ynoMlEQrLZrOK7FuzD7q6jtV/yj54CoXZvb27k7u7uiTU036+uriSH+7RApVKxrztZuy8JUdEKPhCHf2hLkN9zc3OysLBgOzitEAe9ioWC/RyFfG32LbNTyBL84xJCMrlpAdYQNiOrq1JGGNXaJ9g8gDixRN9LFGo/lUrZiU076fLKiiwtLqoIxmcI8iaTUdNpNOobEB2BLs7PbbqQSnR4ZuO5+XkJBAIP8kccAYEh2DCM4bJIAVRJMDtbghIYhadTz6DE8Ft+oumVQPQi3YYKCCnDvMGE57KKPFojCEoxMk2BVotLSyqSESCFZ3RjBOPnlwrBvgGhEJxx0EoLRCA+lBzh5WUFhPUSLaOilxVyJwDq/OxMRbpeWaXrVe5ub5VFmrOxD76h/YIzABD0FYLUfkWLNJcqAwXCEMu8wKOOVizyQrCG7jFUBMO1ZnrxWVYBV1CABjcwIFrwSwuITStYY3t7WwnNcx+cfQLF5LvNzQdOz2tnoFcd3+kFvbrKSregVQY5QQ9agYlxf2/vb39hAXRZtRL9RVuKikiBXqy9FkDDgQJhPmimhgZydHT0sLTAOfsUWonhV98jOCbSeRSRBOa0HOkpEL6U1NAZW1+j9uknTgpAUur09FQ2t7a6Llk6IicFIC1Y/HWbBzLX14peA3F2AmEeqD1qW9utZFsFjL5Riy8nt5kHKjjq7o1R6OOnT7IFmlSfCaksHg++f5efP37YWZ4ATk9OVIPVTfRqGwj94TgWU/VVc09BIBG0rdxIqD1T2XrwDCvi2K9fks/n7e9zrXQ6rdrgTi3TtgoYfRitylZtpQfzBcsQliXMDa1mCd8Jh0IyA7DNZTwDBhNrN/5mtOsbBfQc13BQvfNBDZJeK5HIq9psQHiP16uyPC2oKwKulUDDVe8iy7cFhC/nLgmToC4IuZ3JwY20ugNa0L8iAE2KklJcg5PNFjfrnt0+7aWPUIOkxAp4znxBIlB4n9VzNBx0fdR+ANXw+saG5BB2VWusgwjudeojLmg3jWPQKRAvqMGNOJ2xudFMAKxknQpBodkK2zuI9A0caS36Xgfjt9lu6OWLOnzZA4UULUoOVas7DGMMZAxkDOR1IO43gMNtIiGxGeB/ZUb510FZ8/DwsICTvIzuj2uYCwtmLpcL48T/VqhljjiQ7B8BBgAufvcwI/rvYQAAAABJRU5ErkJggg==">
    <img class="button" onclick="resetFontSize()" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+nhxg7wAABM1JREFUaIHtmttP20gUh78ZX3IhAZIAIVDaLaq0lbaPq/7/j632sWq7fSmXEIc4FAMJju14ZvaBxFK6dEsSa4GKn+QHj+OZ83nOOXPGsQiC4COwASgepyzgzAZ2gbV7NmZZFSSQ3rcVOSiV921BXnoCeWh6AnlgavwqIL/MjDyBPDjZeXcoLYuC62KMmWkXQpAkCWmaIoTIe9h8QWzHodft8v7dOwrFYtZujGGcJPz59i17e3tEUZTnsDdj59WRlJIkijg6PKTX6+G67sz10WjErufRbDaRUqK1zmtoIGeQ0WhEp9OhXC4j5Wz4CSHonZ4yGAxYX1/PHSS3YDfGcHlxwdXV1b8gAGzbxvd9hldXWJaVtQshfnrcQd9yAZFSkiQJXrebQSilWF1dpVarZQGutcbzPEZhmP3OGPPT40425AEihCCOIrqeh2VZmQF7z5+z8+wZSRwDN7PidbtchyG2nW/CzAVEKUW/32c4HGZPvlgsst1qsbmxQaFYRCmFZVlcBAEXQfDwYmSagTonJ5m7pGlKuVymWq2yurZGvV6fWT+8Tocoim6NpYXtyKOTMAw57fUyQ7XW1Ot1Go0GK5UK65M4gRv3Oj09JYnjhwWilKLX6zFOEoQQKKUol8s0NjYYj8eUikU2NjdxXRetNVJKLi8u8H0frXVuq/xSINP06J2cZAYppaisrNDc3mY8HhPHMY1G4yZ7jccAOK7LSbtNkiS5zcrSvVxdXtLr9bJzrTWVajWLizRNqddqrK6todTNqzMpJb7v51qqLAVijMHzPIwxWbYqlUpsbW9ni57WmmKpNONeQghGoxF+r5fB3RvI1PDuBAQmblWt8urVK1zXpVKtUqlUcByH316+nAl6x3Fot9topXJxr6VWpcvLS4IgyM4tyyKOIv56/x4hJUwAhZSkaUocx9lMCSHo+z6DwYBavb6MGcCSIF6nM+MaU5AvX77MlhbGIC0L13WxbTu7lqYp/X6ftfV1hBB3Lkdu08Igxhja7Xa2Yk/bhJSUSqX/vG8qKSXHx8e83N9fumRZyDmllPR9n1EYLr0OBOfnDAaDpfqAJUBO2m3Ud9vWeSvZ2xLGopp7PoUQpGmK7/uM0xTbttFa4zgOf7x5w/7+PukPUmqhWOTjhw/8/flztsobYzg+OuL316+Xyl5zg1iWxeHBAeF3ewrHcdjZ3aW8soL6QWXrOg7brRYHX79yfX2d3R+GIWdnZzSbzYVnZu5HIC0Lr9MhmdRWU1UqFWq1GuPxGK3UrUecJDS3tlhZWZkp45VSeJ63VLzNBSKlJBwOOT8/RymVpUzbtmnt7Pz0aRqtcQsFNjY3cRwnqwiUUpx2u+glVvm5QBzH4ejwkCAIsoIwGo0A2NraQt/BLdI0ZWdnB8uyCMOQOI6J45iLIODg4GBmPz+P5ooRYwxaa1qtFkJKBKCNoTLZc5g77PqUUtQbDZ6/eMFwMLjZGjNJIkotHCMiCIIzoHFXkEKhgO040wYQAqM1URTd2QghBMViMctaCAHGkKYpSZIswvFtrhmZvvZccLBMxhhGE5fMS7/MS+wnkIemJ5CHJsnNRymPXZZtWdYAKPK4vw4a2J8+fQqBax7vxzU2ENrD4bAJrN+3NUsqc63c/xT9nzX4BxH1tMNTaf+LAAAAAElFTkSuQmCC">
    <img class="button" onclick="augmentFontSize()" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUU5MzUyNjFEMEU2MTFFNzlCQUZFOEZDMzkzQkY4MkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUU5MzUyNjJEMEU2MTFFNzlCQUZFOEZDMzkzQkY4MkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBRTkzNTI1RkQwRTYxMUU3OUJBRkU4RkMzOTNCRjgyQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBRTkzNTI2MEQwRTYxMUU3OUJBRkU4RkMzOTNCRjgyQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pql1dFkAAAWNSURBVHja7JprUxpZEIabYRDxbkAFNZVYXlbjP1jzOVb+d/ZLtlJb5ZZmP+TiHaPgDVFUlPRzMocaRlgwoBtcTtXIgGfO9Nv99tt9BkJHR0erIpLQ40bac4T1yLj6Z0KPQWnvEXX0T1HafxQdeSLjyQBxfyVjQqGQRKNRCYfDvJGbYlEKhUJ7AQHEzc2NrH/9Kvl8Xkq3t9LT1yfJZNIAK5VKbQLEceRavb+ysiIb6+tyfXUlL6am5M3yskQiEQOyragVi8Wkv79fitfX0tPTYz77XyV7B8iTlF8rm9U+v1auc/i57qgKkcB+9jueMjnOD9/a8+7ubrO2P9lZ6/Ly0nxm1w1p05jR1/hPh1Rvhlz+8e5dhbEYcqXKs7i4KAuvXsn5+fmPDs915Vs6LWurq8YYABhD9LhVyT07OzPX6QISUQAkvqPr+sWX635fWpKRkRHjJB1Zt9lIcPOtzU3ZU+OCCnOhxg8NDcnU9LQBzFzmUOT29/cNuLAHxK7HexMV5FgB7e/tSbCCXFxc3Ily09QqavXd3tqSrq6uO0B4f3h4KJlMRlJa2PCkjaKrkYFefiD2Gi+k5tzVOXfuGQDREiB5pcLx8XH1BFRjjxTIoQKZnJiooCPAiZAfCHSE93xugOg8k0sBo21kWwpkd3e3vDCvvb290qetRVqpBhAMgnZTWqWjmrh4c0yjs/z2bWWuKaCCUubP9+9ld2fHzBufnJSl16/vJDuAcYDJpVbIL4tzUwCwOEdCE5DWwktCQ42DgwNRUSnTxFBGQVY7/J6uNa9alJxmEh3+n56elr3ETWjyUBPaC4DiuVwuZ/LEL5cWePAIjkbnOc3I7s72djnkRAXeDw8Pm35pbGzMCAGGM3dP1SenoA3dfqXKDnXIA2ssXiI3RjUicDquUeF/DKhwoHJLZOoBwTGsDf/t9Q8GBA9jGHXCgsBYKHWrhnCeSCQkpsltlYlokPQYaKt3gEPmhWgS1WfxuHHMg7YoGIpa4TGMwou0Eqnx8TLVqMijSq8dFQPTaqiBXDM9M2OKpF9xLDWJ1vzCgszNzZWdE/YKacuBEAEqctoDYqmCtKJY9qZ9CgSvbmxsGKoxL6sJT2TweNUHVBo5ImkEgUjrWtCs3u7wp6iFQXiWKm0VCANGR0eNB/2JD9WIhK0zRIGkNz1WFXphsM2PK51jJfxBcoRqSzQs1zEyokbPKh3gN5GA21H9bPL5c0kqvSyNoB91x/RYLVYv975JfqbKk/Vqgo0A53/rXvufjx/LSRvyQNIZ23lELpvNyrEWx4HBwbJQPDoQaEU06D4tNULeY5svnz9XJqXXK0ExrrMG84ripVIpE5X/BAjG0+kCBAP9AgBtag2/sVy3qWvMKBUHNSqNKFJLcwSvZpQWJycnDT/ZqOWMU+2W6b1KXqv+uECU52mbqIE9RK1+qNwXBehDp2uKo0/5HoVaIU/T2dVBKz+NZmZn5bf5+ZoGIb9fPn2Svz58kKLXRBLdTa0vFL+uKnv9BwOC6tBXoTbBrWlSk5YqXitlkWEaSGQZxbLXU0to75HqVqiX02h+QAVadmsINyYyca3enNNjVTswmApPNfc3geQKVDUtTQvo5TSSnJeFgqkdVFp/Raa3cutIqOmhaCK1yse8Km/XpcrzICL0GMmOXG6r577pTa2HOajWtCDBxK/a8utctrdstnjcY9fgnPpT7wF1a3LEK3jPtJkb0X7KJrXj9Vd2r15vjzEwMCAvXr40dLQ1qORTPSLUTJ7UfUBn22k62JJv38CAFvcpaICo+K7Dc5J9TNTEqP+ADo+TpPfZrdUajX771Hka3wHSAdIB8q9Awk8AR9hVXc8h8dLevw7KuWtra3yVlJf2/XENtfDc1X5nTE+Gngq13DYHkvsuwADFQ1cIDmvwqAAAAABJRU5ErkJggg==">
    <img class="button" onclick="changeMode('darkmode')" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAFLaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz6eHGDvAAACZklEQVRoQ+2Yz27aQBCH14gbEm/QqJBLU/5cSsIjVDlXecmox6hnLiFBSSNCIPSSpkeOCISEUoLrnxknhBpY784EG/FJiNkVQv48s97xOoPBwJ1Op8pxHJVEXNdVqVRKOf1+34tdmk4mSEKK4sSzE4kbO5G4sRUieOpaP357vZ66ub5Wo9GIZt6SyWTU50JBfczlaEYGI5F1Fx+GtJCRyI+zs0gS80gJGa2R/P4+RQugzVnT6uAG/PSy+fvhgWZ4sFoj309P/YVmCjJTKBZpZIfVU6tYKlFERJS673TUr26XRnawNI24mLtWazbAf0XopNG5fjs5oZE5LPvIp4MDVSqXZwNIRLgxeIXgyArbhqgtEzLfabf9b7TjYZ914DesO7uWTMiFISt/Hh+9n7uhHx1YRYBpmeGRbAO7CIAMFrGPJ6NTHsiKDSIiYH5/0C0PG8REkJWlCIiJiaxEo9SishkRAXYi3CztqDWJjciXSoUiM8RE8Bapy4e9PYrMERO5ajQoWs9RtUqROWIi4/GYotVgbbx0ARaIiOiWFUrKdm0EiIjolhVHSQWwi+BQ4aWsVuzgXCUVwCqCkmoFr7xgSU8FCa6SCmATgcTlxYX6+/REMzMWcyIhAVhE/pOYK6n5nEhJAGuRZZlYRFICGB8HQUD3/Debzaqvx8c04sc/pDA9xK6fn6vnyWQ2gVJ6x4W9iLGIziF2Lp9XlcNDGsliLOKfLN7evmYC3x7vcffDMBaJGxBh3RA3yU4kbmyNiDMcDv3FjgWTRIJrd5rNpjvxNrYki6TTaeXUajVfJMn4IvV6fQtE0uofOG1EcF88yFIAAAAASUVORK5CYII=">
    <img class="nav-button" id="next" onmousedown="selectChapter(storageGet('chapter')+1); holdNext()" onmouseup="holdCancel()" ontouchstart="holdNext()" ontouchend="holdCancel()" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABf0lEQVRoge3az26CQBDH8R+ySXtrk46uSd8AeP+z6TvUd1iD4QD1JLWnadJDI8v+mYH4PbMynyyJWaXouu4TAAEYscxKAK0B8A7gRXiY0J42AK7SU0ToupGeIFYPiLZWBXmTHiJGq9qRVeQN+Tgc0LZtilmCMr4LnHNwzsFai6ppQEQp5vLOG8JpA82GcFpAwRCOQTtrUQuAokG4k3M4CYAMgDPufCkWReH9wblBk3bkdrvNvkEuUPRH679Sg7JBuFSg7BAuNkgMwsUCiUO4UJAaCPcHVNeg7XbSOnUQzhek/jzyPY4Yx/u/HardESJCVdew+/2k69VBiAhV08Ba67VODWQugBOHhAI4MUgsAJcdEhvAZYOkAnDJIakBXDJILgAXHUJEqJsGu0wALhpECsAFQ6QB3GyIFgDnDdEG4Iqu61os/8+es/rzyNQeEG2tClJKDxGh0pRl2QN4xrLfDurN8Xi8APjCcl+uMQAuZhgGC+BVeprAfh8t8bN7YP0PP+eTZhhZDg8AAAAASUVORK5CYII=">
    <img class="nav-button" id="previous" onmousedown="selectChapter(storageGet('chapter')-1); holdPrevious()" onmouseup="holdCancel()" ontouchstart="holdPrevious()" ontouchend="holdCancel()" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABhElEQVRoge3aQW6CQBSA4R8haXdtYuOQ9P73MD0DwxkcfYaFtiupXY1pFw0CM/NG479yIcn7AgiMFF3XWeAN6LnNSkAq4B14UR5mbk8L4KQ9RYBOC+0JQvWA5NYDklnLe4HczR7JDyIifKzXo7erwo8yLRGhbRqcc5O2V4eICLZp2E4E+NQgoQC+5JDQAF8ySCyALzpkKqAoisvn8/k89PV9NMjcPXDF8H8KDol9CP1XMIgWwDcbog3wTYbIboe1Vh3gGw3JDeC7GpIrwDcIyR3gG7yN7/ue7z7/tbvBPWLqGlPXuM2G1lpEJMVco7v6HMkdNPpXK1fQ5OvIBeQcbdOog2Zf2Y0xGGPUQcHutbRBwe9+tUDRnkdSg6I/IaYCJXtmjw1KvooSC6S2rhUapL7S6EFb57AzQOoQ38oYVr9AYyu6rhNgGX60pO2z+1thag9Ibt0VpNQeIkBlVZblAXjmtt8OOlRt234Bn9zuyzUV8FUdj0cDvGpPM7PLoZXNFX5ihx8w/RIFgPbChAAAAABJRU5ErkJggg==">

    <div id="page">`

var pageEnd = `
    </div>
</body>`

var filename;
function start() {
    pageBeginning = pageBeginning.replace(`<title>Litnovel</title>`, `<title>`+novelTitle+`</title>`)

    fileName = chapterUrl.replace(/.*novel\//, "").replace(/\/.*/, "") + ".html";
    
    // Write the beginning of the file
    fs.writeFile(fileName, pageBeginning, function(err) {
        if(err)
            return console.log(err);
    });
    
    getNextChapter();
}

var chapterCount = 1;
var startTime;
function getNextChapter() {
    if (chapterCount == 1)
        startTime = Date.now();
    request({uri: chapterUrl}, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            const {JSDOM} = jsdom;
            var dom = new JSDOM(body);
            var chapterPage = dom.window.document;
            
            try {
                var chapterTitle = chapterPage.querySelector(".panel-default h4").innerHTML;
                var bookReference = chapterTitle.match(/((Book )|(Volume )|(Vol ))\d+/);
                var chapterReference = chapterTitle.match(/Chapter (\d+([\.-]\w+)?)/);
                clearLine();
                if (bookReference && chapterReference) {
                    process.stdout.write("Downloading "+bookReference[0].replace("Vol ","Volume ")+" - "+chapterReference[0]);
                } else if (chapterReference) {
                    process.stdout.write("Downloading "+chapterReference[0].toLowerCase());
                } else if (/\d+([\.-]\w+)?/.test(chapterTitle)) {
                    process.stdout.write("Downloading chapter "+chapterTitle.match(/\d+([\.-]\w+)?/)[0]);
                } else {
                    process.stdout.write("Downloading chapter "+chapterTitle.match(/[^:-]+/)[0]);
                }
                process.stdout.write(" (" + Math.round(chapterCount/chapterAmount*1000)/10 + "% - ");
                process.stdout.write((((Date.now()-startTime)/chapterCount)*(chapterAmount-chapterCount)).format()+" left)");

                chapterUrl = "https://www.wuxiaworld.com"+chapterPage.getElementsByClassName("next")[0].getElementsByTagName("a")[0].href;

                // Remove unnecessary elements
                for (var i=0; chapterPage.getElementsByClassName("chapter-nav").length; i++)
                    chapterPage.getElementsByClassName("chapter-nav")[0].remove();

                var chapterContent = `<div class="chapter" style="display: none">` + chapterPage.querySelector(".panel-default .fr-view").innerHTML + `</div>`

                // Append chapter to file
                fs.appendFile(fileName, chapterContent, function(err) {
                    if(err)
                        return console.log(err);
                    chapterCount++;
                    getNextChapter();
                });
            } catch (err) {
                appendEnd();
            }
        } else if (error.code = "ENOTFOUND")
            appendEnd();
        else
            console.log(error);
    });
}

function appendEnd() {
    fs.appendFile(fileName, pageEnd, function(err) {
        if(err)
            return console.log(err);
        clearLine();
        console.log("Saved to "+fileName);
    });
}

function clearLine() {
    process.stdout.write("\r");
    readline.clearLine(process.stdout);
}

Number.prototype.format = function () {
    var seconds = Math.floor(Math.round(this/1000));
    var hours = Math.floor(seconds / 3600);
    seconds -= hours*3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes*60;

    var result = "";
    if (hours   > 0) {result += hours + "h ";}
    if (minutes > 0 || hours > 0) {result += minutes + "min ";}
    result += seconds + "s";
    return result;
}