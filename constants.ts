
import { Faction, Question, MapLocation } from './types';

// Map Dimensions
export const MAP_WIDTH = 2000;
export const MAP_HEIGHT = 1500;

// SVG Paths
export const CONTINENT_PATH = "M 400 300 Q 600 200 800 350 T 1200 300 Q 1500 200 1600 500 T 1500 900 Q 1400 1200 1000 1100 T 500 1000 Q 200 800 400 300 Z M 1650 400 Q 1800 300 1850 500 T 1700 600 Z";
export const RIVER_PATHS = [
    "M 800 350 Q 850 500 900 600 T 1100 800", // River 1
    "M 1000 1100 Q 1050 900 1200 850", // River 2
    "M 500 1000 Q 600 800 550 600" // River 3
];

// Locations (Visual markers)
export const DEFAULT_MAP_LOCATIONS: MapLocation[] = [
  // --- Central Region ---
  { id: 'loc_capital', name: '王都奥斯加德', type: 'RUIN', x: 0, y: 0 },
  { id: 'loc_bridge', name: '断罪大桥', type: 'RUIN', x: 80, y: 40 },
  { id: 'loc_crossroads', name: '绞刑架路口', type: 'TOWN', x: -50, y: -20 },
  
  // --- North ---
  { id: 'loc_rift', name: '大裂隙', type: 'MOUNTAIN', x: 30, y: -300 },
  { id: 'loc_mt_frozen', name: '霜巨人之脊', type: 'MOUNTAIN', x: -120, y: -240 },
  { id: 'loc_north_post', name: '守夜人哨站', type: 'TOWN', x: -60, y: -180 },
  
  // --- East ---
  { id: 'loc_nox', name: '诺克斯地下城', type: 'CITY', x: 300, y: 90 },
  { id: 'loc_black_market', name: '黑潮港口', type: 'CITY', x: 390, y: 60 },
  { id: 'loc_fog_swamp', name: '迷雾沼泽', type: 'FOREST', x: 240, y: 30 },
  
  // --- West ---
  { id: 'loc_spire', name: '苍白尖塔', type: 'CITY', x: -300, y: -60 },
  { id: 'loc_library', name: '禁忌书库', type: 'RUIN', x: -240, y: 0 },
  { id: 'loc_mirror_lake', name: '镜湖', type: 'WATER', x: -360, y: 60 },
  
  // --- South ---
  { id: 'loc_fortress', name: '最后的堡垒', type: 'CITY', x: 60, y: 240 },
  { id: 'loc_aethel', name: '艾瑟尔流沙', type: 'DESERT', x: -150, y: 300 },
  { id: 'loc_obelisk', name: '轮回方尖碑', type: 'RUIN', x: -180, y: 360 },
];

