document.getElementById("imageUpload").onclick = function () {
    
    let xhttp = new XMLHttpRequest(); // create new AJAX request
    const selectedImage = document.getElementById('selectedImage');
    const imageStatus = document.getElementById('imageStatus');
    const progressDiv = document.getElementById('progressDiv');
    const progressBar = document.getElementById('progressBar');

    xhttp.onreadystatechange = function () {
        imageStatus.innerHTML = this.responseText;
    };

    xhttp.open("POST", "/dashboard/image-upload");
    xhttp.upload.onprogress = function (event) {
        if(event.lengthComputable) {
            let result = Math.floor( (event.loaded / event.total) * 100 );
            if(result !== 100) {
                progressBar.innerHTML = result + "%";
                progressBar.style.width = `${result}%`;
            } else {
                progressDiv.style.display = 'none';
            }
        }
    }
    let formData = new FormData();
    if(selectedImage.files.length > 0) {
        progressDiv.style.display = 'block';
        formData.append("image", selectedImage.files[0]);
        xhttp.send(formData);
    } else {
        imageStatus.style.color = 'red';
        imageStatus.innerHTML = "لطفا یک تصویر اتخاب کنید"
    }
    
};