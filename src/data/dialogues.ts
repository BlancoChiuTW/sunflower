import type { Dialogue } from '@/types/game'

export type DialogueLine = Dialogue

export const dialogues: Record<string, DialogueLine[]> = {
  // ============================================================
  // Chapter 1 — 危機爆發
  // ============================================================
  'chapter-1_intro': [
    {
      speaker: '旁白',
      text: '午後的向日葵學園一如往常。糾察隊長阿典正在西棟走廊例行巡邏，直到校內廣播突然響起。',
      portrait: '系統',
      position: 'right',
      background: 'bg_west_corridor',
      bgm: 'bgm_story_tense',
    },
    {
      speaker: '白狼校長',
      text: '『全校師生注意。基於董事會的緊急決議，本校即日起與赤星人民高校進行「無條件資源整合」。大門已開啟，請各位配合接管程序。』',
      portrait: '校長 (廣播)',
      position: 'right',
      sfx: 'radio_broadcast',
    },
    {
      speaker: '白狼校長',
      text: '『這是不可逆的進程。任何抵抗行為，將被視為妨礙校務，後果自負。』',
      portrait: '校長 (廣播)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '廣播斷訊的瞬間，校門方向傳來金屬柵欄被撞破的巨響。阿典的手機亮起——「林雅晴」。',
      portrait: '系統',
      position: 'right',
      sfx: 'gate_crash',
      effect: 'shake',
      cg: 'cg_gate_breach',
    },
    {
      speaker: '林雅晴',
      text: '阿典，聽到廣播了嗎？校長把學校賣了。赤星的人已經進來了，我正在機房鎖死核心伺服器。',
      portrait: '雅晴 (通訊)',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '你立刻到一樓西側樓梯口，用現有的桌椅架設阻絕線。在我完成資料隔離之前，那個位置不能失守。',
      portrait: '雅晴 (指揮)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '了解，位置已確認。西側樓梯口，我會撐住的。',
      portrait: '阿典 (冷靜)',
      position: 'left',
    },
    {
      speaker: '旁白',
      text: '走廊盡頭，紅色制服的身影已經開始湧入。阿典將課桌椅一張張堆疊成簡易路障，擋在了暴徒與學園之間。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '赤星噁男',
      text: '就一個人？還想擋路？兄弟們，給他點教訓。',
      portrait: '赤星學生',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '路障後面就是我的同學。想過去，先問過我的拳頭。',
      portrait: '阿典 (戰鬥)',
      position: 'left',
    },
  ],

  'chapter-1_outro': [
    {
      speaker: '旁白',
      text: '最後一名赤星學生被擊倒在路障前。走廊暫時恢復了安靜，但遠處仍有嘈雜聲傳來。',
      portrait: '系統',
      position: 'right',
      background: 'bg_west_corridor',
      bgm: 'bgm_story_tense',
    },
    {
      speaker: '阿典',
      text: '（撥通雅晴）西側樓梯已確保，暫時沒有後續波次。妳那邊怎樣？',
      portrait: '阿典 (通訊)',
      position: 'left',
    },
    {
      speaker: '林雅晴',
      text: '伺服器已隔離，但有個壞消息——二樓控制室的訊號斷了。萱萱在那裡值班。',
      portrait: '雅晴 (嚴肅)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '控制室？那裡管的是全校廣播和門禁系統。',
      portrait: '阿典 (思索)',
      position: 'left',
    },
    {
      speaker: '林雅晴',
      text: '沒錯。控制室失守的話，全校的通訊和門鎖都是他們說了算。我在機房脫不開身，你必須上去確認萱萱的狀況。',
      portrait: '雅晴 (焦急)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '明白。我走外側防火梯上去，避開正面走廊。',
      portrait: '阿典 (決心)',
      position: 'left',
    },
    {
      speaker: '林雅晴',
      text: '小心，二樓的狀況不明。我會盡快完成這邊的作業跟你會合。',
      portrait: '雅晴 (通訊)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '阿典翻過路障，朝側邊的防火梯跑去。鐵製樓梯在腳下發出沉重的回響。',
      portrait: '系統',
      position: 'right',
    },
  ],

  // ============================================================
  // Chapter 2 — 控制室救援
  // ============================================================
  'chapter-2_intro': [
    {
      speaker: '旁白',
      text: '二樓走廊的日光燈管忽明忽滅，空氣中瀰漫著說不上來的緊繃感。阿典從防火梯門後探出頭。',
      portrait: '系統',
      position: 'right',
      effect: 'light_flicker',
      background: 'bg_corridor_dark',
      bgm: 'bgm_story_tense',
    },
    {
      speaker: '林雅晴',
      text: '（從另一端低聲）阿典，我到了。控制室在走廊盡頭，門是關的，裡面至少有三個人的聲音。',
      portrait: '雅晴 (低語)',
      position: 'right',
    },
    {
      speaker: '赤星幹部',
      text: '（從門縫傳來）把廣播系統的密碼交出來，小妮子。還是說，需要我們用別的方式讓妳開口？',
      portrait: '赤星學生',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '……三個人。硬闖的話會讓萱萱有危險。',
      portrait: '阿典 (思索)',
      position: 'left',
    },
    {
      speaker: '林雅晴',
      text: '我用終端機觸發走廊的警報迴路，他們會分神。門開的瞬間你直接進去制壓。',
      portrait: '雅晴 (指揮)',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '準備好了嗎？三、二、一——',
      portrait: '雅晴 (指揮)',
      position: 'right',
      sfx: 'alarm_trigger',
      action: 'unlock_door',
    },
    {
      speaker: '旁白',
      text: '走廊警報聲大作，控制室的門鎖瞬間彈開。',
      portrait: '系統',
      position: 'right',
      effect: 'shake',
      background: 'bg_control_room',
    },
    {
      speaker: '阿典',
      text: '（踹門而入）萱萱，回報位置！',
      portrait: '阿典 (突入)',
      position: 'left',
      sfx: 'door_kick',
      cg: 'cg_door_breach',
    },
    {
      speaker: '陳萱萱',
      text: '學、學長！我在控制台後面！',
      portrait: '萱萱 (驚恐)',
      position: 'right',
    },
    {
      speaker: '赤星幹部',
      text: '什麼人！？兄弟們，攔住他！',
      portrait: '赤星學生',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '會長，我進去了。三個目標，現在解決。',
      portrait: '阿典 (戰鬥)',
      position: 'left',
    },
  ],

  'chapter-2_outro': [
    {
      speaker: '旁白',
      text: '最後一名赤星幹部倒在控制台旁，控制室回到了學園手中。',
      portrait: '系統',
      position: 'right',
      background: 'bg_control_room',
      bgm: 'bgm_story_tense',
    },
    {
      speaker: '阿典',
      text: '萱萱，沒受傷吧？',
      portrait: '阿典 (關心)',
      position: 'left',
    },
    {
      speaker: '陳萱萱',
      text: '我沒事... 他們沒拿到密碼。但是學長，你看監視器——',
      portrait: '萱萱 (焦急)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '監控畫面切到一樓大廳。赤星的主力部隊正在封鎖所有出入口，上百名女學生被困在裡面。畫面角落，一個扛著球棒的身影正獨自堵在大門前。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '那是乃蓉學姐... 她一個人擋在那裡！',
      portrait: '萱萱 (焦急)',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '（通訊接入）我也看到了。萱萱，妳留在控制室維持通訊，用廣播引導疏散。阿典，跟我走。',
      portrait: '雅晴 (指揮)',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '（拉住阿典的袖子，又迅速放開）......學長，一定要把大家平安帶回來。',
      portrait: '萱萱 (擔憂)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '會的。妳把校園的聲音接回來，剩下的交給我們。',
      portrait: '阿典 (決心)',
      position: 'left',
    },
  ],

  // ============================================================
  // Chapter 3 — 大廳解圍
  // ============================================================
  'chapter-3_intro': [
    {
      speaker: '旁白',
      text: '一樓大廳前，赤星暴徒將出入口堵得水洩不通。唯一還沒被攻破的，是體育部長王乃蓉用身體頂住的那扇正門。',
      portrait: '系統',
      position: 'right',
      background: 'bg_main_hall',
      bgm: 'bgm_story_tense',
      cg: 'cg_nairong_hold',
    },
    {
      speaker: '王乃蓉',
      text: '想過這道門，先踩過我。',
      portrait: '乃蓉 (死守)',
      position: 'right',
    },
    {
      speaker: '赤星噁男',
      text: '一個女的能撐多久？加把勁，給我撞開！',
      portrait: '赤星學生',
      position: 'right',
      effect: 'shake',
    },
    {
      speaker: '陳萱萱',
      text: '（廣播）阿典學長，乃蓉學姐在大廳正門，敵方約有八人從東西兩側包夾。通風管道的出口在她左後方十公尺。',
      portrait: '萱萱 (廣播)',
      position: 'right',
      sfx: 'radio_comm',
    },
    {
      speaker: '林雅晴',
      text: '阿典，從通風口繞到側翼，替乃蓉解圍。我從東側牽制另一半。',
      portrait: '雅晴 (指揮)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '收到。乃蓉，再撐一下，我馬上到。',
      portrait: '阿典 (戰鬥)',
      position: 'left',
    },
    {
      speaker: '王乃蓉',
      text: '少囉嗦，快點就是了！',
      portrait: '乃蓉 (喘息)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '阿典踹開通風口的鐵網，落在赤星暴徒的側翼。大廳的戰局開始逆轉。',
      portrait: '系統',
      position: 'right',
      sfx: 'vent_break',
      effect: 'shake',
    },
  ],

  'chapter-3_outro': [
    {
      speaker: '旁白',
      text: '大廳重新回到學園手中。王乃蓉放下頂住大門的肩膀，長長吐了一口氣。',
      portrait: '系統',
      position: 'right',
      background: 'bg_main_hall',
      bgm: 'bgm_story_tense',
    },
    {
      speaker: '王乃蓉',
      text: '遲到了十分鐘，糾察隊長。',
      portrait: '乃蓉 (不爽)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '抱歉，路上塞車。',
      portrait: '阿典 (苦笑)',
      position: 'left',
    },
    {
      speaker: '旁白',
      text: '雅晴從東側走來，萱萱的聲音也從天花板的廣播喇叭傳出。四人終於在同一條戰線上集結。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '（將一張門禁卡遞給阿典）這是校長室的電子鎖權限。我從機房的備份系統裡撈出來的。所有黑箱協議的原件都在那間辦公室裡。',
      portrait: '雅晴 (嚴肅)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '拿到原件，一切就能攤在陽光下。',
      portrait: '阿典 (決心)',
      position: 'left',
    },
    {
      speaker: '王乃蓉',
      text: '（扛起球棒）廢話講夠了沒？走吧，去把那扇門踹開。',
      portrait: '乃蓉 (決心)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '四人的腳步聲在樓梯間迴盪，目標只有一個——頂樓校長室。',
      portrait: '系統',
      position: 'right',
    },
  ],

  // ============================================================
  // Chapter 4 — 最終決戰
  // ============================================================
  'chapter-4_intro': [
    {
      speaker: '旁白',
      text: '頂樓。校長室的紅木大門近在眼前，門縫透出昏黃的燈光。走廊的廣播忽然再度響起。',
      portrait: '系統',
      position: 'right',
      background: 'bg_principal_office',
      bgm: 'bgm_story_tense',
    },
    {
      speaker: '白狼校長',
      text: '『還在反抗啊？年輕人的理想真讓人感動——不，應該說是「自我感動」。你們改變不了任何事。這個世界從來都是服從者活下去。』',
      portrait: '校長 (廣播)',
      position: 'right',
      sfx: 'radio_broadcast',
    },
    {
      speaker: '林雅晴',
      text: '（攥緊拳頭，指節泛白）你這個出賣學生的——',
      portrait: '雅晴 (震怒)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '（一把按住雅晴的肩膀）冷靜點。他在激你。衝動進去正中他下懷。',
      portrait: '阿典 (冷靜)',
      position: 'left',
    },
    {
      speaker: '阿典',
      text: '我們的目標是拿到合併協議的原件。拿到證據，他就什麼都不是了。',
      portrait: '阿典 (戰鬥)',
      position: 'left',
    },
    {
      speaker: '林雅晴',
      text: '（深吸一口氣）……你說得對。門禁卡給我。',
      portrait: '雅晴 (冷靜)',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '（廣播）校長室內確認兩名重裝保安，校長本人在辦公桌後方。門禁解除倒數——三、二、一。',
      portrait: '萱萱 (廣播)',
      position: 'right',
      sfx: 'electronic_lock',
      action: 'unlock_principal_door',
    },
    {
      speaker: '旁白',
      text: '電子鎖彈開，紅木大門在四人的合力下被撞開。昂貴的古董在衝擊波中搖晃。',
      portrait: '系統',
      position: 'right',
      effect: 'shake',
      sfx: 'door_break',
    },
    {
      speaker: '白狼校長',
      text: '哼，來了啊。保安，處理掉這幾個不聽話的孩子。',
      portrait: '校長 (冷笑)',
      position: 'right',
    },
    {
      speaker: '王乃蓉',
      text: '處理？你那兩個保鑣加起來都不夠我熱身的。',
      portrait: '乃蓉 (戰鬥)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '各就各位。這是最後一戰了。',
      portrait: '阿典 (決心)',
      position: 'left',
    },
  ],

  'chapter-4_outro': [
    {
      speaker: '旁白',
      text: '最後一名保安倒地。白狼校長面如死灰，手指顫抖地伸向桌下的暗門開關。',
      portrait: '系統',
      position: 'right',
      background: 'bg_principal_office',
      bgm: 'bgm_story_tense',
    },
    {
      speaker: '白狼校長',
      text: '你們什麼都證明不了... 這間辦公室裡什麼都沒有！',
      portrait: '校長 (驚恐)',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '（舉起從保險櫃中取出的文件夾）「向日葵學園無條件合併移交協議書——正本」。白狼，你簽的每一個字，現在都是呈堂證供。',
      portrait: '雅晴 (勝利)',
      position: 'right',
      cg: 'cg_evidence',
    },
    {
      speaker: '旁白',
      text: '白狼校長猛地按下暗門開關，跌跌撞撞地鑽入密道。鐵門在身後轟然關閉。',
      portrait: '系統',
      position: 'right',
      sfx: 'secret_door',
    },
    {
      speaker: '王乃蓉',
      text: '跑了！要追嗎？',
      portrait: '乃蓉 (焦急)',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '不必。證據在我們手上，他跑不出這座城市。（看向阿典）……謝謝你一直站在我身邊。',
      portrait: '雅晴 (微笑)',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '（通訊傳來帶著哭腔的聲音）學長... 結束了嗎？下次遇到危險，你還會來找我嗎？',
      portrait: '萱萱 (釋然)',
      position: 'right',
    },
    {
      speaker: '王乃蓉',
      text: '（扛著球棒靠在門框上）別搞得好像大結局一樣。外面還有一整個操場的赤星殘黨，正式開打在後面呢。',
      portrait: '乃蓉 (微笑)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '她說得對。走吧——天快亮了。',
      portrait: '阿典 (微笑)',
      position: 'left',
    },
  ],

  // ============================================================
  // Chapter 5 — 黎明大決戰
  // ============================================================
  'chapter-5_intro': [
    {
      speaker: '旁白',
      text: '一樓校門廣場前，赤星高校的主力部隊如同黑色的海洋般將出入口封鎖。阿典與雅晴站在台階上，面對著數倍於己的敵人，氣氛緊張到了頂點。',
      portrait: '系統',
      position: 'right',
      background: 'bg_gate_night',
      bgm: 'bgm_story_tense',
    },
    {
      speaker: '阿典',
      text: '這數量... 真的能贏嗎？',
      portrait: '阿典 (絕望)',
      position: 'left',
    },
    {
      speaker: '林雅晴',
      text: '糾察隊長，挺起胸膛！學生會的旗幟還在飄揚，我們就沒有失敗！',
      portrait: '雅晴 (決死)',
      position: 'left',
    },
  ],

  'chapter-5_event': [
    {
      speaker: '系統提示',
      text: '（突然間，校園內所有的廣播喇叭重新響起，這次是宏亮的、充滿希望的向日葵學園校歌）',
      portrait: '系統',
      position: 'right',
      sfx: 'school_anthem',
      bgm: 'bgm_dawn_rally',
      background: 'bg_gate_dawn',
      cg: 'cg_dawn_rally',
    },
    {
      speaker: '陳萱萱',
      text: '『全體向日葵的同學們！聽得到嗎？我們的會長正在戰鬥！阿典學長正在戰鬥！』',
      portrait: '萱萱 (廣播)',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '『現在，拿起你們的武器！為了學園的尊嚴，為了我們共同的未來... 全校反擊開始！！』',
      portrait: '萱萱 (廣播)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '教學大樓的燈火瞬間全開。王乃蓉揮舞著球棒，率領著成百上千名拿著掃把、圓規、甚至鐵鍬的學生，如潮水般湧入廣場。',
      portrait: '系統',
      position: 'right',
      effect: 'shake',
    },
    {
      speaker: '王乃蓉',
      text: '大家聽到了嗎？這才是我們向日葵學園的骨氣！阿典，接好了，全校的怒火！',
      portrait: '乃蓉 (決心)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '赤星的人，這就是惹怒向日葵學園的下場！大家一起上！！',
      portrait: '阿典 (戰鬥)',
      position: 'left',
    },
    {
      speaker: '旁白',
      text: '沒有超能力，只有純粹的憤怒與守護家園的決心。阿典帶頭衝鋒，配合學生們的人海戰術，瞬間衝垮了赤星暴徒的陣線。',
      portrait: '系統',
      position: 'right',
      action: 'dawn_light_buff',
    },
  ],

  'chapter-5_outro': [
    {
      speaker: '旁白',
      text: '隨著第一縷晨曦灑在校門口，赤星高校的殘黨紛紛潰逃。白狼校長在逃亡途中被警方攔截捕獲。向日葵學園，守住了。',
      portrait: '系統',
      position: 'right',
      bgm: 'bgm_dawn_theme',
      background: 'bg_gate_dawn',
    },
    {
      speaker: '林雅晴',
      text: '清晨了... 好溫暖的陽光。阿典，我們... 真的做到了。',
      portrait: '雅晴 (微笑)',
      position: 'right',
    },
    {
      speaker: '王乃蓉',
      text: '下次要是再有人敢打這所學園的主意，我第一個上。',
      portrait: '乃蓉 (微笑)',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '能讓全校聽到希望的聲音... 這是我做過最有意義的一次廣播。',
      portrait: '萱萱 (微笑)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '向日葵學園的大家，辛苦了。天亮了，我們回家吧。',
      portrait: '阿典 (微笑)',
      position: 'left',
    },
    {
      speaker: '系統提示',
      text: '感謝您遊玩《向日葵學園:反併吞行動》DEMO！全劇情通關！',
      portrait: '系統',
      position: 'right',
      effect: 'fade_out',
    },
  ],

  // ============================================================
  // H-SCENE — Chapter 2 戰敗：萱萱陷落
  // ============================================================
  'chapter-2_defeat': [
    {
      speaker: '旁白',
      text: '阿典倒在走廊上，意識逐漸模糊。控制室的門被重新鎖上，裡面傳來萱萱的尖叫聲。',
      portrait: '系統',
      position: 'right',
      background: 'bg_control_room',
      bgm: 'bgm_story_tense',
    },
    {
      speaker: '赤星幹部',
      text: '沒人來救妳了，小妮子。現在乖乖把密碼交出來——不然就用別的方法讓妳開口。',
      portrait: '赤星學生',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '不要... 不要碰我...！',
      portrait: '萱萱 (驚恐)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '幹部將萱萱壓在控制台上，粗暴地扯開她的制服衣領。萱萱的掙扎在三人的鉗制下顯得毫無意義。',
      portrait: '系統',
      position: 'right',
      cg: 'cg_defeat_xuanxuan',
    },
    {
      speaker: '赤星幹部',
      text: '嘖，皮膚真嫩啊。放輕鬆點，把密碼告訴哥哥就沒事了。',
      portrait: '赤星學生',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '嗚... 不要... 啊——（粗糙的手掌覆上胸口，手指隔著內衣用力揉捏）',
      portrait: '萱萱 (屈辱)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '萱萱緊咬下唇，淚水無聲地滑落。監控螢幕映照著她扭曲的倒影，廣播系統的密碼鍵盤就在她被按住的手旁。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '（在心裡吶喊）學長... 你答應過... 要帶大家平安回去的...',
      portrait: '萱萱 (屈辱)',
      position: 'right',
    },
    {
      speaker: '系統提示',
      text: '控制室已失守。向日葵學園的通訊命脈落入赤星手中。',
      portrait: '系統',
      position: 'right',
      effect: 'fade_out',
    },
  ],

  // ============================================================
  // H-SCENE — Chapter 2 勝利福利：萱萱・控制室獨處
  // ============================================================
  'chapter-2_reward': [
    {
      speaker: '旁白',
      text: '雅晴離開去偵查樓下情況後，控制室安靜了下來。只剩監控螢幕的微光，映照著蜷縮在角落的萱萱。',
      portrait: '系統',
      position: 'right',
      background: 'bg_control_room',
      bgm: 'bgm_intimate',
    },
    {
      speaker: '陳萱萱',
      text: '（聲音很小）學長... 他們剛才... 差一點就...（身體還在微微發抖）',
      portrait: '萱萱 (羞澀)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '（把外套披在她肩上）沒事了，我在這裡。',
      portrait: '阿典 (關心)',
      position: 'left',
    },
    {
      speaker: '旁白',
      text: '萱萱抓住阿典的手，不肯放開。指尖冰涼且顫抖，阿典將她輕輕攬入懷中。她的臉貼著他的胸口，呼吸逐漸變得不均勻。',
      portrait: '系統',
      position: 'right',
      cg: 'cg_reward_xuanxuan',
    },
    {
      speaker: '陳萱萱',
      text: '學長的心跳... 好快... 我的也是...',
      portrait: '萱萱 (羞澀)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '阿典的手指拂過她的臉頰，拭去殘留的淚痕。萱萱仰起頭，嘴唇微張，兩人的距離比呼吸還近。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '嗯...（嘴唇輕觸，像是確認對方存在般的吻。她的手攀上阿典的肩膀，身體不自覺地貼了上去）',
      portrait: '萱萱 (喘息)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '阿典的手掌從她的肩膀緩緩滑下，隔著單薄的制服感受到她急促的心跳。萱萱沒有閃躲，反而輕輕將他的手往下引。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '不要停... 我想確認... 自己還活著...（纖細的手指沿著阿典的胸口緩緩下滑，解開他的腰帶）',
      portrait: '萱萱 (喘息)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '萱萱跪了下來。微微顫抖的嘴唇帶著緊張的溫度，輕輕貼了上去。笨拙的，卻帶著不願放手的執著。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '嗯... 唔...（模糊而黏膩的聲音）我... 第一次... 做得好嗎...？',
      portrait: '萱萱 (沉醉)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '（手指穿過她的髮絲）... 嗯。',
      portrait: '阿典 (微笑)',
      position: 'left',
    },
    {
      speaker: '旁白',
      text: '控制室的門鎖亮著綠燈，走廊外的世界暫時被隔絕在外。片刻之後，萱萱靠在阿典的肩膀上，臉頰還泛著紅暈。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '陳萱萱',
      text: '（小聲）...下次遇到危險，你一定要第一個來找我喔。',
      portrait: '萱萱 (微笑)',
      position: 'right',
    },
  ],

  // ============================================================
  // H-SCENE — Chapter 3 戰敗：乃蓉陷落
  // ============================================================
  'chapter-3_defeat': [
    {
      speaker: '旁白',
      text: '防線徹底崩潰。乃蓉的球棒被踢飛，她被四名暴徒按倒在禮堂地板上，體力早已耗盡。',
      portrait: '系統',
      position: 'right',
      background: 'bg_main_hall',
      bgm: 'bgm_story_tense',
    },
    {
      speaker: '赤星噁男',
      text: '剛才那麼兇，現在呢？體育部長大人？',
      portrait: '赤星學生',
      position: 'right',
    },
    {
      speaker: '王乃蓉',
      text: '（咬牙）放開... 我...！',
      portrait: '乃蓉 (喘息)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '暴徒將乃蓉的雙手反扣在背後，另一人粗暴地拉開她運動外套的拉鍊。被汗水浸濕的運動內衣貼在身上，勾勒出飽滿的曲線。',
      portrait: '系統',
      position: 'right',
      cg: 'cg_defeat_nairong',
    },
    {
      speaker: '赤星噁男',
      text: '嘖嘖，練體育的果然料好。兄弟們好好享受一下「戰利品」。',
      portrait: '赤星學生',
      position: 'right',
    },
    {
      speaker: '王乃蓉',
      text: '嗚——！（粗糙的手掌從腰際竄入，用力揉搓她的胸部）... 混帳... 我殺了你們...！',
      portrait: '乃蓉 (屈辱)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '乃蓉拼命掙扎，但被耗盡的四肢無力反抗。她將臉埋在手臂裡，不讓對方看見自己的表情。身後是蹲在角落瑟瑟發抖的學生們。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '王乃蓉',
      text: '（在心裡怒吼）糾察隊長... 你到底在哪裡......！',
      portrait: '乃蓉 (屈辱)',
      position: 'right',
    },
    {
      speaker: '系統提示',
      text: '大廳防線已全面淪陷。被困的學生無路可逃。',
      portrait: '系統',
      position: 'right',
      effect: 'fade_out',
    },
  ],

  // ============================================================
  // H-SCENE — Chapter 3 勝利福利：乃蓉・樓梯間
  // ============================================================
  'chapter-3_reward': [
    {
      speaker: '旁白',
      text: '前往頂樓的途中，乃蓉注意到阿典右手臂的擦傷一直在滲血。她二話不說把他拉進了樓梯間的轉角。',
      portrait: '系統',
      position: 'right',
      background: 'bg_west_corridor',
      bgm: 'bgm_intimate',
    },
    {
      speaker: '王乃蓉',
      text: '站好別動。（從口袋掏出繃帶，動作意外地輕柔）真是的，自己都在流血了還逞什麼英雄。',
      portrait: '乃蓉 (不爽)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '妳一個人擋了那麼久，不也是在逞英雄？',
      portrait: '阿典 (苦笑)',
      position: 'left',
    },
    {
      speaker: '王乃蓉',
      text: '（手指一頓）... 那不一樣。（低下頭，聲音變小）你要是倒了，誰來帶頭？',
      portrait: '乃蓉 (羞紅)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '包紮的手指不知何時停了下來。兩人靠得很近，乃蓉的呼吸帶著運動後的熱度撲在阿典的手臂上。',
      portrait: '系統',
      position: 'right',
      cg: 'cg_reward_nairong',
    },
    {
      speaker: '阿典',
      text: '（視線下移——乃蓉外套的拉鍊不知何時滑了下來，運動內衣被汗水浸透，幾乎是半透明的）',
      portrait: '阿典 (冷靜)',
      position: 'left',
    },
    {
      speaker: '王乃蓉',
      text: '（順著他的視線低頭，臉瞬間漲紅）看、看哪裡呢你——！',
      portrait: '乃蓉 (羞紅)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '乃蓉下意識要拉上拉鍊，卻被阿典握住了手。她瞪大眼睛，卻沒有甩開。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '王乃蓉',
      text: '（聲音發抖）... 你幹嘛... 笨蛋...',
      portrait: '乃蓉 (羞紅)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '阿典的手掌從她的鎖骨緩緩滑下，指尖掀開濕透的布料邊緣。乃蓉咬住下唇，身體微微僵硬，卻將背靠上了牆壁。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '王乃蓉',
      text: '哈啊...（手指揉上柔軟的頂端時，一聲壓抑不住的喘息從齒縫洩出）... 你、你輕一點... 笨蛋...',
      portrait: '乃蓉 (沉醉)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '樓梯間的迴音放大了每一聲細微的喘息。乃蓉的手攥著阿典的衣領，指節因為用力而泛白——卻不是在推開他。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '王乃蓉',
      text: '（額頭抵著他的肩膀，聲音帶著鼻音）... 打完這一仗... 你要負責。聽到沒有。',
      portrait: '乃蓉 (沉醉)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '... 收到。',
      portrait: '阿典 (微笑)',
      position: 'left',
    },
  ],

  // ============================================================
  // H-SCENE — Chapter 4 戰敗：雅晴陷落
  // ============================================================
  'chapter-4_defeat': [
    {
      speaker: '旁白',
      text: '阿典被重裝保安擊倒，失去了意識。等他模糊地睜開眼時，看到的是令人窒息的畫面。',
      portrait: '系統',
      position: 'right',
      background: 'bg_principal_office',
      bgm: 'bgm_story_tense',
    },
    {
      speaker: '白狼校長',
      text: '林同學，妳很聰明，比這些只會用拳頭的蠢貨強多了。可惜啊，聰明人不一定做得了聰明的選擇。',
      portrait: '校長 (冷笑)',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '（雙手被保安反扣在辦公桌上）你... 不會得逞的...！',
      portrait: '雅晴 (震怒)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '白狼校長示意保安。粗暴的手撕開了雅晴的制服上衣，鈕扣崩落在紅木地板上。她白皙的肌膚暴露在辦公室昏黃的燈光下。',
      portrait: '系統',
      position: 'right',
      cg: 'cg_defeat_yaqing',
    },
    {
      speaker: '白狼校長',
      text: '把合併協議的備份位置告訴我——不然，我的保安們可不像我這麼有耐心。',
      portrait: '校長 (冷笑)',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '嗚——！（保安的手掌粗暴地覆上她的胸口，用力揉捏）... 做夢...！我什麼都... 不會說...！',
      portrait: '雅晴 (屈辱)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '雅晴死死咬住嘴唇，鮮血順著唇角滲出。即便如此，她的眼神始終沒有屈服。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '（與模糊中的阿典對上視線，無聲地說）... 對不起... 我沒能守住...',
      portrait: '雅晴 (屈辱)',
      position: 'right',
    },
    {
      speaker: '系統提示',
      text: '校長室突襲失敗。合併協議的原件永遠沉入了黑暗中。',
      portrait: '系統',
      position: 'right',
      effect: 'fade_out',
    },
  ],

  // ============================================================
  // H-SCENE — Chapter 4 勝利福利：雅晴・校長室獨處
  // ============================================================
  'chapter-4_reward': [
    {
      speaker: '旁白',
      text: '乃蓉帶著萱萱先去確認撤離路線。校長室只剩下阿典和雅晴，以及被打得一片狼藉的昂貴家具。',
      portrait: '系統',
      position: 'right',
      background: 'bg_principal_office',
      bgm: 'bgm_intimate',
    },
    {
      speaker: '林雅晴',
      text: '（將證據文件收入背包，手指微微顫抖）... 拿到了。真的拿到了。',
      portrait: '雅晴 (微笑)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '妳從一開始就計劃到這一步了吧。',
      portrait: '阿典 (微笑)',
      position: 'left',
    },
    {
      speaker: '林雅晴',
      text: '（轉過身，月光從窗戶照進來）計劃裡只有作戰步驟。（停頓）......沒有你一直陪在身邊這件事。',
      portrait: '雅晴 (動搖)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '雅晴摘下眼鏡放在桌上，揉了揉發酸的鼻梁。沒有鏡片阻隔的雙眼裡，映著阿典的倒影。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '你知道嗎，當學生會長的這三年，所有人都叫我「林會長」。只有你... 從頭到尾都叫我雅晴。',
      portrait: '雅晴 (動搖)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '阿典走上前，拉住了她的手。雅晴沒有退後——反而踮起腳，將嘴唇貼了上來。',
      portrait: '系統',
      position: 'right',
      cg: 'cg_reward_yaqing',
    },
    {
      speaker: '林雅晴',
      text: '嗯...（指尖扣緊他的後頸，吻從輕柔變得急切。壓抑了太久的情緒在這一刻決堤。）',
      portrait: '雅晴 (喘息)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '阿典的手掌從她的腰際上移，指尖解開制服最上面的鈕扣。雅晴輕顫了一下，卻主動拉著他的手繼續往下。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '哈啊...（他的手掌覆上她的胸口時，一聲綿長的喘息從喉間溢出）... 阿典... 再靠近一點...',
      portrait: '雅晴 (喘息)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '月光下，雅晴靠在辦公桌邊緣，制服半敞，頭微微後仰。阿典的嘴唇從她的耳垂一路吻到鎖骨，手指在柔軟的曲線上流連。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '唔... 嗯啊...（咬住自己的手指壓抑聲音）... 不行... 會被聽到...',
      portrait: '雅晴 (沉醉)',
      position: 'right',
    },
    {
      speaker: '阿典',
      text: '（低聲）那就讓他們聽到。',
      portrait: '阿典 (微笑)',
      position: 'left',
    },
    {
      speaker: '林雅晴',
      text: '（輕輕打了他一下，臉紅到耳根）... 笨蛋。（但手指扣得更緊了）',
      portrait: '雅晴 (沉醉)',
      position: 'right',
    },
    {
      speaker: '旁白',
      text: '窗外，天邊泛起了第一抹魚肚白。兩人交纏的影子投在校長室的牆壁上，像是在黎明前寫下了只屬於彼此的注腳。',
      portrait: '系統',
      position: 'right',
    },
    {
      speaker: '林雅晴',
      text: '（整理好衣領，重新戴上眼鏡）......走吧。最後一場仗了。（嘴角帶著藏不住的笑意）',
      portrait: '雅晴 (微笑)',
      position: 'right',
    },
  ],
}
