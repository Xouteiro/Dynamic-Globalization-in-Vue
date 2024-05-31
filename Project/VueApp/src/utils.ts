import { i18nFunctions } from '@/i18n.js';
import router from './router';

interface CurrentMessages {
    [key: string]: string | any;
}


let popUp_open = false;
let idioms = i18nFunctions.idioms;



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
        console.log(current)
        for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) {
                current[keys[i]] = i === keys.length - 1 ? word : {}
            }
            else {
                current = current[keys[i]];
            }
        }
    }
}

function updateIdioms(key: string, word: string, locale: string, idioms: any, is_News: boolean) {
    console.log('update idioms')
    if (is_News) {
        let keys = key.includes('.') ? key.split('.') : []
        for (let i = 0; i < idioms.length; i++) {
            if (idioms[i].name === locale) {
                let news = idioms[i].News
                if (keys.length === 0) {
                    news[key] = word
                    return
                }
                else {
                    let current = news
                    for (let i = 0; i < keys.length; i++) {
                        if (i === keys.length - 1) {
                            current[keys[i]] = i === keys.length - 1 ? word : {}
                        }
                        else {
                            current = current[keys[i]];
                        }
                    }
                }
            }
        }
    }
    else {
        for (let i = 0; i < idioms.length; i++) {
            if (idioms[i].name === locale) {
                idioms[i].vocabulary[key] = word
                return
            }
        }
    }
}

function changeWord(key: string, word: string, locale: string, currentMessages: CurrentMessages, currentMessages_locale: string, idioms: any, is_News: boolean) {
    let url: string;

    if (word === '' && !is_News) {
        url = 'http://localhost:5037/Idioms/' + locale + '/vocabulary' + '/' + key;



        word = idioms[0].vocabulary[key];

        if (currentMessages_locale === locale || currentMessages_locale === '') {
            console.log('update current messages')
            updateCurrentMessages(key, word, currentMessages);
        }

        if (idioms != null) {
            updateIdioms(key, word, locale, idioms, is_News)
        }

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .catch((error) => {
                console.error('Error:', error.message);
            });


    } else {


        url = 'http://localhost:5037/Idioms/' + locale + '/vocabulary';

        if (is_News) {
            url = 'http://localhost:5037/Idioms/' + locale + '/news';
        }

        if (currentMessages_locale === locale || currentMessages_locale === '') {
            console.log('update current messages')
            updateCurrentMessages(key, word, currentMessages);
        }

        if (idioms != null) {
            updateIdioms(key, word, locale, idioms, is_News)
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
                console.error('Error:', error.message);
            });

    }

}



//Edit button and PopUp

function addEditButton(element: HTMLElement, classes: DOMTokenList, locale: string, currentMessages: CurrentMessages) {
    const editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.classList.add('edit-button');
    editButton.classList.add('tooltiptext')
    editButton.addEventListener('click', () => {
        openPopUp(classes, locale, currentMessages, element);
    });
    element.insertBefore(editButton, element.firstChild);
}

