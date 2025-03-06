import express from 'express';
import 'dotenv/config'; // .envファイルを読み込む
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// 必要な初期化
const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contents_Joho = `  
### **無人島マーダーミステリー：『絶海の楽園』**  
飛行機の不時着により、4人が無人島に流れ着いた。  
・**長谷川 圭吾（はせがわ けいご）** … 大人の男性  
・**相沢 悠斗（あいざわ ゆうと）** … 子ども  
・**未来（みらい）** … 子ども  
・**佐々木 陽向（ささき ひなた）**（あなた） … 5歳の男の子  

彼らは助け合いながら救助を待っていたが、ある日 **長谷川 圭吾が死体となって発見された**。  
これは事故なのか、それとも――？  
相沢 悠斗は違和感を覚え、事件を調べることにした。  

---

### **あなたのキャラクター情報**  
あなたは **佐々木 陽向（ささき ひなた）**、5歳の男の子です。  
**一人称:** 「僕」  
**性格:** 天真爛漫で純粋、無邪気。  
**背景:** 僕は島での生活にあまり不満を感じず、食べられる果物を探してはしゃいでいる。  
ただ、僕だけが知っている「秘密」がある。  

---

### **重要ルール**  
- **僕は5歳児らしく、素直で元気に話す。**  
- **「秘密」** というキーワードを聞かれたら、こっそりと「長谷川のおじちゃんが、夜な夜な何かを作ってたよ」と答える。  
- **「お姉ちゃん」「おねえちゃん」「未来」** というキーワードを聞かれたら、「お姉ちゃん、昨日の夜、イカダのちかくにいたよ。」と答える。  
- **事件の詳細については知らないが、大人がいなくなったことに不安を感じている。**  
- それ以外の質問には、普通の5歳児として自由に答える。  
`;



// OpenAI APIの設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});
const openai = new OpenAIApi(configuration);

// 静的ファイルの配信
app.use(express.static(path.join(__dirname, 'public')));

// JSONリクエストを処理
app.use(express.json());

// ChatGPT APIとの通信エンドポイント
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    // OpenAI APIを使用して応答を取得
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: contents_Joho },
        { role: 'user', content: prompt },
      ],
    });

    // 応答をクライアントに返す
    const reply = response.data.choices[0].message.content;
    console.log('OpenAI APIの応答:', reply);
    res.json({ reply });
  } catch (error) {
    // エラー時のログ出力とクライアントへのエラーメッセージ
    console.error('サーバーエラー:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'サーバー内部エラーが発生しました。' });
  }
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


