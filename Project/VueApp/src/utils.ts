
interface CurrentMessages {
    [key: string]: string | any;
}

function getCurrentKey(key: string, locale: string, currentMessages: CurrentMessages) {
    let keys = key.includes('.') ? key.split('.') : []
    let current = currentMessages
    for (let i = 0; i < keys.length; i++) {
        if (i === keys.length - 1) {
            return current[keys[i]]
        }
        else {
            current = current[keys[i]]
        }
    }
}

function updateCurrentMessages(key: string, word: string, currentMessages: CurrentMessages) {
    let keys = key.includes('.') ? key.split('.') : []
    if (keys.length === 0) {
        currentMessages[key] = word
        return
    }
    else {
        let current = currentMessages
        for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) {
                current[keys[i]] = i === keys.length - 1 ? word : {}
            }
            else {
                current = current[keys[i]]
            }
        }
    }
}

function updateIdioms(key: string, word: string, locale: string, idioms: any) {
    for (let i = 0; i < idioms.length; i++) {
        if (idioms[i].name === locale) {
            let vocabulary = idioms[i].vocabulary
            vocabulary[key] = word
        }
    }
}

function changeWord(key: string, word: string, locale: string, currentMessages: CurrentMessages, currentMessages_locale: string, idioms: any) {

    const url = 'http://localhost:5037/Idioms/' + locale + '/vocabulary'; //change to + locale.value when api is ready

    if (currentMessages_locale === locale || currentMessages_locale === '') {
        console.log('update current messages')
        updateCurrentMessages(key, word, currentMessages);
        updateIdioms(key, word, locale, idioms);
        console.log(currentMessages)
    }
    else {
        console.log('update idioms')
        updateIdioms(key, word, locale, idioms);
    }

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            key: key,
            value: word

        }),
    })
        .then(response => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });

}



//Edit button and PopUp

function addEditButton(element: HTMLElement, classes: DOMTokenList, locale: string, currentMessages: CurrentMessages) {
    const editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => {
        openPopUp(classes, locale, currentMessages);
    });
    element.insertBefore(editButton, element.firstChild);
}

function openPopUp(classes: DOMTokenList, locale: string, currentMessages: CurrentMessages) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)'; // semi-transparent
    overlay.style.zIndex = '1000'; // high value to be on top of other elements
    document.body.appendChild(overlay);
    const popUp = document.createElement('div');
    popUp.classList.add('pop-up');

    let key = cleanClasses(classes, locale);

    let popUpTitle = document.createElement('h2');
    popUpTitle.textContent = 'Edit word';
    popUpTitle.classList.add('pop-up-title');
    popUp.appendChild(popUpTitle);


    let popUpContent = document.createElement('div');
    popUpContent.classList.add('pop-up-content');

    let showLocaleContainer = document.createElement('div');
    showLocaleContainer.style.display = 'flex';
    showLocaleContainer.style.flexDirection = 'row';
    showLocaleContainer.style.marginTop = '20px';
    showLocaleContainer.style.marginBottom = '10px';

    let showLocaleTitle = document.createElement('p');
    showLocaleTitle.style.color = 'black';
    showLocaleTitle.style.fontWeight = 'bold';
    showLocaleTitle.style.marginRight = '10px';
    showLocaleTitle.textContent = 'Idiom : ';
    showLocaleTitle.style.fontSize = '21px';



    let showLocale = document.createElement('p');
    showLocale.style.color = 'black';
    showLocale.textContent = locale;
    showLocale.style.fontSize = '21px';

    showLocaleContainer.appendChild(showLocaleTitle);
    showLocaleContainer.appendChild(showLocale);
    popUpContent.appendChild(showLocaleContainer);


    let showKeyContainer = document.createElement('div');
    showKeyContainer.style.display = 'flex';
    showKeyContainer.style.flexDirection = 'row';
    showKeyContainer.style.marginTop = '10px';
    showKeyContainer.style.marginBottom = '10px';

    let showKeyTitle = document.createElement('p');
    showKeyTitle.style.color = 'black';
    showKeyTitle.style.fontWeight = 'bold';
    showKeyTitle.style.marginRight = '10px';
    showKeyTitle.style.fontSize = '21px';
    showKeyTitle.textContent = 'Identifier : ';

    let showKey = document.createElement('p');
    showKey.style.color = 'black';
    showKey.textContent = key;
    showKey.style.fontSize = '21px';
    showKeyContainer.appendChild(showKeyTitle);
    showKeyContainer.appendChild(showKey);
    popUpContent.appendChild(showKeyContainer);

    popUp.appendChild(popUpContent);


    let word = document.createElement('p');
    word.textContent = 'Change to : ';
    word.style.color = 'black';
    word.style.fontWeight = 'bold';
    word.style.fontSize = '21px';
    word.style.alignSelf = 'flex-start';
    word.style.marginLeft = '45px';
    word.style.marginBottom = '5px';
    popUp.appendChild(word);


    let newWord : HTMLInputElement | HTMLTextAreaElement;
    let keys = key.includes('.') ? key.split('.') : [];

    if (keys.length > 1) {
        newWord = document.createElement('textarea');
        newWord.value = getCurrentKey(key, locale, currentMessages);
    } else {
        newWord = document.createElement('input');
        newWord.value = currentMessages[key];
    }

    newWord.classList.add('input');


    popUp.appendChild(newWord);

    const saveButton = document.createElement('button');
    saveButton.innerHTML = 'Save';
    saveButton.classList.add('save-button');


    saveButton.addEventListener('click', () => {
        utils.updateElement(key, newWord.value, locale, currentMessages);
        removePopUp(popUp);
        document.body.removeChild(overlay);
    });
    popUp.appendChild(saveButton);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&#10006';
    closeButton.classList.add('close-button');

    closeButton.addEventListener('click', () => {
        removePopUp(popUp);
        document.body.removeChild(overlay);
    });
    popUp.appendChild(closeButton);

    overlay.appendChild(popUp);

}


