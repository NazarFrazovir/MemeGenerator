const canvas = document.getElementById('meme-canvas');
const ctx = canvas.getContext('2d');
const formatSelect = document.getElementById('format-select');
const uploadImage = document.getElementById('upload-image'); // Завантаження фото
const topTextInput = document.getElementById('top-text');
const bottomTextInput = document.getElementById('bottom-text');
const textColorInput = document.getElementById('text-color');
const textSizeInput = document.getElementById('text-size');
const downloadBtn = document.getElementById('download-btn');

canvas.width = 500; 
canvas.height = 500;

let image = new Image(); 

// Функція для зміни розміру полотна
function setCanvasSize(width, height) {
  canvas.width = width;
  canvas.height = height;
  drawMeme(); // Перемальовуємо мем після зміни розміру
}

// Вибір формату через селектор
formatSelect.addEventListener('change', () => {
  const [width, height] = formatSelect.value.split('x').map(Number);
  setCanvasSize(width, height);
});

// Завантаження зображення
uploadImage.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      image.src = reader.result;
      image.onload = () => {
        drawMeme(); // Малюємо мем після завантаження зображення
      };
    };
    reader.readAsDataURL(file);
  }
});

// Малювання мему
function drawMeme() {
  // Очистка полотна
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Масштабування зображення
  if (image) {
    const imgWidth = image.width;
    const imgHeight = image.height;

    const scale = Math.min(canvas.width / imgWidth, canvas.height / imgHeight);
    const x = (canvas.width - imgWidth * scale) / 2;
    const y = (canvas.height - imgHeight * scale) / 2;

    ctx.drawImage(image, x, y, imgWidth * scale, imgHeight * scale);
  }

  // Текстові налаштування
  const textSize = parseInt(textSizeInput.value, 10);
  ctx.font = `${textSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillStyle = textColorInput.value;
  ctx.lineWidth = textSize / 10;
  ctx.strokeStyle = 'black';

  // Верхній текст
  if (topTextInput.value.trim() !== '') {
    ctx.strokeText(topTextInput.value.toUpperCase(), canvas.width / 2, textSize + 10);
    ctx.fillText(topTextInput.value.toUpperCase(), canvas.width / 2, textSize + 10);
  }

  // Нижній текст
  if (bottomTextInput.value.trim() !== '') {
    ctx.strokeText(bottomTextInput.value.toUpperCase(), canvas.width / 2, canvas.height - 20);
    ctx.fillText(bottomTextInput.value.toUpperCase(), canvas.width / 2, canvas.height - 20);
  }
}

// Оновлення тексту в реальному часі
[topTextInput, bottomTextInput, textColorInput, textSizeInput].forEach(input =>
  input.addEventListener('input', drawMeme)
);

// Завантаження мему
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL();
  link.click();
});

