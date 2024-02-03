//вывести всех юзеров из базы в таблицу

const tbody=document.querySelector("#tableBody");                                //возвращает все элементы
const tableOfUsers=document.querySelector("#tableAllUsers");
let str="";
$(document).ready(async function() {                                                 // запускает код, когда ДОМ становится безопасной для работв, эта функция возвращает промис
    let users=await fetch("http://localhost:8080/api/users").then(r =>r.json());             // заставит ждать до тех пор, пока промис не выполнится
    const template = document.querySelector('#product');
    users.forEach((u) => {
        let rol = "";
        u.roles.forEach((u) => {
            rol+= u.withoutPrefix + "  ";
        });
        str += `<tr id="dele${u.id}"><td>${u.id}</td> 
<td>${u.name}</td>
<td>${u.age}</td>
<td>${u.email}</td>
<td style="display:none;">${u.password}</td>
 <td>${rol}</td>
<td><button class="btn btn-info editbtn" >Edit</button></td>
<td><button class="btn btn-danger delbtn">Delete</button></td></tr>`;
    })
    tbody.innerHTML = str;                                             // содержимое html в виде строки
})


//загрузить список ролей
$(document).ready(async function () {
    let rolles = await fetch("http://localhost:8080/api/roles").then(r => r.json());         //настройки для fetch можно указать после url
    let rol = "";
    rolles.forEach((r) => rol += `<option value="${r.role}">${r.withoutPrefix}</option>`);
    let sel = `<select name="sele" onchange="console.log($('#select').val())" id="select"  
multiple class="form-control sel" size="2">
${rol}
</select>`;
    document.getElementById('selector').innerHTML = sel;      // получение по id
})

//для  изменения ролей

async function rol(userRol) {
    console.log(userRol);
    let rolles = await fetch("http://localhost:8080/api/roles").then(r => r.json());
    let rol = "";
    for (let n = 0; n < rolles.length; n++) {
        rol += `<option value="${rolles[n].role}">${rolles[n].withoutPrefix}</option>`;
    }
    let sel = `<select name="sele" onchange="console.log($('#selectEdit').val())" id="selectEdit"  
multiple class="form-control sel" size="2">
${rol}
</select>`;
    document.getElementById('selectorEdit').innerHTML = sel;
}


// доступ на нужную страницу по роли принципала
$(document).ready(async function () {
    let principal = await fetch("http://localhost:8080/api/info").then(r => r.json());
    for (let i = 0; i < principal.roles.length; i++) {
        if (principal.roles[i].role === 'ROLE_ADMIN') {
            return;
        }
    }
    $('#userpanel').hide();
    lookTablePrincipal();
})



//страница юзера по боковой ссылке, вставится в admin-page.html по ссылке
async function lookTablePrincipal() {
    let princ = await fetch("http://localhost:8080/api/info").then(r => r.json());
    $('#centralTable').hide();
    let rol = "";
    princ.roles.forEach((u) => {
        rol += u.withoutPrefix + "  \n";
    });
    let strPr = `<tr><td>${princ.id}</td>
<td>${princ.name}</td>
<td>${princ.age}</td>
<td>${princ.email}</td>
<td>${rol}</td></tr>`;
    let tab = `
<div class="col-11 bg-light vh-150 p-4">
<h1>User information-page</h1> 
<div class=" show active border" id="user_panel" role="tabpanel" aria-labelledby="home-tab">
<td class="bg-white"></td>
<h4 class="px-5">About User</h4>
<table class="table table-striped ">
<thead>
<th>ID</th>
<th>Username</th>
<th>Age</th>
<th>Email</th>
<th>Roles</th>
</thead>         
<tbody id="tbodyPrincip">${strPr}</tbody>
</table>
</div>
</div>`
    document.getElementById('us_tab').innerHTML = tab;
}


//показать моего Principal
$('.action').on('click', async function () {
    lookTablePrincipal();
});
$(document).ready(async function () {
    let principal = await fetch("http://localhost:8080/api/info").then(r => r.json());
    let rol = "";
    principal.roles.forEach((r) => {
        rol += r.withoutPrefix + "  "
    });
    document.getElementById('black').innerHTML = `<b>${principal.email}</b>` + ' with roles: ' + `<b>${rol}</b>`;
})


// создание нового юзера
const usernameCreate = document.getElementById('usernameCreate');
const ageCreate = document.getElementById('ageCreate');
const emailCreate = document.getElementById('emailCreate');
const passwordCreate = document.getElementById('passwordCreate');

