'use strict'
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=0e8a6538b291d291d144eeb9f1a49801', true);
xhr.send();
function enter() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let usersArr = JSON.parse(xhr.responseText)
        let flag1 = true
        for (let i in usersArr) {
            if (usersArr[i].login == login.value && usersArr[i].password != password.value) {
                flag1 = false
                alert("Неверный пароль")
                break
            }
            if (usersArr[i].login == login.value && usersArr[i].password == password.value) {
                flag1 = false
                localStorage.setItem('status', usersArr[i].status)
                localStorage.setItem('enterSeabattle', 1)
                localStorage.setItem('login', login.value)
                localStorage.setItem('nickname', usersArr[i].nickname)
                alert("Вы успешно вошли в аккаунт")
                window.location.href = 'index3.html';
                break
            }
        }
        if (flag1 == true) {
            alert("Такого аккаунта не существует")
        }
    }
}
function register() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let usersArr = JSON.parse(xhr.responseText)
        let user = {
            nickname: '',
            login: '',
            password: '',
            status: 'user'
        }
        if (nickname.value == "" || login.value == "" || password.value == "") {
            alert("Все поля должны быть заполнены")
        } else {
            let flag1 = true
            for (let i in usersArr) {
                if (usersArr[i].login == login.value) {
                    flag1 = false
                    alert("Данный логин уже занят")
                    break
                }
            }
            if (flag1 == true) {
                user.nickname = nickname.value
                user.login = login.value
                user.password = password.value
                nickname.value = ""
                login.value = ""
                password.value = ""
                usersArr.push(user)
                let xhrSender = new XMLHttpRequest();
                xhrSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=0e8a6538b291d291d144eeb9f1a49801', true)
                xhrSender.setRequestHeader("Content-type", "application/json");
                xhrSender.send(JSON.stringify(usersArr));
                xhrSender.addEventListener('readystatechange', function () {
                    if (xhrSender.readyState == 4) {
                        if (xhrSender.status == 200) {
                            alert('Пользователь успешно зарегестрирован!');
                        } else {
                            alert('Ошибка отправки. Попробуйте еще раз.');
                        }
                    }
                })
            }
        }
    }
}
if (localStorage.getItem("enterSeabattle") == 0 && (document.title == "Rules" || document.title == "Fields")) {
    window.location.href = 'index.html';
}
if (localStorage.getItem('enterSeabattle') == 1 && document.title == "Registration") {
    window.location.href = 'index3.html';
}
if (localStorage.getItem('enterGame') == 1 && document.title != "Game") {
    window.location.href = 'index7.html';
}

if (localStorage.getItem('enterSeabattle') == 1 && (document.title == "Fields" || document.title == "Rules")) {
    let templateCode = `
        <ul>
            <a href="index3.html">Поля</a>
            <a href="index4.html">Правила</a>
            <button class="exitButton" id="exitButton">Выйти</button>
        </ul>
    `
    let template = Handlebars.compile(templateCode);
    let head = document.querySelector('#header');
    head.innerHTML = '';
    head.innerHTML = template()
    exitButton.addEventListener('click', function () {
        localStorage.setItem('enterSeabattle', 0)
        window.location.href = 'index2.html';
    })
}