// Default Data (Used if LocalStorage is empty)
export const FACTIONS: Faction[] = [
  {
    id: 'fallen',
    name: '神陨者',
    englishName: 'The Fallen Ones',
    description: '那些曾经是神祇或曾经是神明信徒的存在。虽然堕入黑暗，但他们依然试图寻找救赎或者终结自己的命运。他们在这个破碎的世界中游荡，寻找着能够承载神力的躯壳。',
    shortDesc: '旧神遗孤，渴望复活与混沌。',
    philosophy: '复活的神祇需要“神之婚配”，秩序需在混沌中重铸。',
    color: '#9333ea', 
    coordinates: { x: 30, y: -270, z: 20 },
    characters: [
      { 
        id: 'c_fallen_1', 
        name: '莫尔戈斯 (Morgoth)', 
        title: '堕落古神', 
        description: '一位被遗忘的古老神祇，如今只剩下破碎的灵魂在深渊中低语。他的肉体早已腐烂，但他的意志依然能够扭曲现实。', 
        imageSeed: 101, 
        isLeader: true,
        stats: { might: 95, scheme: 40, sanity: 5 },
        tags: ['古神', '不死', '混沌'],
        relics: ['破碎的神格', '虚空锁链'],
        secret: '他其实渴望的不是复活，而是彻底的死亡，但诅咒令他求死不能。'
      },
      { 
        id: 'c_fallen_2', 
        name: '莉莉丝 (Lilith)', 
        title: '黑翼圣女', 
        description: '黑翼教团的狂热领导者，坚信自己是神选的新娘。她用自己的鲜血喂养祭坛上的神像。', 
        imageSeed: 102,
        stats: { might: 30, scheme: 85, sanity: 20 },
        tags: ['狂信徒', '魅惑', '献祭者'],
        relics: ['黑翼羽毛', '圣杯'],
        secret: '她并非神选之人，所有的神谕都是她为了掌控教团而编造的谎言。'
      }
    ]
  },
  {
    id: 'nobility',
    name: '旧日贵族',
    englishName: 'Remnants of Nobility',
    description: '曾经的王族、贵族和骑士，如今沦为流亡者。他们依然梦想复兴自己的王国，在废墟中擦拭着生锈的徽章。',
    shortDesc: '流亡王权，恪守荣耀与复仇。',
    philosophy: '血统与秩序是重建文明的基石。',
    color: '#ca8a04',
    coordinates: { x: 60, y: 240, z: 20 },
    characters: [
      { 
        id: 'c_noble_1', 
        name: '洛维安 (Luvian)', 
        title: '流亡王子', 
        description: '帝国的最后一位王子，在黑市中积蓄力量。他学会了像商人一样讨价还价，但眼神中依然燃烧着王者的骄傲。', 
        imageSeed: 201, 
        isLeader: true,
        stats: { might: 60, scheme: 80, sanity: 70 },
        tags: ['王室血脉', '复仇者', '战略家'],
        relics: ['断裂的权杖', '先王印章'],
        secret: '为了换取复国的军队，他已经将灵魂的一半抵押给了暗影会。'
      },
      { 
        id: 'c_noble_2', 
        name: '纳西拉 (Nashira)', 
        title: '银月骑士长', 
        description: '忠诚于旧日誓言的女骑士，统领着银月联盟的残部。她的剑从未迟疑，但她的心充满了迷茫。', 
        imageSeed: 202,
        stats: { might: 90, scheme: 30, sanity: 60 },
        tags: ['骑士精神', '忠诚', '剑圣'],
        relics: ['银月巨剑', '誓言指环'],
        secret: '她爱上了洛维安王子，但她知道这份感情会成为复国路上的绊脚石。'
      }
    ]
  },
  {
    id: 'scholars',
    name: '禁忌学会',
    englishName: 'Forbidden Scholars',
    description: '研究神明遗留下的禁忌知识，探索未知。试图通过解析“裂隙”来掌控神的力量，不惜通过人体实验来获取数据。',
    shortDesc: '理智边缘，窥探真理与疯狂。',
    philosophy: '知识没有善恶，只有力量与代价。',
    color: '#2563eb',
    coordinates: { x: -300, y: -60, z: 20 },
    characters: [
      { 
        id: 'c_scholar_1', 
        name: '伊利亚斯 (Elias)', 
        title: '背誓大贤者', 
        description: '曾是虔诚的牧师，在目睹神陨后背叛信仰。现在他相信，神只不过是更高等的生物，可以被解剖和复制。', 
        imageSeed: 301, 
        isLeader: true,
        stats: { might: 20, scheme: 95, sanity: 40 },
        tags: ['异端', '学者', '炼金术师'],
        relics: ['全视之眼', '人皮书卷'],
        secret: '他的左眼早已被替换成了某种古神的眼球，这让他能看到常人看不见的东西。'
      },
      { 
        id: 'c_scholar_2', 
        name: '薇尔娜 (Verna)', 
        title: '星尘议员', 
        description: '沉迷于星象与虚空的研究者。她经常对着夜空自言自语，记录着星星的尖叫。', 
        imageSeed: 302,
        stats: { might: 10, scheme: 70, sanity: 15 },
        tags: ['占星术士', '灵媒', '疯癫'],
        relics: ['星盘', '虚空水晶'],
        secret: '她其实早已死了，现在维持她行动的，是体内寄生的星之彩。'
      }
    ]
  },
  {
    id: 'lightless',
    name: '无光者',
    englishName: 'The Lightless Ones',
    description: '不信神，不忠王。他们是黑暗中的流浪者、佣兵和暗杀者。在这个乱世中，他们只信奉金币和手中的刀刃。',
    shortDesc: '暗影行者，唯利是图与生存。',
    philosophy: '只有活下去的人，才有资格谈论未来。',
    color: '#525252',
    coordinates: { x: 300, y: 90, z: 20 },
    characters: [
      { 
        id: 'c_lightless_1', 
        name: '赤瞳 (Red Eye)', 
        title: '暗影会首领', 
        description: '没人知道他的真名。他掌控着大陆最大的情报网，只要出得起价，连神的秘密他都能卖。', 
        imageSeed: 401, 
        isLeader: true,
        stats: { might: 70, scheme: 90, sanity: 80 },
        tags: ['刺客', '情报贩子', '无面者'],
        relics: ['阴影披风', '无声匕首'],
        secret: '他其实是百年前那位暴君的私生子，但他亲手销毁了所有证据。'
      },
      { 
        id: 'c_lightless_2', 
        name: '卡尔 (Carr)', 
        title: '赤鸦帮头目', 
        description: '罪恶之都的地下皇帝，经营着堕神遗骸的黑市交易。性格残暴，喜怒无常。', 
        imageSeed: 402,
        stats: { might: 85, scheme: 50, sanity: 45 },
        tags: ['黑帮', '走私犯', '暴徒'],
        relics: ['黄金指虎', '禁药'],
        secret: '他极度恐惧黑暗，睡觉时必须点亮所有的灯。'
      }
    ]
  },
  {
    id: 'apostles',
    name: '轮回使徒',
    englishName: 'Apostles of Rebirth',
    description: '一群神秘的苦行者，相信世界是一个巨大的衔尾蛇。他们记录历史，却不干涉历史，静静等待着终焉的到来。',
    shortDesc: '宿命轮回，静待终焉与重启。',
    philosophy: '一切皆已发生，一切终将重演。',
    color: '#059669',
    coordinates: { x: -180, y: 360, z: 20 },
    characters: [
      { 
        id: 'c_apostle_1', 
        name: '萨拉 (Sara)', 
        title: '轮回先知', 
        description: '据说她已经活过了三个纪元。她的双眼也是盲的，但她能看到时间的洪流。', 
        imageSeed: 501, 
        isLeader: true,
        stats: { might: 10, scheme: 99, sanity: 90 },
        tags: ['先知', '长生者', '盲眼'],
        relics: ['时间沙漏', '衔尾蛇指环'],
        secret: '她其实是造成“裂隙”灾难的元凶之一，她在赎罪，也在等待审判。'
      },
      { 
        id: 'c_apostle_2', 
        name: '无名行者', 
        title: '时间记录者', 
        description: '沉默寡言的记录者，背着一本巨大的书卷，记录着每一个死去神明的名字。', 
        imageSeed: 502,
        stats: { might: 50, scheme: 50, sanity: 95 },
        tags: ['记录者', '观察者', '苦行僧'],
        relics: ['万物之书', '永恒墨水'],
        secret: '那本书其实是空白的，他只是在假装记录，因为他知道没人会看。'
      }
    ]
  }
];

