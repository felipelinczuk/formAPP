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
                        <td class="table">` + data[i].birthDate + `</td>
                        <td class="table">` + data[i].monthlyIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'USD'}) + `</td>
                        <td>
                            <div class="table">
                                <button class="tableEdit" person="` + data[i].id + `"><img class="table" src="../images/edit.png"></button>
                                <button class="tableDel" person="` + data[i].id + `"><img class="table" src="../images/del.png"></button>
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
            alert('Error!');
        }
    });
}

function newPerson(name, cpf, birthdate, monthlyincome){
    $.ajax({
        url: 'http://localhost:5001/api/person/new',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            name: name,
            cpf: cpf,
            birthDate: birthdate,
            monthlyIncome: monthlyincome

        }),
        success: function() {
            alert('Success!');
            location.reload();
        },
        error: function(err) {
            console.log(err.message);
            alert('Error!');
        }
    });
}

function editPerson(name, cpf, birthdate, monthlyincome, id){
    $.ajax({
        url: 'http://localhost:5001/api/person/edit/' + id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            name: name,
            cpf: cpf,
            birthDate: birthdate,
            monthlyIncome: monthlyincome

        }),
        success: function() {
            alert('Success!');
            location.reload();
        },
        error: function(err) {
            console.log(err.message);
            alert('Error!');
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
                    document.getElementById("txtMonthlyIncome").value = parseFloat(cols[3].innerText.replace(/[^\d,]/g, '').replace(',', '.')).toFixed(2);
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
            alert('Error!');
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