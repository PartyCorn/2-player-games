(function loadHeader() {
    const headerPlaceholder = document.createElement('div');
    headerPlaceholder.id = 'header-placeholder';
    document.body.prepend(headerPlaceholder);

    fetch('../modules/header/header.html')
    .then(response => response.text())
    .then(data => {
        headerPlaceholder.innerHTML = data;
    })
    .catch(error => console.error('Ошибка при загрузке хедера:', error));
})();