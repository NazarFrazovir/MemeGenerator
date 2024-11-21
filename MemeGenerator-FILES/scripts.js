// Налаштування полотна
const canvas = document.getElementById('meme-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

// Перемінні для роботи із зображенням
let image = new Image(); // Для збереження зображення
let rotation = 0; // Поточне обертання зображення
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

    // Перемалювати мем у новій секції
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
    reader.readAsDataURL(file); // Читання файлу як Data URL
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

    // Отримуємо пікселі для обробки
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Малювання зображення
    ctx.drawImage(image, x, y, imgWidth * scale, imgHeight * scale);

    // Якщо фільтр не "none", застосовуємо обробку
    if (currentFilter !== 'none') {
        const filteredData = applyFilterManually(imageData, currentFilter);
        ctx.putImageData(filteredData, 0, 0);
      }

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

// --- Налаштування тексту ---

const topTextInput = document.getElementById('top-text');
const bottomTextInput = document.getElementById('bottom-text');
const textColorInput = document.getElementById('text-color');
const textSizeInput = document.getElementById('text-size');
const fontFamilySelect = document.getElementById('font-family');
const textOutlineCheckbox = document.getElementById('text-outline');
const textShadowCheckbox = document.getElementById('text-shadow');
const textOpacityRange = document.getElementById('text-opacity');
const textRotationInput = document.getElementById('text-rotation');

// Оновлення тексту в реальному часі
[topTextInput, bottomTextInput, textColorInput, textSizeInput, fontFamilySelect, 
 textOutlineCheckbox, textShadowCheckbox, textOpacityRange, textRotationInput].forEach(input => {
  input.addEventListener('input', drawMeme);
});

function drawText() {
  const textSize = parseInt(textSizeInput.value, 10);
  const fontFamily = fontFamilySelect.value;
  const textOpacity = parseFloat(textOpacityRange.value);
  const textRotation = parseInt(textRotationInput.value, 10);

  ctx.font = `${textSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = textColorInput.value;
  ctx.globalAlpha = textOpacity; // Прозорість тексту

  // Налаштування тіні
  if (textShadowCheckbox.checked) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  } else {
    ctx.shadowColor = 'transparent'; // Відключення тіні
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // Малювання верхнього тексту
  if (topTextInput.value.trim() !== '') {
    drawRotatedText(topTextInput.value.toUpperCase(), canvas.width / 2, textSize + 10, textRotation);
  }

  // Малювання нижнього тексту
  if (bottomTextInput.value.trim() !== '') {
    drawRotatedText(bottomTextInput.value.toUpperCase(), canvas.width / 2, canvas.height - 20, textRotation);
  }

  ctx.globalAlpha = 1; // Відновлення прозорості
}

// Функція для малювання тексту з обертанням
function drawRotatedText(text, x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);

  // Обведення тексту
  if (textOutlineCheckbox.checked) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.strokeText(text, 0, 0);
  }

  // Малювання тексту
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

// --- Редагування фото ---

const rotateLeftBtn = document.getElementById('rotate-left');
const rotateRightBtn = document.getElementById('rotate-right');
const resetImageBtn = document.getElementById('reset-image');
const filterButtons = document.querySelectorAll('.filters button');

// Обертання зображення
rotateLeftBtn.addEventListener('click', () => {
  rotation -= 90;
  drawMeme();
});
rotateRightBtn.addEventListener('click', () => {
  rotation += 90;
  drawMeme();
});

// Скидання змін
resetImageBtn.addEventListener('click', () => {
  rotation = 0;
  currentFilter = 'none';
  drawMeme();
});

// Застосування фільтрів
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.getAttribute('data-filter');
    drawMeme();
  });
});



// --- Завантаження готового мему ---

const downloadBtn = document.getElementById('download-btn');
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL();
  link.click();
});


function applyFilterManually(imageData, filter) {
  const data = imageData.data; // Отримуємо масив пікселів

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];     // Червоний
    const g = data[i + 1]; // Зелений
    const b = data[i + 2]; // Синій

    if (filter === 'grayscale') {
      // Чорно-білий фільтр
      const avg = (r + g + b) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    } else if (filter === 'sepia') {
      // Сепія
      data[i] = r * 0.393 + g * 0.769 + b * 0.189;
      data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
      data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
    } else if (filter === 'contrast') {
      // Контраст
      const factor = 2; // Рівень контрасту
      data[i] = truncate((r - 128) * factor + 128);
      data[i + 1] = truncate((g - 128) * factor + 128);
      data[i + 2] = truncate((b - 128) * factor + 128);
    } else if (filter === 'brightness') {
      // Яскравість
      const brightness = 50; // Додаткова яскравість
      data[i] += brightness;
      data[i + 1] += brightness;
      data[i + 2] += brightness;
    }
  }

  return imageData;
}

// Обмеження значення пікселів від 0 до 255
function truncate(value) {
  return Math.min(255, Math.max(0, value));
}

const themeToggleBtn = document.getElementById('theme-toggle');

// Перевірка збереженої теми в localStorage
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggleBtn.textContent = '🌜'; // Іконка для темної теми
} else {
  themeToggleBtn.textContent = '🌞'; // Іконка для світлої теми
}

// Подія для перемикання теми
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Збереження вибору теми у localStorage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    themeToggleBtn.textContent = '🌜'; // Іконка для темної теми
  } else {
    localStorage.setItem('theme', 'light');
    themeToggleBtn.textContent = '🌞'; // Іконка для світлої теми
  }
});

