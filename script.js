const buttonClear =document.querySelector('.btn-clear');
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemFilter = document.querySelector('.filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));

    checkUI();
}

function FindDuplicate(item) {
    const items = getItemsFromStorage();

    return items.includes(item)
}

function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value;
    // Validate Input
    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    if (FindDuplicate(newItem)) {
        alert('Item already exists');
        return;
    }
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }
    // Create item DOM element
    addItemToDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    }
    else {
        setItemToEdit(e.target)
    }
}

function setItemToEdit(item) {
    isEditMode = item.classList.contains('edit-mode')?false:true;

    console.log(item.classList);
    itemList.querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    if (isEditMode) {
        formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
        formBtn.style.backgroundColor = '#228B22';
        itemInput.value = item.textContent;
    } 
    else {
        item.classList.remove('edit-mode');
        checkUI();
    }
    
}

function removeItem(item) {
    if (confirm('Are you sure?')) {
        // Remove Item from DOM
        item.remove();

        //Remove Item from storage
        removeItemFromStorage(item.textContent);

        checkUI()
    }
    
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i != item);

    // Re-set to localstorage
    itemsFromStorage.length > 0?
        localStorage.setItem('items', JSON.stringify(itemsFromStorage)):
        localStorage.removeItem('items');
}

function addItemToDOM(item) {
    // Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

function onClear() {
    while (itemList.firstChild) {
        itemList.firstChild.remove();
    }
    checkUI();
    localStorage.clear();
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    // Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } 
    else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function checkUI() {
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        itemFilter.classList.add('hidden');
        buttonClear.classList.add('hidden');
    }
    else {
        itemFilter.classList.remove('hidden');
        buttonClear.classList.remove('hidden');
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    isEditMode = false;
}

function onFilter(e) {
    const items = itemList.querySelectorAll('li');
    const currInput = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(currInput) != -1) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none';

        }
    });
    
    console.log(itemList.children[0].textContent);
}

// Initialize app
function init() {
    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    buttonClear.addEventListener('click', onClear);
    itemFilter.addEventListener('input', onFilter);
    document.addEventListener('DOMContentLoaded', displayItems);
    checkUI();
}

init();