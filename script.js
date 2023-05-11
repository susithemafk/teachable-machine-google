// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

const URL = "https://teachablemachine.withgoogle.com/models/cAITszk9h/";
// const URL = '/model/'

let model, labelContainer, maxPredictions, highestPrediction 

const uploadInput = document.getElementById('input_file') 
const submitUploadedImage = document.getElementById('submit') 
const showInputImage = document.getElementById('input') 
const img = document.getElementById('img')
const reset = document.querySelector('#reset')
let result 
const resultName = document.querySelector('#result_name')
const resultImage = document.querySelector('#result_image')
const resultContainer = document.querySelector('#result')
const loader = document.querySelector('#lds-ring')

// Load the image model 
async function init() {
    loader.style.visibility = 'visible'

    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL) 
    maxPredictions = model.getTotalClasses() 
}

async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(img, false); 
    let predictions = []
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ': ' + prediction[i].probability.toFixed(2);

        // add all predictions to array
        predictions.push(classPrediction)
    }

    // get index of highest prediction
    highestPrediction = predictions[0]
    predictions.forEach((prediction, index) => {
        console.log(Number(predictions[index].replace(/\D+/g, '')) / 100)
        if (Number(predictions[index].replace(/\D+/g, '')) / 100 > highestPrediction.replace(/\D+/g, '') / 100) {
            highestPrediction = predictions[index]
        }
    })
    console.log(highestPrediction) 

    // result
    result = highestPrediction.replace(/[0-9]/g, '').slice(0, -3)
    loader.style.visibility = 'hidden'
    loader.style.display = 'none'
    getResult() 
}


function readURL( input ) {
    if (input.files && input.files[0]) {
        init().then(() => {
            predict();
        });
    }
}

// on click on submit button - readURL and start all functions
submitUploadedImage.addEventListener('click', function () {
    readURL(uploadInput) 
}) 

// on change of input file - show image
uploadInput.addEventListener('change', (e) => { 
    
    if ( fileValidation() == false) {
        console.log('wrong input type'); 
        return false;
    }

    const url = webkitURL.createObjectURL(e.target.files[0])
    img.src = url 
    showInputImage.style.backgroundImage = 'url(' + url + ')' 
    showInputImage.innerHTML = ''
})

// reset button reloads page 
reset.addEventListener('click', () => {
    location.reload()
})

// function get results, changes new background image and text
const getResult = () => {
    resultContainer.style.backgroundImage = 'url(results/result-' + result + '.png)'
    resultName.innerHTML = 'Podobáš se </br>' + result
}

// file format validation 
const fileValidation = () => {
    var fileInput =
        document.getElementById('input_file');
     
    var filePath = fileInput.value;
 
    // Allowing file type
    var allowedExtensions =
            /(\.jpg|\.jpeg|\.png)$/i;
     
    if (!allowedExtensions.exec(filePath)) {
        alert('Nesprávný formát obrázku');
        fileInput.value = '';
        return false; 
    }
}

