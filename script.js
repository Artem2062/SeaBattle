'use strict'
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=0e8a6538b291d291d144eeb9f1a49801', true);
xhr.send();
let flag2 = false
if (localStorage.getItem('enterSeabattle') == 1) {
    if (localStorage.getItem('autoHrefEnabled') == 1) {
        window.location.href = 'index3.html';
        localStorage.setItem('autoHrefEnabled', 0)
    }
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
        flag2 = true
        localStorage.setItem('enterSeabattle', 0)
        localStorage.setItem('autoHrefEnabled', 1)
        window.location.href = 'index2.html';
    })
}
if (document.title == "Registration") {
    registrationButton.addEventListener('click', function () {
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
    })
}
if (document.title == "Enter") {
    enterButton.addEventListener('click', function () {
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
                    localStorage.setItem('enterSeabattle', 1)
                    alert("Вы успешно вошли в аккаунт")
                    location.reload()
                    break
                }
            }
            if (flag1 == true) {
                alert("Такого аккаунта не существует")
            }
        }
    })
}