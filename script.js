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
    localStorage.setItem('correct', 0)
    localStorage.setItem('startClicked', 0)
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
fields.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=dcba7a013bbe1c3adce4d43c8e87df22', true);
fields.send();
if (document.title == "Fields") {
    randomButton.addEventListener('click', function () {
        localStorage.setItem('randomeGame', 1)
    })
    document.addEventListener('click', function (e) {
        localStorage.setItem('fieldName', e.target.id)
    })
    fields.addEventListener('readystatechange', function () {
        if (fields.readyState == 4 && fields.status == 200) {
            let flag = true
            let fieldsArr = JSON.parse(fields.responseText)
            let templateCode = `
                <div onclick="window.location.href='index5.html';" style="cursor: pointer;" class="fieldListElement" id={{creator}}{{count}}>Название поля: {{fieldName}}</div>
            `
            let templateCode2 = `<button id="deleteField" class="CreateField">Удалить поле</button>`
            let template = Handlebars.compile(templateCode);
            let template2 = Handlebars.compile(templateCode2);
            let fieldul2 = document.querySelector('#buttons');
            let fieldul = document.querySelector('#fieldsUl');
            fieldul.innerHTML = '';
            if (localStorage.getItem('status') == 'admin') {
                fieldul2.innerHTML += template2()
                deleteField.addEventListener('click', function () {
                    flag = false
                    let templateCode3 = `
                        <div style="cursor: pointer;" class="fieldListElement" id={{creator}}{{count}}>Название поля: {{fieldName}}</div>
                    `
                    let templateCode4 = `<button id="cancelDeleteField" class="CreateField">Отмена</button>`
                    let template3 = Handlebars.compile(templateCode3);
                    let template4 = Handlebars.compile(templateCode4);
                    let fieldul4 = document.querySelector('#buttons');
                    let fieldul3 = document.querySelector('#fieldsUl');
                    fieldul.innerHTML = '';
                    fieldul2.innerHTML += template4()
                    for (let fiel of fieldsArr) {
                        fieldul3.innerHTML += template3(fiel)
                    }
                    fieldul3.addEventListener('click', function (e) {
                        for (let i = 0; i < fieldsArr.length; i++) {
                            if (e.target.id == fieldsArr[i].creator + fieldsArr[i].count) {
                                fieldsArr.splice(i, 1)
                                let fieldsSender = new XMLHttpRequest();
                                fieldsSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=dcba7a013bbe1c3adce4d43c8e87df22', true);
                                fieldsSender.setRequestHeader("Content-type", "application/json");
                                fieldsSender.send(JSON.stringify(fieldsArr));
                                fieldsSender.addEventListener('readystatechange', function () {
                                    if (fieldsSender.readyState == 4) {
                                        if (fieldsSender.status == 200) {
                                            alert('Поле успешно удалено!');
                                            fieldul.innerHTML = '';
                                            for (let fiel of fieldsArr) {
                                                fieldul3.innerHTML += template3(fiel)
                                            }
                                        } else {
                                            alert('Ошибка удаления. Попробуйте еще раз.');
                                        }
                                    }
                                })
                            }
                        }
                    })
                    cancelDeleteField.addEventListener('click', function () {
                        flag = true
                        let templateCode = `
                            <div onclick="window.location.href='index5.html';" style="cursor: pointer;" class="fieldListElement" id={{creator}}{{count}}>Название поля: {{fieldName}}</div>
                        `
                        let templateCode2 = `<button id="deleteField" class="CreateField">Удалить поле</button>`
                        let template = Handlebars.compile(templateCode);
                        let template2 = Handlebars.compile(templateCode2);
                        let fieldul2 = document.querySelector('#buttons');
                        let fieldul = document.querySelector('#fieldsUl');
                        fieldul.innerHTML = '';
                        fieldul2.innerHTML = '';
                        fieldul2.innerHTML += template2()
                        for (let field of fieldsArr) {
                            fieldul.innerHTML += template(field)
                        }
                    })
                })
            }
            if (flag == true) {
                for (let field of fieldsArr) {
                    fieldul.innerHTML += template(field)
                }
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
        } else if (fieldCreateName.value.length > 40) {
            alert('Слишком длинное имя.')
        } else {
            let fieldsArr = JSON.parse(fields.responseText)
            let field = {
                fieldName: '',
                creator: '',
                login: '',
                loginsecond: '',
                players: '0',
                count: ''
            }
            field.creator = localStorage.getItem('login')
            field.fieldName = fieldCreateName.value
            field.count = fieldsArr.length + 1
            fieldsArr.push(field)
            let fieldsSender = new XMLHttpRequest();
            fieldsSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=dcba7a013bbe1c3adce4d43c8e87df22', true);
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
        localStorage.setItem('correct', 0)
        localStorage.setItem('startClicked', 0)
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
let game = new XMLHttpRequest();
game.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=027611a0e220b081bf68b3353b611a42', true);
game.send();
if (document.title == "Game") {
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
        localStorage.setItem('correct', 0)
        localStorage.setItem('startClicked', 0)
    }
    loseButton.addEventListener('click', function () {
        let fieldsArr = JSON.parse(fields.responseText)
        localStorage.setItem('enterGame', 0)
        localStorage.setItem('correct', 0)
        localStorage.setItem('startClicked', 0)
        window.location.href = 'index3.html';
    })
    document.addEventListener('click', function (e) {
        if (e.target.id.slice(0, 9) == "fieldPart") {
            if (localStorage.getItem('correct') == 0) {
                e.target.classList.toggle('fieldElement2')
            }
        }
    })
    readyButton.addEventListener('click', function () {
        let boatsArr = {}
        let chekedArr = []
        let nearFlag = true
        let nearby = true
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
        boatsArr[10] = localStorage.getItem('login')
        boatsArr[11] = true

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
                    if (chekedArr.includes((i + 1) * 10 + j) && j != 0 && j != 9) {
                        if (chekedArr.includes((i + 2) * 10 + j)) {
                            if (chekedArr.includes((i + 3) * 10 + j)) {
                                if (chekedArr.includes(i * 10 + j + 1) || chekedArr.includes(i * 10 + j - 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 1) * 10 + j + 1) || chekedArr.includes((i + 1) * 10 + j - 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 2) * 10 + j + 1) || chekedArr.includes((i + 2) * 10 + j - 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 3) * 10 + j + 1) || chekedArr.includes((i + 3) * 10 + j - 1)) {
                                    nearby = false
                                }
                            }
                            if (chekedArr.includes(i * 10 + j + 1) || chekedArr.includes(i * 10 + j - 1)) {
                                nearby = false
                            }
                            if (chekedArr.includes((i + 1) * 10 + j + 1) || chekedArr.includes((i + 1) * 10 + j - 1)) {
                                nearby = false
                            }
                            if (chekedArr.includes((i + 2) * 10 + j + 1) || chekedArr.includes((i + 2) * 10 + j - 1)) {
                                nearby = false
                            }
                        }
                        if (chekedArr.includes(i * 10 + j + 1) || chekedArr.includes(i * 10 + j - 1)) {
                            nearby = false
                        }
                        if (chekedArr.includes((i + 1) * 10 + j + 1) || chekedArr.includes((i + 1) * 10 + j - 1)) {
                            nearby = false
                        }
                    }
                    if (chekedArr.includes((i + 1) * 10) && j == 0) {
                        if (chekedArr.includes((i + 2) * 10)) {
                            if (chekedArr.includes((i + 3) * 10)) {
                                if (chekedArr.includes(i * 10 + 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 1) * 10 + 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 2) * 10 + 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 3) * 10 + 1)) {
                                    nearby = false
                                }
                            }
                            if (chekedArr.includes(i * 10 + 1)) {
                                nearby = false
                            }
                            if (chekedArr.includes((i + 1) * 10 + 1)) {
                                nearby = false
                            }
                            if (chekedArr.includes((i + 2) * 10 + 1)) {
                                nearby = false
                            }
                        }
                        if (chekedArr.includes(i * 10 + 1)) {
                            nearby = false
                        }
                        if (chekedArr.includes((i + 1) * 10 + 1)) {
                            nearby = false
                        }
                    }

                    if (chekedArr.includes((i + 1) * 10 + j) && j == 9) {
                        if (chekedArr.includes((i + 2) * 10 + j)) {
                            if (chekedArr.includes((i + 3) * 10 + j)) {
                                if (chekedArr.includes(i * 10 + j + 1) || chekedArr.includes(i * 10 + j - 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 1) * 10 + j - 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 2) * 10 + j - 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 3) * 10 + j - 1)) {
                                    nearby = false
                                }
                            }
                            if (chekedArr.includes(i * 10 + j - 1)) {
                                nearby = false
                            }
                            if (chekedArr.includes((i + 1) * 10 + j - 1)) {
                                nearby = false
                            }
                            if (chekedArr.includes((i + 2) * 10 + j - 1)) {
                                nearby = false
                            }
                        }
                        if (chekedArr.includes(i * 10 + j - 1)) {
                            nearby = false
                        }
                        if (chekedArr.includes((i + 1) * 10 + j - 1)) {
                            nearby = false
                        }
                    }
                    if (i != 0 && j != 9 && j != 0 && j != 9) {
                        if (chekedArr.includes((i + 1) * 10 + j + 1) || chekedArr.includes((i + 1) * 10 + j - 1)) {
                            nearby = false
                        }
                    }
                }
            }
        }
        if (onefieldboat == 4) {
            if (twofieldboat == 3) {
                if (treefieldboat == 2) {
                    if (fourfieldboat == 1) {
                        if (nearFlag == true) {
                            if (nearby == true) {
                                let gameArr = JSON.parse(game.responseText)
                                let fieldsArr = JSON.parse(fields.responseText)
                                let flagplayers = true
                                let flagsend = false
                                for (let field of fieldsArr) {
                                    if (field.creator + field.count == localStorage.getItem('fieldName') && field.login != localStorage.getItem('login')) {
                                        if (field.players == 0 && flagplayers == true) {
                                            alert('Ожидайте соперника.')
                                            field.login = localStorage.getItem('login')
                                            field.players = 1
                                            flagplayers = false
                                            let a = setInterval(function () {
                                                let fieldcheck = new XMLHttpRequest();
                                                fieldcheck.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=dcba7a013bbe1c3adce4d43c8e87df22', true);
                                                fieldcheck.send();
                                                fieldcheck.addEventListener('readystatechange', function () {
                                                    if (fieldcheck.readyState == 4 && fieldcheck.status == 200) {
                                                        let fieldsArr2 = JSON.parse(fieldcheck.responseText)
                                                        for (let field of fieldsArr2) {
                                                            if (field.creator + field.count == localStorage.getItem('fieldName')) {
                                                                if (field.players == 2) {
                                                                    gameArr.push(boatsArr)
                                                                    let gameSender2 = new XMLHttpRequest();
                                                                    gameSender2.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=027611a0e220b081bf68b3353b611a42', true);
                                                                    gameSender2.setRequestHeader("Content-type", "application/json");
                                                                    gameSender2.send(JSON.stringify(gameArr));
                                                                    gameSender2.addEventListener('readystatechange', function () {
                                                                        if (gameSender2.readyState == 4 && gameSender2.status == 200) {
                                                                            readyButton.style.visibility = 'hidden'
                                                                            localStorage.setItem('correct', 1)
                                                                            localStorage.setItem('startClicked', 1)
                                                                        }
                                                                    })
                                                                    clearInterval(a)
                                                                    alert('противник найден')
                                                                    break
                                                                }
                                                            }
                                                        }
                                                    }
                                                })
                                            }, 2000)

                                        }
                                        if (field.players == 1 && flagplayers == true) {
                                            field.loginsecond = localStorage.getItem('login')
                                            field.players = 2
                                            flagplayers = false
                                            flagsend = true
                                            gameArr.push(boatsArr)
                                            let gameSender = new XMLHttpRequest();
                                            gameSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=027611a0e220b081bf68b3353b611a42', true);
                                            gameSender.setRequestHeader("Content-type", "application/json");
                                            gameSender.send(JSON.stringify(gameArr));
                                            gameSender.addEventListener('readystatechange', function () {
                                                if (gameSender.readyState == 4 && gameSender.status == 200) {
                                                    readyButton.style.visibility = 'hidden'
                                                    localStorage.setItem('correct', 1)
                                                    localStorage.setItem('startClicked', 1)
                                                }
                                            })
                                            alert('противник найден')

                                        }
                                        if (field.players == 2 && flagplayers == true) {
                                            flagplayers = false
                                            alert('поле уже заняли')
                                        }
                                        let fieldsSender = new XMLHttpRequest();
                                        fieldsSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=dcba7a013bbe1c3adce4d43c8e87df22', true);
                                        fieldsSender.setRequestHeader("Content-type", "application/json");
                                        fieldsSender.send(JSON.stringify(fieldsArr));
                                        break
                                    }
                                }

                            } else {
                                alert('Некоторые корабли стоят слишком близко')
                            }
                        } else {
                            alert('Некоторые корабли больше пяти клеток')
                        }
                    } else {
                        alert('Неверное количество четырехпалубных кораблей')
                    }
                } else {
                    alert('Неверное количество трёхпалубных кораблей')
                }
            } else {
                alert('Неверное количество двухпалубных кораблей')
            }
        } else {
            alert('Неверное количество однопалубных кораблей')
        }

    })
}