$(document).ready(async function () {
    $('.btnCreate').on('click', async function (e) {
        e.preventDefault();                                                       // отмена действия браузера для своего события
        let u = await fetch('http://localhost:8080/api/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({                       // для преобразования обьектов в json
                name: usernameCreate.value,
                age: ageCreate.value,
                email: emailCreate.value,
                password: passwordCreate.value,
                roles: $('#select').val()
            })
        }).then(f => f.json());
        usernameCreate.value = "";
        ageCreate.value = "";
        emailCreate.value = "";
        passwordCreate.value = "";
        document.getElementById('select').value = "";
        document.getElementById('ad_pan').click();
        let rol = "";
        u.roles.forEach((u) => {
            rol += u.withoutPrefix + " \n";
        });
        row = ` <tr id="dele${u.id}"><td>${u.id}</td>
<td>${u.name}</td>
<td>${u.age}</td>
<td>${u.email}</td>
<td style="display:none;">${u.password}</td>
<td>${rol}</td>
<td><button class="btn btn-info editbtn">Edit</button></td>
<td><button class="btn btn-danger delbtn">Delete</button></td></tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    })
})

const idEdit = document.getElementById('idFormEdit');
const usernameEdit = document.getElementById('usernameFormEdit');
const ageEdit = document.getElementById('ageFormEdit');
const emailEdit = document.getElementById('emailFormEdit');
const passwordEdit = document.getElementById('passwordFormEdit');
let row = "";


//кнопка Edit в модальном окне
$(document).ready(function () {
    $('#submitEdit').on('click', async function (e) {
        e.preventDefault();
        let id = idEdit.value;
        let one = document.getElementById(`dele${id}`);
        let u = await fetch('http://localhost:8080/api/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: idEdit.value,
                name: usernameEdit.value,
                age: ageEdit.value,
                email: emailEdit.value,
                password: passwordEdit.value,
                roles: $('#selectEdit').val()
            })
        }).then(u => u.json());
        let rol = "";
        u.roles.forEach((u) => {
            rol += u.withoutPrefix + " \n";
        });
        row = ` <tr id="dele${u.id}"><td>${u.id}</td>
<td>${u.name}</td>
<td>${u.age}</td>
<td>${u.email}</td>
<td style="display:none;">${u.password}</td>
<td>${rol}</td>
<td><button class="btn btn-info editbtn">Edit</button></td>
<td><button class="btn btn-danger delbtn">Delete</button></td></tr>`;
        one.innerHTML = row;
        $('#editModal').modal('hide');
    })
});





//функция для поиска нужного юзера в таблице, соответствующего кнопке selector и выполняющего с ним функцию handle (удаление, редактирование, взяла готовый)
const on = (element, even, selector, handle) => {
    element.addEventListener(even, e => {                              //назначение более одного обработчика события
        if (e.target.closest(selector)) {                          // метод поднимается вверх от элемента и проверяет каждого родителя, прекращается поиск при соотвествии селектору
            handle(e)
        }
    })
}

//для модального окно при изменении
on(document, 'click', '.editbtn', (e) => {
    e.preventDefault();
    const father = e.target.parentNode.parentNode;        // возвращает родителя
    const id = father.firstElementChild.innerHTML;
    const name = father.children[1].innerHTML;
    const age = father.children[2].innerHTML;
    const email = father.children[3].innerHTML;
    const password = father.children[4].innerHTML;
    const role = father.children[5].innerHTML;
    let rolAr = role.replace(/[^A-Za-z]+/, " ").trim().split(/\s+/);
    rol(rolAr);
    $('#idFormEdit').val(id);
    $('#usernameFormEdit').val(name);
    $('#ageFormEdit').val(age);
    $('#emailFormEdit').val(email);
    $('#passwordFormEdit').val(password);
    $('#editModal').modal();

    console.log('-----------------');
    console.log('-----------------');
    console.log(father);
    console.log(id);
    console.log(name);
    console.log(age);
    console.log(email);
    console.log(password);
    console.log(role);
    console.log(rolAr);
    /*console.log('-----------------');
    console.log(father.children[0]);
    console.log(father.children[1]);
    console.log(father.children[2]);
    console.log(father.children[3]);
    console.log(father.children[4]);
    console.log(father.children[5]);
    console.log(father.children[6]);*/
})


const idValue = document.querySelector('#idDelete');
//для модального окна при удалении
on(document, 'click', '.delbtn', (e) => {
    e.preventDefault();
    const father = e.target.parentNode.parentNode;
    const id = father.firstElementChild.innerHTML;
    const name = father.children[1].innerHTML;
    const age = father.children[2].innerHTML;
    const email = father.children[3].innerHTML;
    const password = father.children[4].innerHTML;
    const role = father.children[5].innerHTML;
    $('#idDelete').val(id);
    $('#usernameDelete').val(name);
    $('#ageDelete').val(age);
    $('#emailDelete').val(email);
    $('#passwordDelete').val(password);
    $('#roleDelete').val(role);
    $('#deleteModal').modal();
})

//кнопка Delete в модальном окне
$(document).ready(function () {
    $('#submitDelete').on('click', async function (e) {
        e.preventDefault();
        let id = idValue.value;
        let deleteUser = document.getElementById(`dele${id}`);
        await fetch(`http://localhost:8080/api/delete/${id}`, {
            method: 'DELETE'
        });
        deleteUser.remove();
        $('#deleteModal').modal('hide');
    });
});