if (document.title == "Registration") {
    registrationButton.addEventListener('click', function () {
        register()
    })
    document.addEventListener('keydown', function (e) {
        if (e.key == "Enter") {
            register()
        }
    })
}
if (document.title == "Enter") {
    enterButton.addEventListener('click', function () {
        enter()
    })
    document.addEventListener('keydown', function (e) {
        if (e.key == "Enter") {
            enter()
        }
    })
}
let fields = new XMLHttpRequest();
fields.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=0b2fe229595998e2de7c3c69440e5647', true);
fields.send();
if (document.title == "Fields") {
    fields.addEventListener('readystatechange', function () {
        if (fields.readyState == 4 && fields.status == 200) {
            let fieldsArr = JSON.parse(fields.responseText)
            let templateCode = `
                <div onclick="window.location.href='index5.html';" style="cursor: pointer;" class="fieldListElement">Название поля: {{fieldName}}</div>
            `
            let template = Handlebars.compile(templateCode);
            let fieldul = document.querySelector('#fieldsUl');
            fieldul.innerHTML = '';
            for (let field of fieldsArr) {
                fieldul.innerHTML += template(field)
            }
        }
    })
    CreateField.addEventListener('click', function () {
        window.location.href = "index6.html"
    })
}
if (document.title == "Create") {
    create.addEventListener('click', function () {
        if (fieldCreateName.value == "") {
            alert("Заполните поле")
        } else {
            let fieldsArr = JSON.parse(fields.responseText)
            let field = {
                fieldName: ''
            }
            field.fieldName = fieldCreateName.value
            fieldsArr.push(field)
            let fieldsSender = new XMLHttpRequest();
            fieldsSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=0b2fe229595998e2de7c3c69440e5647', true);
            fieldsSender.setRequestHeader("Content-type", "application/json");
            fieldsSender.send(JSON.stringify(fieldsArr));
            fieldsSender.addEventListener('readystatechange', function () {
                if (fieldsSender.readyState == 4) {
                    if (fieldsSender.status == 200) {
                        alert('Поле успешно зарегестрировано!');
                        window.location.href = "index3.html"
                    } else {
                        alert('Ошибка отправки. Попробуйте еще раз.');
                    }
                }
            })
        }

    })
    exitCreate.addEventListener('click', function () {
        window.location.href = "index3.html"
    })
}

