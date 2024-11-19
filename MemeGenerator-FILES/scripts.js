// Налаштування полотна
const canvas = document.getElementById('meme-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

// Перемінні для роботи із зображенням
let image = new Image(); // Для збереження зображення
let rotation = 0; // Поточне обертання
let currentFilter = 'none'; // Поточний фільтр

// Навігація між секціями
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.menu-section');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Видалити клас active з усіх посилань і секцій
    navLinks.forEach(link => link.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));

    // Активувати вибрану секцію
    const targetSection = link.getAttribute('data-section');
    document.getElementById(targetSection).classList.add('active');
    link.classList.add('active');

    // Перемалювати зображення у новій секції
    drawMeme();
  });
});

// Завантаження зображення
const uploadImage = document.getElementById('upload-image');
uploadImage.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      image.src = reader.result; // Встановлюємо джерело зображення
    };
    reader.readAsDataURL(file); // Читаємо файл як Data URL
  }
});

// Малювання зображення на полотні
image.onload = () => {
  drawMeme(); // Малюємо зображення після його завантаження
};

function drawMeme() {
  // Очищення полотна
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Малювання зображення, якщо воно є
  if (image.src) {
    const imgWidth = image.width;
    const imgHeight = image.height;

    // Масштабування, щоб зображення вміщалося на полотні
    const scale = Math.min(canvas.width / imgWidth, canvas.height / imgHeight);
    const x = (canvas.width - imgWidth * scale) / 2;
    const y = (canvas.height - imgHeight * scale) / 2;

    ctx.save(); // Зберігаємо контекст
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180); // Додаємо обертання
    ctx.filter = currentFilter; // Додаємо фільтр
    ctx.drawImage(image, -imgWidth * scale / 2, -imgHeight * scale / 2, imgWidth * scale, imgHeight * scale);
    ctx.restore(); // Відновлюємо контекст
  }

  // Малювання тексту
  drawText();
}

// Додавання тексту
const topTextInput = document.getElementById('top-text');
const bottomTextInput = document.getElementById('bottom-text');
const textColorInput = document.getElementById('text-color');
const textSizeInput = document.getElementById('text-size');

[topTextInput, bottomTextInput, textColorInput, textSizeInput].forEach(input =>
  input.addEventListener('input', drawMeme)
);

function drawText() {
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

// Вибір формату полотна
const formatSelect = document.getElementById('format-select');
formatSelect.addEventListener('change', () => {
  const [width, height] = formatSelect.value.split('x').map(Number);
  canvas.width = width;
  canvas.height = height;
  drawMeme(); // Перемалювати мем після зміни розміру
});

// Обертання зображення
const rotateLeftBtn = document.getElementById('rotate-left');
const rotateRightBtn = document.getElementById('rotate-right');
rotateLeftBtn.addEventListener('click', () => {
  rotation -= 90;
  drawMeme();
});
rotateRightBtn.addEventListener('click', () => {
  rotation += 90;
  drawMeme();
});

// Скидання змін
const resetImageBtn = document.getElementById('reset-image');
resetImageBtn.addEventListener('click', () => {
  rotation = 0;
  currentFilter = 'none';
  drawMeme();
});

// Застосування фільтрів
const filterButtons = document.querySelectorAll('.filters button');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.getAttribute('data-filter');
    drawMeme();
  });
});

// Завантаження мему
const downloadBtn = document.getElementById('download-btn');
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL();
  link.click();
});
