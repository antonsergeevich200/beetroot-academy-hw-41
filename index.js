// Классы для управления пользователями и часами

class User {
    constructor(name, role) {
        if (!this.isValidName(name)) {
            alert("Invalid name!");
            return;
        }
        
        if (!this.isValidRole(role)) {
            alert("Invalid role!");
            return;
        }
        
        this.name = name;
        this.role = role;
        this.isLoggedIn = false;
    }

    isValidName(name) {
        return typeof name === 'string' && name.trim().length > 0;
    }

    isValidRole(role) {
        return role === 'admin' || role === 'user';
    }

    getName() {
        return this.name;
    }

    getRole() {
        return this.role;
    }

    login() {
        this.isLoggedIn = true;
        console.log(`${this.name} is now logged in.`);
    }

    logout() {
        this.isLoggedIn = false;
        console.log(`${this.name} is now logged out.`);
    }

    changeName(newName) {
        if (this.isValidName(newName)) {
            this.name = newName;
            console.log(`Name changed to ${this.name}.`);
        } else {
            alert("Invalid name!");
        }
    }

    changePassword(newPassword) {
        if (newPassword.trim().length > 0) {
            this.password = newPassword;
            console.log("Password has been changed.");
        } else {
            alert("Invalid password!");
        }
    }
}

class Admin extends User {
    constructor(name) {
        super(name, 'admin');
        this.users = [];
    }

    addUser(user) {
        if (user instanceof User) {
            this.users.push(user);
            console.log(`User ${user.getName()} added.`);
        } else {
            alert("Invalid user!");
        }
    }

    removeUser(userName) {
        this.users = this.users.filter(user => user.getName() !== userName);
        console.log(`User ${userName} removed.`);
    }

    changeUserRole(userName, newRole) {
        const user = this.users.find(user => user.getName() === userName);
        if (user && this.isValidRole(newRole)) {
            user.role = newRole;
            console.log(`Role of ${userName} changed to ${newRole}.`);
        } else {
            alert("Invalid role or user not found!");
        }
    }

    getAllUsers() {
        return this.users;
    }

    removeAllUsers() {
        this.users = [];
        console.log("All users removed.");
    }
}

// Класс для создания мировых часов

class WorldClock {
    constructor(city, timezoneOffset) {
        this.city = city;
        this.timezoneOffset = timezoneOffset;
        this.clockElement = this.createClockElement();
        this.updateTime();
    }

    getCurrentDate() {
        const date = new Date();
        return date.toLocaleDateString('en-GB', { timeZone: `UTC${this.timezoneOffset}` });
    }

    getCurrentDateTime() {
        const date = new Date();
        return date.toLocaleString('en-GB', { timeZone: `UTC${this.timezoneOffset}` });
    }

    createClockElement() {
        const clockContainer = document.createElement('div');
        clockContainer.className = 'clock';

        const cityName = document.createElement('h2');
        cityName.textContent = this.city;

        const timeDisplay = document.createElement('p');
        timeDisplay.className = 'time-display';

        const dateButton = document.createElement('button');
        dateButton.textContent = 'Show Date';
        dateButton.addEventListener('click', () => {
            alert(`Current Date in ${this.city}: ${this.getCurrentDate()}`);
        });

        const dateTimeButton = document.createElement('button');
        dateTimeButton.textContent = 'Show Date & Time';
        dateTimeButton.addEventListener('click', () => {
            alert(`Current Date & Time in ${this.city}: ${this.getCurrentDateTime()}`);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Clock';
        deleteButton.addEventListener('click', () => {
            this.deleteClock();
        });

        clockContainer.appendChild(cityName);
        clockContainer.appendChild(timeDisplay);
        clockContainer.appendChild(dateButton);
        clockContainer.appendChild(dateTimeButton);
        clockContainer.appendChild(deleteButton);

        document.getElementById('clocksContainer').appendChild(clockContainer);

        return clockContainer;
    }

    updateTime() {
        const now = new Date();
        const localTime = new Date(now.getTime() + this.timezoneOffset * 3600 * 1000);
        this.clockElement.querySelector('.time-display').textContent = localTime.toLocaleTimeString();

        setTimeout(() => this.updateTime(), 1000);
    }

    deleteClock() {
        this.clockElement.remove();
    }
}

// Управления пользователями и часами

document.getElementById('createUserBtn').addEventListener('click', () => {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    
    const user = new User(name, role);
    admin.addUser(user);
    
    document.getElementById('userName').value = '';
    updateUserList();
});

document.getElementById('getAllUsersBtn').addEventListener('click', () => {
    updateUserList();
});

document.getElementById('removeAllUsersBtn').addEventListener('click', () => {
    admin.removeAllUsers();
    updateUserList();
});

document.getElementById('addClockBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    const timezoneOffset = parseFloat(document.getElementById('timezoneInput').value);

    if (city && !isNaN(timezoneOffset)) {
        new WorldClock(city, timezoneOffset);
        document.getElementById('cityInput').value = '';
        document.getElementById('timezoneInput').value = '';
    } else {
        alert('Please enter a valid city and timezone offset.');
    }
});

const admin = new Admin('Admin');

function updateUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    
    const users = admin.getAllUsers();
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.textContent = `Name: ${user.getName()}, Role: ${user.getRole()}`;
        userList.appendChild(userItem);
    });
}
