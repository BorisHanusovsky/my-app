alert("dataset");
document.addEventListener('DOMContentLoaded', function () {
    var fileInput = document.getElementById('dataInput');
    var imageContainer = document.getElementById('imageContainer');

    // Add event listener to the button instead of the label
    var loadDataButton = document.getElementById('loadDataButton');
    loadDataButton.addEventListener('click', function () {
        fileInput.click(); // Trigger the file input click event when the button is clicked
    });

    fileInput.addEventListener('change', function () {
        displayImages(this.files);
    });

    function displayImages(files) {
        imageContainer.innerHTML = '';

        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            var reader = new FileReader();

            reader.onload = function (e) {
                var img = document.createElement('img');
                img.src = e.target.result;
                imageContainer.appendChild(img);
            };

            reader.readAsDataURL(file);
        }
    }
});
