function showContainer(containerId) {
    document.querySelectorAll('.container').forEach(container => {
        if (container.id === containerId) {
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    });

    document.getElementById('containerTitle').textContent = `Contenedor ${containerId.slice(-1)}`;
}
