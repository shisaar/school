const fileInput = document.getElementById('fileInput');
const exifBody = document.getElementById('exifBody');
const resultArea = document.getElementById('resultArea');
const dropZone = document.getElementById('dropZone');

dropZone.onclick = () => fileInput.click();

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    EXIF.getData(file, function() {
        const allData = EXIF.getAllTags(this);
        exifBody.innerHTML = '';
        
        const tags = {
            "Make": "Производитель",
            "Model": "Модель",
            "DateTime": "Дата/Время",
            "GPSLatitude": "Широта",
            "GPSLongitude": "Долгота"
        };

        let found = false;
        for (let tag in tags) {
            if (allData[tag]) {
                found = true;
                exifBody.innerHTML += <tr><td><strong>${tags[tag]}</strong></td><td>${allData[tag]}</td></tr>;
            }
        }

        if (!found) {
            exifBody.innerHTML = '<tr><td>Данные не найдены. Фото "чистое".</td></tr>';
        }
        resultArea.style.display = 'block';
    });
});
