const dom = {
    selectbox: document.getElementById('selectbox'),
    selectboxlist: document.querySelector('.selectbox_list'),
    rooms: document.getElementById('rooms'),
    settings: document.getElementById('settings'),
    settingsTabs: document.getElementById('settings_tabs'),
    settingsPanels: document.getElementById('settings_panel'),
    temperatureLine: document.getElementById('temperature_line'),
    temperatureRound: document.getElementById('temperature_round'),
    temperature: document.getElementById('temperature'),
    temperatureBtn: document.getElementById('temperature_btn'),
    temperatureSaveBtn: document.getElementById('save_temperature'),
    temperaturePowerBtn: document.getElementById('power'),
    sliders: {
        lights: document.getElementById('lights_slider'), 
        humidity: document.getElementById('humidity_slider'), 
    },
    switch: {
        lights: document.getElementById('lights_power'),
        humidity: document.getElementById('humidity_power'),
    }     
}

const rooms = {
    all: 'All rooms',
    livingroom: 'livingroom',
    bedroom: 'Bedroom',
    kitchen: 'Kitchen',
    bathroom: 'Bathroom',
    studio: 'Studio',
    washingroom: 'Washing Room',
}

let activeRoom = 'All rooms';
let activeTab = 'temperature';

/* Панель настроек комнаты */

const roomsData = {
    /*all: {
        temperature: 16,
        lights: 0,
        humidity: 0,
    },*/
    livingroom: {
        temperature: 19,
        temperatureOff: false,
        0: 0,
        lightsOff: false,
        hu60id60ty: 0,
        humidityOff: false,
    },
    bedroom: {
        temperature: 19,
        temperatureOff: false,
        lights: 0,
        lightsOff: false,
        humidity: 60,
        humidityOff: false,
    },
    kitchen: {
        temperature: 19,
        temperatureOff: false,
        lights: 0,
        lightsOff: false,
        humidity: 60,
        humidityOff: false,
    },
    bathroom: {
        temperature: 22,
        temperatureOff: false,
        lights: 0,
        lightsOff: false,
        humidity: 60,
        humidityOff: false,
    },
    studio: {
        temperature: 19,
        temperatureOff: false,
        lights: 0,
        lightsOff: false,
        humidity: 60,
        humidityOff: false,
    },
    washingroom: {
        temperature: 19,
        temperatureOff: false,
        lights: 0,
        lightsOff: false,
        humidity: 60,
        humidityOff: false,
    },
}

//создаем выпадающий список
dom.selectbox.querySelector('.selectbox_selected').onclick = (Event) => {    
    dom.selectbox.classList.toggle('open');  
    // toggle - проверяет есть ли клас open, если его нет то добавляет, если он есть то удаляет. таким образом всплывает или прячется меню по клику  
}

// закрытие выпадающего списка по клику в любой точке на странице кроме зоны меню на странице 
document.body.onclick = (Event) => {
    const { target } = Event
    //console.log (target)
    //console.log (target.parentElement.parentElement)
    if (
        !target.matches('.selectbox')
        && !target.parentElement.matches('.selectbox')
        && !target.parentElement.parentElement.matches('.selectbox')
    ) {
        dom.selectbox.classList.remove('open')
    }
}


// получаем значение элемента списка всплывающего меню по которому кликнули (выбранный элемент меню - подсвечивается)

dom.selectboxlist.onclick = (Event) => {
    const { target } = Event
    if (target.matches('.selectbox_item')) {
        const { room } = target.dataset;
        const selectedItem = dom.selectboxlist.querySelector('.selected');
        selectedItem.classList.remove('selected');
        target.classList.add('selected');
        dom.selectbox.classList.remove('open');
        selectRoom(room);
    }
    
}