if (document.title == "Gamefield") {
    startGameButton.addEventListener('click', function () {
        localStorage.setItem('enterGame', 1)
        window.location.href = "index7.html"

    })
    let templateCode = `
        <button class="exitGameButton" id="exitGameButton">Выйти</button>
    `
    let template = Handlebars.compile(templateCode);
    let head = document.querySelector('#header');
    head.innerHTML = '';
    head.innerHTML = template()
    exitGameButton.addEventListener('click', function () {
        window.location.href = 'index3.html';
    })
}
let ready = new XMLHttpRequest();
ready.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=77b9447533d064e056a4996a3459df8c', true);
ready.send();
if (document.title == "Game") {
    loseButton.addEventListener('click', function () {
        localStorage.setItem('enterGame', 0)
        window.location.href = 'index3.html';
    })
    document.addEventListener('click', function (e) {
        if (e.target.id.slice(0, 9) == "fieldPart") {
            e.target.classList.toggle('fieldElement2')
        }
    })
    readyButton.addEventListener('click', function () {
        let gameFlag=false
        let a=chekBoats(gameFlag)
        
        if (a==true) {
            let readyArr = JSON.parse(ready.responseText)
            let newReady = {
                ready: '',
                login: ''
            }
            newReady.ready = 1
            newReady.login = localStorage.getItem('login')
            readyArr.push(newReady)
            let readySender = new XMLHttpRequest();
            readySender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=77b9447533d064e056a4996a3459df8c', true);
            readySender.setRequestHeader("Content-type", "application/json");
            readySender.send(JSON.stringify(readyArr));
            readySender.addEventListener('readystatechange', function () {
                if (readySender.readyState == 4) {
                    if (readySender.status == 200) {
                        readyButton.style.visibility = 'hidden'
                        alert('Ожидайте соперника');
                    } else {
                        alert('Ошибка. Попробуйте еще раз.');
                    }
                }
            })
        } else{
            alert('Ошибка в расстановке кораблей')
        }


    })
}
let game = new XMLHttpRequest();
game.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=77b9447533d064e056a4996a3459df8c', true);
game.send();
function chekBoats(gameFlag) {
    let boatsArr = []
    let chekedArr = []
    let nearFlag = true
    let nearby=true
    let onefieldboat = 0
    let twofieldboat = 0
    let treefieldboat = 0
    let fourfieldboat = 0
    let sum = 0
    let arr = document.getElementsByClassName('fieldElement1')
    for (let i = 0; i < 10; i++) {
        boatsArr[i] = {};
    }
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (arr[i * 10 + j].classList.value.length > 20) {
                boatsArr[i][j] = 1;
                sum += 1;
            } else {
                boatsArr[i][j] = 0;
            }
        }
    }
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if ((boatsArr[i][j] == 1) && (chekedArr.includes(i * 10 + j) == false)) {
                if (i < 9) {
                    if (boatsArr[i + 1][j] == 1 && chekedArr.includes((i + 1) * 10 + j) == false && i < 8) {
                        if (boatsArr[i + 2][j] == 1 && chekedArr.includes((i + 2) * 10 + j) == false && i < 7) {
                            if (boatsArr[i + 3][j] == 1 && chekedArr.includes((i + 3) * 10 + j) == false) {
                                if (i < 6 && boatsArr[i + 4][j] == 1 && chekedArr.includes((i + 4) * 10 + j) == false) {
                                    nearFlag = false
                                } else {
                                    fourfieldboat += 1
                                    chekedArr[chekedArr.length] = i * 10 + j
                                    chekedArr[chekedArr.length] = (i + 1) * 10 + j
                                    chekedArr[chekedArr.length] = (i + 2) * 10 + j
                                    chekedArr[chekedArr.length] = (i + 3) * 10 + j
                                }
                            } else {
                                treefieldboat += 1
                                chekedArr[chekedArr.length] = i * 10 + j
                                chekedArr[chekedArr.length] = (i + 1) * 10 + j
                                chekedArr[chekedArr.length] = (i + 2) * 10 + j
                            }
                        } else if (boatsArr[i + 2][j] == 1 && chekedArr.includes((i + 1) * 10 + j) == false && i == 7) {
                            treefieldboat += 1
                            chekedArr[chekedArr.length] = i * 10 + j
                            chekedArr[chekedArr.length] = (i + 1) * 10 + j
                            chekedArr[chekedArr.length] = (i + 2) * 10 + j
                        } else {
                            twofieldboat += 1
                            chekedArr[chekedArr.length] = i * 10 + j
                            chekedArr[chekedArr.length] = (i + 1) * 10 + j
                        }
                    } else if (boatsArr[i + 1][j] == 1 && chekedArr.includes((i + 1) * 10 + j) == false && i == 8) {
                        twofieldboat += 1
                        chekedArr[chekedArr.length] = i * 10 + j
                        chekedArr[chekedArr.length] = (i + 1) * 10 + j
                    } else if (chekedArr.includes(i * 10 + j) == false && j == 9) {
                        onefieldboat += 1
                        chekedArr[chekedArr.length] = i * 10 + j
                    }
                }
                if (j < 9) {
                    if (boatsArr[i][j + 1] == 1 && chekedArr.includes(i * 10 + j + 1) == false && (j < 8)) {
                        if (boatsArr[i][j + 2] == 1 && chekedArr.includes(i * 10 + j + 2) == false && (j < 7)) {
                            if (boatsArr[i][j + 3] == 1 && chekedArr.includes(i * 10 + j + 3) == false) {
                                if (j < 6 && boatsArr[i][j + 4] == 1 && chekedArr.includes(i * 10 + j + 4) == false) {
                                    nearFlag = false
                                } else {
                                    fourfieldboat += 1
                                    chekedArr[chekedArr.length] = i * 10 + j
                                    chekedArr[chekedArr.length] = i * 10 + j + 1
                                    chekedArr[chekedArr.length] = i * 10 + j + 2
                                    chekedArr[chekedArr.length] = i * 10 + j + 3
                                }
                            } else {
                                treefieldboat += 1
                                chekedArr[chekedArr.length] = i * 10 + j
                                chekedArr[chekedArr.length] = i * 10 + j + 1
                                chekedArr[chekedArr.length] = i * 10 + j + 2
                            }
                        } else if (boatsArr[i][j + 2] == 1 && chekedArr.includes(i * 10 + j + 1) == false && j == 7) {
                            treefieldboat += 1
                            chekedArr[chekedArr.length] = i * 10 + j
                            chekedArr[chekedArr.length] = i * 10 + j + 1
                            chekedArr[chekedArr.length] = i * 10 + j + 2
                        } else {
                            twofieldboat += 1
                            chekedArr[chekedArr.length] = i * 10 + j
                            chekedArr[chekedArr.length] = i * 10 + j + 1
                        }
                    } else if (boatsArr[i][j + 1] == 1 && chekedArr.includes(i * 10 + j + 1) == false && j == 8) {
                        twofieldboat += 1
                        chekedArr[chekedArr.length] = i * 10 + j
                        chekedArr[chekedArr.length] = i * 10 + j + 1
                    } else if (chekedArr.includes(i * 10 + j) == false) {
                        onefieldboat += 1
                        chekedArr[chekedArr.length] = i * 10 + j
                    }
                }
                if (i == 9 && j == 9 && chekedArr.includes(99) == false) {
                    onefieldboat += 1
                    chekedArr[chekedArr.length] = i * 10 + j
                }

            }

        }
    }
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (chekedArr.includes(i * 10 + j)) {
                if (chekedArr.includes((i + 1) * 10 + j)) {
                    if (chekedArr.includes((i + 2) * 10 + j)) {
                        if (chekedArr.includes((i + 3) * 10 + j)) {
                            if (chekedArr.includes(i * 10 + j + 1) || chekedArr.includes(i * 10 + j - 1)) {
                                nearby=false
                            }
                            if (chekedArr.includes((i+1) * 10 + j + 1) || chekedArr.includes((i+1) * 10 + j - 1)) {
                                nearby=false
                            }
                            if (chekedArr.includes((i+2) * 10 + j + 1) || chekedArr.includes((i+2) * 10 + j - 1)) {
                                nearby=false
                            }
                            if (chekedArr.includes((i+3) * 10 + j + 1) || chekedArr.includes((i+3) * 10 + j - 1)) {
                                nearby=false
                            }
                        }
                        if (chekedArr.includes(i * 10 + j + 1) || chekedArr.includes(i * 10 + j - 1)) {
                            nearby=false
                        }
                        if (chekedArr.includes((i+1) * 10 + j + 1) || chekedArr.includes((i+1) * 10 + j - 1)) {
                            nearby=false
                        }
                        if (chekedArr.includes((i+2) * 10 + j + 1) || chekedArr.includes((i+2) * 10 + j - 1)) {
                            nearby=false
                        }
                    }
                    if (chekedArr.includes(i * 10 + j + 1) || chekedArr.includes(i * 10 + j - 1)) {
                        nearby=false
                    }
                    if (chekedArr.includes((i+1) * 10 + j + 1) || chekedArr.includes((i+1) * 10 + j - 1)) {
                        nearby=false
                    }
                }
                if (chekedArr.includes(i * 10 + j+1)) {
                    if (chekedArr.includes(i * 10 + j+2)) {
                        if (chekedArr.includes(i * 10 + j+3)) {
                            if (chekedArr.includes((i+1) * 10 + j) || chekedArr.includes((i-1) * 10 + j)) {
                                nearby=false
                            }
                            if (chekedArr.includes((i+1) * 10 + j + 1) || chekedArr.includes((i-1) * 10 + j + 1)) {
                                nearby=false
                            }
                            if (chekedArr.includes((i+1) * 10 + j + 2) || chekedArr.includes((i-1) * 10 + j + 2)) {
                                nearby=false
                            }
                            if (chekedArr.includes((i+1) * 10 + j + 3) || chekedArr.includes((i-1) * 10 + j + 3)) {
                                nearby=false
                            }
                        }
                        if (chekedArr.includes((i+1) * 10 + j) || chekedArr.includes((i-1) * 10 + j)) {
                            nearby=false
                        }
                        if (chekedArr.includes((i+1) * 10 + j + 1) || chekedArr.includes((i-1) * 10 + j + 1)) {
                            nearby=false
                        }
                        if (chekedArr.includes((i+1) * 10 + j + 2) || chekedArr.includes((i-1) * 10 + j + 2)) {
                            nearby=false
                        }
                    }
                    if (chekedArr.includes((i+1) * 10 + j) || chekedArr.includes((i-1) * 10 + j)) {
                        nearby=false
                    }
                    if (chekedArr.includes((i+1) * 10 + j + 1) || chekedArr.includes((i-1) * 10 + j + 1)) {
                        nearby=false
                    }
                }
                if(chekedArr.includes((i + 1) * 10 + j+1)||chekedArr.includes((i + 1) * 10 + j-1)){
                    nearby=false
                }

            }

        }
    }
    
    if(sum==20){
        if(onefieldboat==4){
            if(twofieldboat==3){
                if(treefieldboat==2){
                    if(fourfieldboat==1){
                        if(nearFlag==true){
                            if(nearby==true){
                                onefieldboat=0
                                return true
                            }
                        }
                    }
                }
            }
        }
    }
    return false
}
