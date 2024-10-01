var chosen_button_r = "";
var y_value = 0;
var x_value = -100;

class InvalidValueException extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidValueException";
    }

}

function validation(values){
    if (chosen_button_r === "") {
        throw new InvalidValueException('Выберите R');
    }
    y_value = parseFloat(document.getElementById("y").value);
    if (isNaN(y_value)) {
        throw new InvalidValueException('Некорректное значение Y')
    }
    if (y_value < -5 || y_value > 3) {
        throw new InvalidValueException('Y должен быть от -5 до 3')
    }
    const checkboxes_x = document.querySelectorAll(".x");
    x_value = -100;
    checkboxes_x.forEach(checkbox => {
        if (checkbox.checked) {
            if (x_value === -100) {
                x_value = checkbox.id;
            } else {
                throw new InvalidValueException('Выберите одно значение X')
            }
        }
        }
    )
    if (x_value === -100) {
        throw  new InvalidValueException('Выберите X');
    }
}

async function sendForm(event){
    event.preventDefault();

    let dataForm = document.getElementById("dataForm");
    let formData = new FormData(dataForm);
    const values = Object.fromEntries(formData);

    try {
        validation(values);
    } catch (e){
        alert(e.message);
        return;
    }

    let response = await fetch("/fcgi-bin/lab1_v2.jar?x=" + x_value + "&y=" + y_value + "&r=" + chosen_button_r, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        const data = await response.json();
        const resultsTable = document.getElementById("history");
        const newRow = resultsTable.insertRow();
        const xCell =  newRow.insertCell(0);
        const yCell =  newRow.insertCell(1);
        const rCell =  newRow.insertCell(2);
        const timeCell =  newRow.insertCell(3);
        const timeExecutionCell =  newRow.insertCell(4);
        const resultCell =  newRow.insertCell(5);
        xCell.textContent = data.x;
        yCell.textContent = data.y;
        rCell.textContent = data.r;
        timeCell.textContent = data.time;
        timeExecutionCell.textContent = data.execution;
        if (data.result == "true") {
            resultCell.textContent = "Да";
        } else {
            resultCell.textContent = "Нет";
        }
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    let dataForm = document.getElementById("dataForm");
    dataForm.addEventListener('submit', sendForm);
    const buttons_r = document.querySelectorAll(".r");
    buttons_r.forEach(button =>{
        button.addEventListener(
            'click', ($event)=>{
                $event.preventDefault();
                chosen_button_r = button.value;
                buttons_r.forEach(btn => {btn.classList.remove("chosen-r")});
                button.classList.add("chosen-r");
            }
        );
    });
});