function removeEditButton(element: HTMLElement) {
    const editButton = element.querySelector('.edit-button');
    if (editButton) {
        element.removeChild(editButton);
    }
}


function removePopUp(popUp: HTMLElement) {
    popUp.parentNode!.removeChild(popUp);
}

function cleanClasses(classes: DOMTokenList, locale: string) {
    let classList = Array.from(classes);
    let cleanClassList = classList.filter((item) => {
        return item != "router-link-active" && item != 'router-link-exact-active' && item != locale;
    });
    return cleanClassList[0];
}




function mouseOverHandler(newDiv: HTMLElement, element: Element, locale: string, currentMessages: CurrentMessages) {
    if (!newDiv.querySelector('.edit-button')) {
        addEditButton(newDiv, element.classList, locale, currentMessages);
    }
}


function mouseLeaveHandler(newDiv: HTMLElement) {
    removeEditButton(newDiv);
}



var utils = {
    handlers: new Map(),


    removeEventListeners() {
        this.handlers.forEach((handlers, element) => {
            element.removeEventListener('mouseover', handlers.mouseOverHandler);
            element.parentElement!.removeEventListener('mouseleave', handlers.mouseLeaveHandler);
        });
        const elements = document.querySelectorAll('.edit-button');
        elements.forEach((element) => {
            element.parentElement?.removeChild(element);
        });
    },


    populateEditableElements(locale: string, currentMessages: CurrentMessages) {
        const elements = document.querySelectorAll('.' + locale);
        elements.forEach((element) => {

            // Define the event handlers
            const mouseOverHandler = (e: Event) => {
                if (!element.parentElement!.querySelector('.edit-button')) {
                    addEditButton(element.parentElement!, element.classList, locale, currentMessages);
                }
            };
            const mouseLeaveHandler = (e: Event) => {
                removeEditButton(element.parentElement!);
            };

            // If there are existing handlers, remove them
            if (this.handlers.has(element)) {
                const oldHandlers = this.handlers.get(element);
                element.removeEventListener('mouseover', oldHandlers.mouseOverHandler);
                element.parentElement!.removeEventListener('mouseleave', oldHandlers.mouseLeaveHandler);
            }

            // Add the event listeners
            element.addEventListener('mouseover', mouseOverHandler);
            element.parentElement!.addEventListener('mouseleave', mouseLeaveHandler);

            // Store the handlers
            this.handlers.set(element, { mouseOverHandler, mouseLeaveHandler });
        });
    },

    updateElement(key_to_change: string, word_to_change: string, locale: string, currentMessages: CurrentMessages, currentMessages_locale?: string, idioms?: any, key?: HTMLInputElement) {
        changeWord(key_to_change, word_to_change, locale, currentMessages, currentMessages_locale || '', idioms || {});
        if (key) {
            key.value = '';
        }
    }



}

export default utils;