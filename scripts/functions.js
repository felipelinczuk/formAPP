function handleSave(name, cpf, birthdate, monthlyincome, person){
    if(person != "0") {
        editPerson(name, cpf, birthdate, monthlyincome, person);
    }
    else{
        newPerson(name, cpf, birthdate, monthlyincome);
    }
}

function getPeople(){
    $.ajax({
        url: 'http://localhost:5001/api/person',
        type: 'GET',
        dataType: 'json',
        success: function(json){
            var data = json.data;
            var tableContent = `
                <thead>
                    <tr>
                        <th class="table">Name</th>
                        <th class="table">CPF</th>
                        <th class="table">Birthdate</th>
                        <th class="table">Monthly Income</th>
                        <th class="table">Action</th>
                    </tr>
                </thead>
                <tbody>`;
            for(var i=0; i < data.length; i++){
                tableContent +=
                    `<tr person="`+ data[i].id + `">
                        <td class="table">` + data[i].name + `</td>
                        <td class="table">` + data[i].cpf + `</td>
                        <td class="table">` + data[i].birthDate.replace(/\-/g, '/') + `</td>
                        <td class="table">` + data[i].monthlyIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'USD'}) + `</td>
                        <td>
                            <div class="table">
                                <button class="tableEdit" person="` + data[i].id + `"><img class="table" src="./images/edit.png"></button>
                                <button class="tableDel" person="` + data[i].id + `"><img class="table" src="./images/del.png"></button>
                            </div>
                        </td>
                    </tr>`;
            }
            tableContent += `
                </tbody>
                </thead>`;

            document.getElementById("table").innerHTML = tableContent;
            editButton();
            delButton();
        },
        error: function(err) {
            console.log(err.message);
            alert('Server error!');
        }
    });
}

function newPerson(name, cpf, birthdate, monthlyincome){
    $.ajax({
        url: 'http://localhost:5001/api/person/new',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            name: name == ""? null : name,
            cpf: cpf,
            birthDate: birthdate.replace(/\//g, '-'),
            monthlyIncome: monthlyincome.replace(/\./g, '').replace(/\,/g, '.')

        }),
        success: function() {
            alert('Success!');
            location.reload();
        },
        error: function(err) {
            console.log(err.message);
            alert('Check the fields and try again!');
        }
    });
}

function editPerson(name, cpf, birthdate, monthlyincome, id){
    $.ajax({
        url: 'http://localhost:5001/api/person/edit/' + id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            name: name == ""? null : name,
            cpf: cpf,
            birthDate: birthdate.replace(/\//g, '-'),
            monthlyIncome: monthlyincome.replace(/\./g, '').replace(/\,/g, '.')

        }),
        success: function() {
            alert('Success!');
            location.reload();
        },
        error: function(err) {
            console.log(err.message);
            alert('Check the fields and try again!');
        }
    });
}

function editButton(){
    var buttons = document.querySelectorAll('button.tableEdit');
    buttons.forEach(function(button) {
        button.addEventListener('click', function () {
            var modal = new bootstrap.Modal(document.getElementById('modalAdd'));
            person = button.getAttribute('person');
            document.getElementById('modalAdd').setAttribute('person', person);
            modal.show();

            var table = document.getElementById('table');
            var rows = table.getElementsByTagName('tr');

            for (var i = 1; i < rows.length; i++) { 
                var id = rows[i].getAttribute('person');

                if (id === person) {
                    var cols = rows[i].getElementsByTagName('td');
                    document.getElementById("txtName").value = cols[0].innerText;
                    document.getElementById("txtCPF").value = cols[1].innerText;
                    document.getElementById("txtBirthDate").value = cols[2].innerText;
                    document.getElementById("txtMonthlyIncome").value = cols[3].innerText.replace(/[^\d,]/g, '').replace(/(\d{1,})(\d{2})$/, '$1,$2').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                    break;
                }
            }
        });
    });
}

function delPerson(id){
    $.ajax({
        url: 'http://localhost:5001/api/person/' + id,
        type: 'DELETE',
        dataType: 'json',
        success: function() {
            alert('Success!');
            location.reload();
        },
        error: function(err) {
            console.log(err.message);
            alert('Server error!');
        }
    });
}

function delButton(){
    var buttons = document.querySelectorAll('button.tableDel');
    buttons.forEach(function(button) {
        button.addEventListener('click', function () {
            var modal = new bootstrap.Modal(document.getElementById('modalDel'));
            person = button.getAttribute('person');
            document.getElementById('modalDel').setAttribute('person', person);
            modal.show();
        });
    });
}

function newButton(){
    var modal = new bootstrap.Modal(document.getElementById('modalAdd'));
    document.getElementById('txtName').value = "";
    document.getElementById('txtCPF').value = "";
    document.getElementById('txtBirthDate').value = "";
    document.getElementById('txtMonthlyIncome').value = "";
    document.getElementById('modalAdd').setAttribute('person', "0");
    modal.show();
}

function cpfMask(elem){
    elem.value = elem.value.replace(/\D/g, '');

    if(elem.value.length == 11){
        elem.value = elem.value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    }
}

function birthMask(elem){
    elem.value = elem.value.replace(/\D/g, '');

    if(elem.value.length == 8){
        elem.value = elem.value.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3");
    }
}

function moneyMask(elem){
    elem.value = elem.value.replace(/\D/g, '');
    
    elem.value = elem.value.replace(/(\d{1,})(\d{2})$/, '$1,$2');
    elem.value = elem.value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function barSearch(elem){
    elem.value = elem.value.replace(/\D/g, '');

    if(elem.value.length == 11){
        elem.value = elem.value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    }
}

function searchPerson(){
    id = document.getElementById("barCPF").value;
    $.ajax({
        url: 'http://localhost:5001/api/person/find/C/' + id,
        type: 'GET',
        dataType: 'json',
        success: function(json){
            var data = [json.data];
            var tableContent = `
                <thead>
                    <tr>
                        <th class="table">Name</th>
                        <th class="table">CPF</th>
                        <th class="table">Birthdate</th>
                        <th class="table">Monthly Income</th>
                        <th class="table">Action</th>
                    </tr>
                </thead>
                <tbody>`;
            for(var i=0; i < data.length; i++){
                tableContent +=
                    `<tr person="`+ data[i].id + `">
                        <td class="table">` + data[i].name + `</td>
                        <td class="table">` + data[i].cpf + `</td>
                        <td class="table">` + data[i].birthDate.replace(/\-/g, '/') + `</td>
                        <td class="table">` + data[i].monthlyIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'USD'}) + `</td>
                        <td>
                            <div class="table">
                                <button class="tableEdit" person="` + data[i].id + `"><img class="table" src="./images/edit.png"></button>
                                <button class="tableDel" person="` + data[i].id + `"><img class="table" src="./images/del.png"></button>
                            </div>
                        </td>
                    </tr>`;
            }
            tableContent += `
                </tbody>
                </thead>`;

            document.getElementById("table").innerHTML = tableContent;
            editButton();
            delButton();
        },
        error: function(err) {
            console.log(err.message);
            alert('Person not found!');
        }
    });
}