export const INTRO_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "你在废墟中醒来，眼前是一具神明的尸骸。它的心脏仍在微弱跳动。你会...",
    options: [
      { text: "吞噬心脏，获取力量。", factionPoints: { fallen: 2, scholars: 1 } },
      { text: "将它卖给黑市，换取黄金。", factionPoints: { lightless: 3 } },
      { text: "为它祈祷，送它最后一程。", factionPoints: { nobility: 2, apostles: 1 } },
      { text: "解剖它，研究神的构造。", factionPoints: { scholars: 3 } }
    ]
  },
  {
    id: 2,
    text: "旧日的王城在燃烧，难民在哭喊。你手中只有一把剑。你会...",
    options: [
      { text: "集结幸存者，重建秩序。", factionPoints: { nobility: 3 } },
      { text: "这正是掠夺的好机会。", factionPoints: { lightless: 2, fallen: 1 } },
      { text: "坐视不管，这是命运的轮回。", factionPoints: { apostles: 3 } },
      { text: "观察火势，记录毁灭的轨迹。", factionPoints: { scholars: 2 } }
    ]
  },
  {
    id: 3,
    text: "低语声在你耳边响起：'世界已死，唯有疯狂永恒'。你回应...",
    options: [
      { text: "“那就让我成为新的神。”", factionPoints: { fallen: 3 } },
      { text: "“我会找到治愈这疯狂的方法。”", factionPoints: { scholars: 2, nobility: 1 } },
      { text: "“只要给钱，我也可以疯狂。”", factionPoints: { lightless: 2 } },
      { text: "“疯狂亦是轮回的一部分。”", factionPoints: { apostles: 2 } }
    ]
  }
];

export const INTRO_TEXTS = [
  "诸神统治了亿万年...",
  "直到裂隙撕裂了天空...",
  "信仰崩塌，世界无主...",
  "欢迎来到... 堕神纪元。"
];
