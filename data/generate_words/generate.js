import axios from 'axios';
import fs from 'fs';
import translate from '@iamtraction/google-translate';

const TOPICS = [
  'Thực vật','Đời sống','Sức khoẻ','Ẩm thực','Sự vật','Động vật','Kỹ năng',
  'Công nghệ','Con người','Công việc','Giải trí','Sở thích','Thể thao',
  'Du lịch','Quốc gia','Màu sắc','Tín ngưỡng','Thú vị','TOEIC','IELTS',
  'Thiên nhiên','Mối quan hệ','Trang phục','Giáo dục','Khác'
];
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TYPES = ['n', 'v', 'adj', 'adv'];
const OUTPUT_FILE = 'words_10000.json';
const API_WORD = 'https://api.datamuse.com/words?ml=';

async function fetchWords(seed, limit = 400) {
  try {
    const res = await axios.get(`${API_WORD}${seed}`);
    return res.data.slice(0, limit).map(w => w.word);
  } catch {
    console.log(`⚠️ Lỗi khi tải chủ đề "${seed}"`);
    return [];
  }
}

async function translateWord(word) {
  try {
    const res = await translate(word, { from: 'en', to: 'vi' });
    return res.text;
  } catch (err) {
    console.log('⚠️ Lỗi dịch:', word);
    return '';
  }
}

async function generateData() {
  const topicSeeds = [
    'tree','life','health','food','object','animal','skill','technology',
    'human','job','entertainment','hobby','sport','travel','country',
    'color','faith','fun','exam','ielts','nature','family','clothes','education','other'
  ];

  let words = [];

  for (let i = 0; i < topicSeeds.length; i++) {
    const seed = topicSeeds[i];
    console.log(`🌱 Đang tải dữ liệu cho chủ đề: ${TOPICS[i]}...`);
    const fetched = await fetchWords(seed, 100);

    for (const word of fetched) {
      const mean = await translateWord(word);
      words.push({
        word,
        mean,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        level: LEVELS[Math.floor(Math.random() * LEVELS.length)],
        phonetic: '',
        examples: [`Example sentence using ${word}.`],
        picture: '',
        specialty: '0',
        topics: [String(i)],
        synonyms: [],
        antonyms: [],
      });
      console.log(`🔤 ${word} → ${mean}`);
      await new Promise(resolve => setTimeout(resolve, 200)); // tránh bị Google chặn
    }
  }

  words = words.sort(() => Math.random() - 0.5).slice(0, 10000);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(words, null, 2), 'utf8');
  console.log(`✅ Đã tạo file ${OUTPUT_FILE} với ${words.length} từ`);
}

generateData();