function openPopUp(classes: DOMTokenList, locale: string, currentMessages: CurrentMessages, element: HTMLElement) {
    popUp_open = true;
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '1000';
    document.body.appendChild(overlay);
    const popUp = document.createElement('div');
    popUp.classList.add('pop-up');

    let key: string;

    if (element.lastElementChild?.tagName === 'INPUT' || element.lastElementChild?.tagName === 'TEXTAREA') {
        key = cleanClasses(element.lastElementChild.classList, locale) //key para o placeholder
    } else {
        key = cleanClasses(classes, locale);
    }
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
    showLocale.textContent = locale + ' ' + utils.getFlag(locale);
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


    let newWord: HTMLInputElement | HTMLTextAreaElement;

    let keys = key.includes('.') ? key.split('.') : [];

    let is_News = false;
    let actualWord;
    if (keys.length > 1) {
        newWord = document.createElement('textarea');
        is_News = true;
        actualWord = getCurrentKey(key, locale, currentMessages);
        newWord.value = actualWord
    } else {
        newWord = document.createElement('input');
        actualWord = currentMessages[key];
        newWord.value = actualWord;

    }

    newWord.classList.add('input');


    popUp.appendChild(newWord);


    const saveButton = document.createElement('button');
    saveButton.innerHTML = 'Save';
    saveButton.classList.add('save-button');


    saveButton.addEventListener('click', () => {
        if (newWord.value != actualWord) utils.updateElement(key, newWord.value, locale, currentMessages, is_News, locale, idioms);
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

    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popUp_open === true) {
            popUp_open = false;
            document.getElementById('overlay')?.remove();
            removePopUp(popUp);
        }
    });
    popUp.appendChild(closeButton);

    const link = document.createElement('a');
    link.href = '#';
    link.textContent = 'See in the table';
    link.classList.add('link'); link.addEventListener('click', (event) => {
        event.preventDefault();
        router.push('/table');
        popUp_open = false;
        document.getElementById('overlay')?.remove();
        removePopUp(popUp);

        let time = 10;
        if(i18nFunctions.idioms == null){
            time = 200;
        }

        setTimeout(async () => {
            const selector = 'tr.' + key + '.' + locale;
            const elementToScrollTo = document.querySelector(selector);
            console.log(elementToScrollTo);
            if (elementToScrollTo) {
                elementToScrollTo.classList.add('highlight');
                elementToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center'});
            }
            setTimeout(() => {
                if (elementToScrollTo) elementToScrollTo.classList.remove('highlight');
            }, 2000);
        }, time); 

    });


    popUp.appendChild(link);

    overlay.appendChild(popUp);
}




function removeEditButton(element: HTMLElement) {
    const editButton = element.querySelector('.edit-button');
    if (editButton) {
        element.removeChild(editButton);
    }
}


function removePopUp(popUp: HTMLElement) {
    if (popUp.parentNode === null || popUp === null) {
        return;
    }
    popUp.parentNode!.removeChild(popUp);
}

function cleanClasses(classes: DOMTokenList, locale: string) {
    let classList = Array.from(classes);
    let cleanClassList = classList.filter((item) => {
        return item != "router-link-active" && item != 'router-link-exact-active' && item != locale;
    });
    return cleanClassList[0];
}





let flags = {
    'en': '🇬🇧',
    'es': '🇪🇸',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'it': '🇮🇹',
    'pt': '🇵🇹',
    'nl': '🇳🇱',
    'pl': '🇵🇱',
    'ru': '🇷🇺',
    'tr': '🇹🇷',
    'ja': '🇯🇵',
    'ko': '🇰🇷',
    'zh': '🇨🇳',
    'ar': '🇸🇦',
    'hi': '🇮🇳',
    'id': '🇮🇩',
    'ms': '🇲🇾',
    'th': '🇹🇭',
    'vi': '🇻🇳',
    'bg': '🇧🇬',
    'hr': '🇭🇷',
    'cs': '🇨🇿',
    'da': '🇩🇰',
    'fi': '🇫🇮',
    'el': '🇬🇷',
    'hu': '🇭🇺',
    'ga': '🇮🇪',
    'lv': '🇱🇻',
    'lt': '🇱🇹',
    'ro': '🇷🇴',
    'sk': '🇸🇰',
    'sl': '🇸🇮',
    'sv': '🇸🇪'
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

            const div = document.createElement('div');
            div.classList.add('tooltip');
            element.parentNode!.replaceChild(div, element);
            div.appendChild(element);

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


    updateElement(key_to_change: string, word_to_change: string, locale: string, currentMessages: CurrentMessages, is_News: boolean, currentMessages_locale?: string, idioms?: any, key?: HTMLInputElement) {
        is_News = is_News || false;
        changeWord(key_to_change, word_to_change, locale, currentMessages, currentMessages_locale || '', idioms || {}, is_News);
        if (key) {
            key.value = '';
        }
    },

    getFlag(locale: string) {

        return flags[locale as keyof typeof flags] as string;

    },

    deleteElement(key_to_change: string, locale_: string, currentMessages: any, is_News: boolean, currentMessages_locale?: string, idioms?: any) {

        let url = 'http://localhost:5037/Idioms/' + locale_ + '/vocabulary' + '/' + key_to_change;

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .catch((error) => {
                console.error('Error:', error.message);
            });

    }



}

export default utils;