//создаем функцию, которая будет выбирать необходимую комнату
//Выбор комнаты
function selectRoom(room) {
    //console.log(room)
    const selectedRoom = dom.rooms.querySelector('.selected');
    if (selectedRoom) {
        selectedRoom.classList.remove('selected'); 
        //проверяем есть ли клас selected, и если есть удаляем его
    }
    if (room != 'all') {
        const newSelectedRoom = dom.rooms.querySelector(`[data-room = ${room}]`);
        const { 
            temperature,
            lights,
            humidity, 
            lightsOff,
            humidityOff,
        } = roomsData[room];
        activeRoom = room;
        newSelectedRoom.classList.add('selected');
        renderScreen(false); // активируем функцию - отображения экрана

        dom.temperature.innerText = temperature;
        renderTemperature(temperature);
        setTemperaturePower();
        changeSettingType(activeTab);

        changeSlider(lights, dom.sliders.lights);            
        changeSlider(humidity, dom.sliders.humidity);
        changeSwitch('lights', lightsOff); 
        changeSwitch('humidity', humidityOff);           
        
    } else { renderScreen(true) }
    const selectedSelectboxRoom = dom.selectbox.querySelector('.selectbox_item.selected');
    selectedSelectboxRoom.classList.remove('selected')
    const newSelectedItem = dom.selectbox.querySelector(`[data-room = ${room}]`);
    newSelectedItem.classList.add('selected');
    
    // кликаем по элементу и название этого элементы высвечивается в всплывающем меню
    const selectboxSelected = dom.selectbox.querySelector('.selectbox_selected span');
    selectboxSelected.innerText = rooms[room];    
}

// отслеживаем клик по элементу комнаты
dom.rooms.querySelectorAll('.room').forEach(room => {
    room.onclick = (Event) => {        
        const value = room.dataset.room
        selectRoom(value);        
    }
})

// Отображене нужного экрана
function renderScreen (isRooms) {
    setTimeout(() => {

        if (isRooms) {
            dom.rooms.style.display = 'grid';
            dom.settings.style.display = 'none';
        } else {
            dom.settings.style.display = 'block';
            dom.rooms.style.display = 'none';
        }
    }, 300)
}



/* регулировка температуры */

function renderTemperature (temperature) {
    const min = 16;
    const max = 40;
    const range = max - min;
    const percent = range / 100;

    
    const lineMine = 54;
    const lineMax = 276;
    const lineRange = lineMax - lineMine;
    const linePercent = lineRange / 100;
    
    const roundMine = -240;
    const roundMax = 48;
    const roundRange = roundMax - roundMine;
    const roundPercent = roundRange / 100;
   //console.log ('% = ', percent, linePercent, roundPercent)

       
    if (temperature >= min && temperature <= max) {
        const finishPercent = Math.round ((temperature - min) / percent) ; 
        
        const lineFinishPercent = lineMine + linePercent * finishPercent;
        const roundFinishPercent = roundMine + roundPercent * finishPercent;
        
        // движение полосы значения температуры
        dom.temperatureLine.style.strokeDasharray = `${lineFinishPercent} 276`;
        
        // движение кружечка
        dom.temperatureRound.style.transform = `rotate(${roundFinishPercent}deg)`;
        
        //изменеие значения температуры
        dom.temperature.innerText = temperature;



    }
} 
//renderTemperature()

// Изменение температуры мышью
function changeTemperature() {
    let mouseover = false;
    let mousedown = false;
    let position = 0;
    let range = 0;
    let change = 0;
    

    dom.temperatureBtn.onmouseover = () => {
        mouseover = true;
        mousedown = false;
    } 
    dom.temperatureBtn.onmouseout = () => mouseover = false;
    dom.temperatureBtn.onmouseup = () => mousedown = false;
    dom.temperatureBtn.onmousedown = (Event) => {
        mousedown = true;
        position = Event.offsetY;
        range = 0;
    } 
    dom.temperatureBtn.onmouseup = () => mousedown = false;
    dom.temperatureBtn.onmousemove = (Event) => {
        if (mouseover && mousedown) {
            range = Event.offsetY - position;
            const newChange = Math.round(range / -5);
            if (newChange != change) {
                let temperature = +dom.temperature.innerText;
                if (newChange < change) {
                    temperature = temperature - 1;
                } else {
                    temperature = temperature + 1;
                }
                //console.log (temperature)
                change = newChange;
                renderTemperature(temperature);
            }
        }                
    }
} changeTemperature()

