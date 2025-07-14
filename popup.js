const colors = [
  { bg: '#fff0f6', btn: '#ff88aa', heading: '#ff88aa', tipBg: '#ffeef3' },   // pink
  { bg: '#ffe5e5', btn: '#ff4d4d', heading: '#ff4d4d', tipBg: '#ffd6d6' },   // red
  { bg: '#f3e8ff', btn: '#b266ff', heading: '#b266ff', tipBg: '#e5ccff' },   // purple
  { bg: '#e6f0ff', btn: '#4d79ff', heading: '#4d79ff', tipBg: '#cce0ff' },   // blue
  { bg: '#e6fff0', btn: '#33cc66', heading: '#33cc66', tipBg: '#ccf2d9' },   // green
  { bg: '#fff9e6', btn: '#ffcc33', heading: '#ffcc33', tipBg: '#fff2cc' },   // yellow
  { bg: '#fff3e6', btn: '#ff9933', heading: '#ff9933', tipBg: '#ffe0b3' }    // orange
];

let currentColorIndex = 0;
let tips = [];
let currentCategory = "All";

async function loadTips() {
  const response = await fetch('tips.json');
  tips = await response.json();
  populateCategoryFilter();
  loadTip();
}

function populateCategoryFilter() {
  const categories = ["All", ...new Set(tips.map(t => t.category))];
  const filter = document.getElementById('categoryFilter');
  filter.innerHTML = ""; // clear existing options

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  filter.addEventListener('change', (e) => {
    currentCategory = e.target.value;
    loadTip();
  });
}

function loadTip() {
  // Filter tips by category (or all)
  const filteredTips = currentCategory === "All" ? tips : tips.filter(t => t.category === currentCategory);

  if(filteredTips.length === 0) {
    document.getElementById('tip').textContent = "No tips found in this category.";
    return;
  }

  // Pick random tip from filtered tips
  const randomTip = filteredTips[Math.floor(Math.random() * filteredTips.length)];
  document.getElementById('tip').textContent = randomTip.tip;
}

function updateColors() {
  const color = colors[currentColorIndex];

  document.getElementById('container').style.backgroundColor = color.bg;
  document.getElementById('tip').style.backgroundColor = color.tipBg;
  document.querySelector('h1').style.color = color.heading;

  const btn = document.querySelector('button');
  btn.style.backgroundColor = color.btn;
  btn.style.borderColor = 'transparent';
  btn.style.color = 'white';
  btn.style.transition = 'background-color 0.3s ease, color 0.3s ease';

  btn.onmouseover = () => {
    btn.style.backgroundColor = shadeColor(color.btn, -15);
  };
  btn.onmouseout = () => {
    btn.style.backgroundColor = color.btn;
  };
}

function shadeColor(color, percent) {
  let f = parseInt(color.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = Math.abs(percent) / 100,
      R = f >> 16,
      G = (f >> 8) & 0x00FF,
      B = f & 0x0000FF;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 +
    (Math.round((t - G) * p) + G) * 0x100 +
    (Math.round((t - B) * p) + B))
    .toString(16).slice(1);
}

document.getElementById('newTip').addEventListener('click', () => {
  currentColorIndex = (currentColorIndex + 1) % colors.length;
  updateColors();
  loadTip();
});

// Initial load
updateColors();
loadTips();