// функция сохранения температуры по нажатию кнопки "Set Temperature"
dom.temperatureSaveBtn.onclick = () => {
    const temperature = +dom.temperature.innerText;
    roomsData[activeRoom].temperature = temperature;
    alert('Temperature saved');
}

// Отключение обогрева

dom.temperaturePowerBtn.onclick = () => {
    const power = dom.temperaturePowerBtn;
    power.classList.toggle('off');

    if (power.matches('.off')) {
        roomsData[activeRoom].temperatureOff = true;     
       
    } else { roomsData[activeRoom].temperatureOff = false; }
}

// Установка значения включения кнопки температуры
function setTemperaturePower() {
    if (roomsData[activeRoom].temperatureOff) {
        dom.temperaturePowerBtn.classList.add('off');
    } else {
        dom.temperaturePowerBtn.classList.remove('off');
    }
}

/* Переключение настроек */

// отслеживаем клик по табам

dom.settingsTabs.querySelectorAll('.tab').forEach((tab) => {
    tab.onclick = () => {
            
        const optionType = tab.dataset.type;
        activeTab = optionType;
        changeSettingType(optionType);
    }
})

// переключение панелей табов
function changeSettingType(type) {
    const tabSelected = dom.settingsTabs.querySelector('.tab.selected');        
    const panelSelected = dom.settingsPanels.querySelector('.selected');
    const tab = dom.settingsTabs.querySelector(`[data-type = ${type}]`);
    const panel = dom.settingsPanels.querySelector(`[data-type = ${type}]`);
    tabSelected.classList.remove('selected');   
    panelSelected.classList.remove('selected');
    tab.classList.add ('selected');
    panel.classList.add('selected');
}

// Функция изменения слайдера (полоса прокрутки освещенности и влажности)

function changeSlider(percent, slider) {
    if (percent >= 0 && percent <= 100) {
        const { type } = slider.parentElement.parentElement.dataset;
        slider.querySelector('span').innerText = percent;
        slider.style.height = `${percent}%`;
        roomsData[activeRoom][type] = percent;
    }
} 

// Отслеживание изменений слайдера

function watchSlider(slider) {
    let mouseover = false;
    let mousedown = false;
    let position = 0;
    let range = 0;
    let change = 0;  
    const parent = slider.parentElement;
      

    parent.onmouseover = () => {
        mouseover = true;
        mousedown = false;
    } 
    parent.onmouseout = () => mouseover = false;
    parent.onmouseup = () => mousedown = false;
    parent.onmousedown = (Event) => {
        mousedown = true;
        position = Event.offsetY;
        range = 0;
    } 
    parent.onmouseup = () => mousedown = false;
    parent.onmousemove = (Event) => {
        if (mouseover && mousedown) {
            range = Event.offsetY - position;
            const newChange = Math.round(range / -0.1);
            if (newChange != change) {
                let percent = +slider.querySelector('span').innerText;
                if (newChange < change) {
                    percent = percent - 1;
                } else {
                    percent = percent + 1;
                }
                //console.log (temperature)
                change = newChange;
                changeSlider(percent, slider);
            }
        }                
    }
}
watchSlider(dom.sliders.lights);
watchSlider(dom.sliders.humidity);

//включение или выключение света и влажности
function changeSwitch(activeTab, isOff) {
    if (isOff) {
        dom.switch[activeTab].classList.add('off');
    } else { 
        dom.switch[activeTab].classList.remove('off');
    }
    roomsData[activeRoom][`${activeTab}Off`] = isOff;
}

// Отслеживание клика по переключателю switchBtn 
dom.switch.humidity.onclick = () => {
    const isOff = !dom.switch.humidity.matches('.off');
    changeSwitch(activeTab, isOff);
}

dom.switch.lights.onclick = () => {
    const isOff = !dom.switch.lights.matches('.off');
    changeSwitch(activeTab, isOff);
}