"use strict";

  const TRACKS = {
    "km-zgm": { label: "КМ → ЗГМ" },
    "zgm-gm": { label: "ЗГМ → ГМ" },
  };
  const TABS = [
    { id: "bank", label: "Банк вопросов" },
    { id: "new", label: "Новая аттестация" },
    { id: "history", label: "История" },
  ];

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  const esc = (s) => (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const DEFAULT_QUESTIONS = [
    { id: uid(), track: "km-zgm", title: "Неадекват в игровой комнате без фрапса",
      situation: "Вы с другом, поздней ночью, сидите в игровой комнате, к вам заходит посторонний человек и начинает неадекватить. Фрапса у вас нет. Ваши действия?",
      answer: "Начинаете перебирать все возможные варианты, как выйти из данной ситуации (либо можете сказать: вырублю микрофон на сервере)." },
    { id: uid(), track: "km-zgm", title: "У нового модератора блокировка на другом сервере",
      situation: "Вы ставите человека на модератора. После еженедельной проверки /user узнаете, что у него есть блокировка за неадеквата на другом Discord-сервере BLACK RUSSIA. Ваши действия (максимально подробно)?",
      answer: "Тут узнаете, когда была выдана блокировка именно. Если была выдана блокировка во время того, как он стоял, то снимаете его с ЧСМ за неадекватное поведение (6-12 месяцев), а если до поставления на пост, то снимаете без ЧСМ." },
    { id: uid(), track: "km-zgm", title: "Реклама заявок модерки на стороннем сервере",
      situation: "Ваш модератор рекламирует заявки на модерку нашего сервера на другом сервере BLACK RUSSIA (в канале общение). Ваши действия?",
      answer: "На первый раз — беседа, повторно — выговор." },
    { id: uid(), track: "km-zgm", title: "Пустая таблица модерации",
      situation: "Вы заходите в свою таблицу модерации, и там ничего нет. Никаких листов, заявок, реестра и так далее. Ваши действия?",
      answer: "Посмотрю в логах в таблице, кто это натворил, после сниму человека, который это сделал. Также выдам ЧСМ за слив." },
    { id: uid(), track: "km-zgm", title: "Скриншот снятия в личном ВК",
      situation: "Ваш модератор выкладывает на своей странице вконтакте скриншот из беседы INFO & NEWS, где снимают его друга с поста модератора. Ваши действия?",
      answer: "На первый раз просите удалить пост, если повторится — от выговора до снятия." },
    { id: uid(), track: "km-zgm", title: "Модератор включает микрофон другу на трибуне",
      situation: "Вы сидите на трибуне (игроки задают вопросы ГА/ЗГА и ГМ/ЗГМ). У всех включены микрофоны на сервере. Однако ваш модератор постоянно включает микрофон своему другу и тот начинает мешать трибуне. Ваши действия?",
      answer: "Предупреждение — выговор за покрывательство, повторно — снятие с ЧСМ по дням на Ваше усмотрение, а другу наказание по 4.1." },
    { id: uid(), track: "km-zgm", title: "Оскорбление родни в войсе без доказательств",
      situation: "Вы сидите ночью в дискорде с телефона и играете в BLACK RUSSIA. Discord у вас само собой свёрнут, и вы не видите что там происходит. Вдруг к вам в голосовой канал заходит человек, оскорбляет вашу родню и выходит. Позже, проверив логи, выяснилось что это был ваш модератор. Фрапса нет. Ваши действия?",
      answer: "Так как нет доказательств, будете внимательнее следить за модератором." },
    { id: uid(), track: "km-zgm", title: "Выговор за провокацию",
      situation: "Вы выдаете выговор модератору за неадекватное поведение в глобальном чате, после чего он скидывает вам доказательства того, что его спровоцировали. Ваши действия?",
      answer: "Модератор лицо проекта, он не должен вестись на провокации, поэтому наказание не снимете." },
    { id: uid(), track: "km-zgm", title: "Мнение ГМ против бывшего ЗРМ",
      situation: "У вас появился вопрос и вы решил обратиться к действующему главному модератору и бывшему заместителю руководителя модерации. К какому ответу вы больше прислушаетесь?",
      answer: "Прислушаетесь к действующему ГМ." },
    { id: uid(), track: "km-zgm", title: "Порядок срочной, нормальной и пропущенной задач",
      situation: "Есть 3 задачи. Срочная, нормальная и пропущенная. В какой последовательности вы будете их решать?",
      answer: "Срочная, пропущенная, нормальная." },
    { id: uid(), track: "km-zgm", title: "Строгое предупреждение упустили при назначении",
      situation: "Вы поставили модератора и по своей вине упустили из виду то, что у него строгое предупреждение. Ваши действия?",
      answer: "Снимете модератора без ЧСМ, так как это вина модерации, а не игрока." },
    { id: uid(), track: "km-zgm", title: "Младший модератор без актива просит снять ПСЖ",
      situation: "У вас стоит младший модератор уже 2 месяца, актива нет. В один из дней он пишет и просит снять ПСЖ. Будете ли выдавать ему ЧСМ и если да, то на сколько?",
      answer: "Снимете модератора за неустойку, а так как он стоит более 7 дней, то выдадите ЧСМ на 30 дней." },
    { id: uid(), track: "km-zgm", title: "Слив Discord-сервера модератором",
      situation: "Модератор в дискорде начинает всех массового мутить, массового спамить в чате и кидать непонятные ссылки, проще говоря - он сливает Discord сервер. Какой у вас будет ряд действий и что вы должны сделать с этим модератором?",
      answer: "Модератор должен быть снят с ЧСМ навсегда за слив, (позже ГМ может выдать глобальную блокировку в Дискорде). А первые Ваши действия — это снять роли и выдать мут, чтобы он не сумел продолжить дальше сливать." },
    { id: uid(), track: "km-zgm", title: "Продажа виртов и аккаунтов в статусе модератора",
      situation: "Вы сидите в Discord и решаете проверить профиль своего модератора, у модератора в обо мне находится ссылка на сообщество, где продают вирты и аккаунты. Что вы с ним должны сделать, и какие действия вы предпримете?",
      answer: "Должны будете модератора снять и внести в ЧСМ навсегда (нарушение правил проекта), так же ему выдается глобальная блокировка." },
    { id: uid(), track: "km-zgm", title: "Зачем идёшь на пост ЗГМ",
      situation: "Зачем идёте на пост ЗГМ?",
      answer: "На пост ЗГМА Вы идете, потому что хотите помогать развитию Дискорд сферы. Так же в Ваших интересах готовить и помогать развивать новоиспечённых модераторов и, в принципе, данная сфера Вам приносит удовольствие. Хотите поработать с составом, поднять общий состав модерации." },
    { id: uid(), track: "km-zgm", title: "Обязанности ЗГМ",
      situation: "В чем заключаются обязанности ЗГМ?",
      answer: "В принципе, в обязанности ЗГМА входит почти всё то, что и у ГМА. То есть то, что он поручит, то и будете делать. А так основные обязанности заключаются в этом: ежедневная проверка норматива, ежедневная проверка заявок, ежедневная проверка репортов, ежедневная слежка за голосовыми и текстовыми каналами, проведение обзвонов и подробных инструктажей новоприбывшей модерации, помощь модераторам и повышение квалификации их работы." },
    { id: uid(), track: "km-zgm", title: "Цель поста ЗГМ через 3 месяца",
      situation: "С какой целью идет на ЗГМ?",
      answer: "Спустя 3 месяца Вы будете по-прежнему работать. Когда будете уверены, что достигли еще лучшего уровня знаний, будете стараться попасть на пост ГМА." },
    { id: uid(), track: "km-zgm", title: "Сроки ЧСМ за неустойку по длительности поста",
      situation: "ЧСМ за неустойку выдается на срок 1-3 месяца, расскажи в каком случае он выдается на 1, 2 и на 3 месяца?",
      answer: "Если модератор простоял: до 24 часов — 90 дней, до 7 дней — 60 дней, более 7 дней — 30 дней." },
    { id: uid(), track: "km-zgm", title: "Сроки повышения ММ — ЗГМ",
      situation: "Расскажи о сроках повышения на пост младшего модератора - заместителя главного модератора",
      answer: "ММ - М | 7 дней (5 минимально); М - СМ | 14 дней (10 минимально); СМ - КМ | 15 дней; КМ - ЗГМ | 15 дней; ЗГМ - ГМ | 100 дней." },
    { id: uid(), track: "km-zgm", title: "Отличие пунктов 2.7 и 2.16",
      situation: "Чем отличаются пункты 2.7 и 2.16? Приведите конкретные ситуации с ними.",
      answer: "Пункт 2.7: споры на тему религии и политики. Пример: конфликт из-за того, чья религия лучше, либо бурное обсуждение политических действий государств." },
    { id: uid(), track: "km-zgm", title: "Фишинговая ссылка от модератора",
      situation: "Вы заходите во флуд и замечаете, что ваш модератор скинул фишинговую ссылку (ссылка ведет на вирус/взлом), у вас есть подозрения что его взломали. Ваши действия?",
      answer: "Снятие, даже в случае взлома — это проблема модератора." },
    { id: uid(), track: "km-zgm", title: "Нецензурная активность Spotify",
      situation: "Что вы будете делать, если у вашего модератора стоит нецензурная активность Spotify в профиле Discord?",
      answer: "Смотря какая активность. Если что-то тяжёлое или нарушает правила сервера, то попросите убрать активность." },
    { id: uid(), track: "km-zgm", title: "Читы на видео у партнёра BLACK RUSSIA",
      situation: "Представим такую ситуацию, у вас стоит модератор который одновременно с этим стоит на партнерке BLACK RUSSIA. И вот вы зашли в его профиль, и видите видео там где он играет со сторонним ПО. Но потом это видео резко удаляется, а вы успели его скачать. Ваши действия?",
      answer: "Снятие и ЧСМ за нарушение правил проекта, и пишете PR-Менеджеру." },
    { id: uid(), track: "km-zgm", title: "Как вычислить обход ЧСМ",
      situation: "Как вычислить обход ЧСМ?",
      answer: "Написать Роме или человеку, обладающему модеркой на форуме, чтобы человека пробили на аккаунты. При совпадении с другими аккаунтами копируете и вставляете в поиск таблицы ЧСеров." },
    { id: uid(), track: "km-zgm", title: "Оголение тела на камеру",
      situation: "Что вы сделаете, если модератор на камеру показывает свое тело?",
      answer: "Снятие с ЧСМ от 6 до 12 месяцев за неадекватное поведение." },
    { id: uid(), track: "km-zgm", title: "Подозрение на взлом по поведению во флуде",
      situation: "Вы в последнее время замечаете, что ваш модератор очень странно ведет себя во флуде, будто это не он а другой человек. Ваши действия?",
      answer: "Снятие до выяснения. Если проверка на взлом была успешна и его не взломали, и за этот момент модератор ничего не сделал, то восстановите его на должность." },
    { id: uid(), track: "km-zgm", title: "Репорт на уже снятого модератора",
      situation: "Вам приходит репорт на модератора который уже снят с поста, на снятие наказания. Ваши действия?",
      answer: "Посмотрите в выданные наказания и логи, если и там ничего из доказательств не будет, то обжалуете наказание." },
    { id: uid(), track: "km-zgm", title: "Беседа для слива Куратора модерации",
      situation: "Допустим, до вас доходит информация, что старший модератор создал группу или беседу для слива Куратора модерации, чтобы быстро занять ваш пост. Вы узнаете что весь состав состоял в данной беседе, ваши действия?",
      answer: "Вызовите модераторов и попросите включить демонстрацию экрана. После того как увидите, что в этой беседе, снимете овнера беседы за попытку слива, остальные, кто был, получат за нарушения в беседе (если они есть)." },
    { id: uid(), track: "km-zgm", title: "Модератор — главный администратор проекта в ВК",
      situation: "Вы узнаете от какого-либо игрока информацию и он скинул вам ссылку на Discord-сервер проекта в VK на котором ваш модератор стоит на посту главного администратора, ваши действия?",
      answer: "Сверите теги в дискорде, если подтвердится, то снимете его с ЧСМ на год за занятие должностей на другом проекте." },
    { id: uid(), track: "km-zgm", title: "Проверка слуха о должности на другом проекте",
      situation: "Вы узнаете от кого-то, что ваш модератор находится на должности на каком-то другом проекте. Как вы проверите данную информацию?",
      answer: "Позовете модератора в Дискорд, попросите его включить демку (демонстрацию экрана), проверите сервера, на которых он находится, а также беседы ВК. Этого будет достаточно, чтобы убедиться в его виновности/невиновности." },
    { id: uid(), track: "km-zgm", title: "Какие комнаты модерируемые",
      situation: "Какие комнаты на сервере модерируемые?",
      answer: "Все комнаты, которые есть на сервере — модерируемые." },
    { id: uid(), track: "km-zgm", title: "Виды предупреждений и сроки",
      situation: "Какие есть виды предупреждений / какие виды предупреждений вы знаете и какой у них срок наказания?",
      answer: "Есть 3 вида предупреждений на сервере: устное предупреждение — снятие через 48 часов; предупреждение — снятие через 14 дней; строгое предупреждение — снятие после 30 дней." },
    { id: uid(), track: "km-zgm", title: "Жалоба на модератора за поведение в сторонней игре",
      situation: "Вы будучи ЗГМом, узнаете, что ваш модератор, играя в стимовскую игру, неадекватно вел себя и оскорблял человека. Этот человек оказался игроком нашего проекта и написал на него жалобу. Ваши действия?",
      answer: "Рассмотрите жалобу и выдадите наказание по мере нарушений." },
    { id: uid(), track: "km-zgm", title: "Активность другого проекта у модератора",
      situation: "Что вы будете делать, если увидели активность другого проекта у модератора?",
      answer: "Скажете убрать активность, при отказе от выполнения выдадите 2/3." },
    { id: uid(), track: "km-zgm", title: "Кандидат нахамил и вышел из группы на обзвоне",
      situation: "Каковы будут ваши действия, если вы пишете кандидату на обзвоне, чтобы он заходил в голосовой канал, а он послал вас на три буквы и вышел из группы кандидатов?",
      answer: "Выдадите ЧСМ за неадекватное поведение на 6 месяцев." },
    { id: uid(), track: "km-zgm", title: "5 одинаковых жалоб на модератора",
      situation: "На вашего модератора написали 5 одинаковых жалоб. Каковы будут ваши действия?",
      answer: "Если содержимое не отличается, то отвечу на первый репорт, далее во втором напишу что ответ был дан в прошлом репорте. Дальнейшие похожие репорты приведут вас к временной блокировке репортов. Закрыто. Посмотрю третий репорт и выдам бан репортов, а остальные жалобы закрою без ответа." },
    { id: uid(), track: "km-zgm", title: "6 нарушителей одновременно под давлением",
      situation: "Зайдя в игровую комнату вы слышите что 6 пользователей нарушают правила нашего Discord-сервера. Вы под большим давлением и не можете с ними справится. Что вы будете делать в такой ситуации?",
      answer: "Соберусь, включу фрапс. Начну выдавать наказания. Если онлайн будут другие модераторы попробую их позвать." },
    { id: uid(), track: "km-zgm", title: "Разрешён разговор в комнате для сна",
      situation: "Вы замечаете что на нашем сервере разрешено говорить в комнате для сна. Как-то странно - подумали вы. Какие будут ваши дальнейшие действия?",
      answer: "Своевременно сообщу об этом своему руководству." },
    { id: uid(), track: "km-zgm", title: "Модератор просит снять по собственному желанию",
      situation: "В один из прекрасных дней вам пишет в личные сообщения модератор с просьбой снятия с поста по собственному желанию. Как обернется ваше дальнейшее общение с модератором и какие действия последуют?",
      answer: "Перед снятием человека с поста модератора необходимо спросить у него, почему он уходит. Также предложить ему краткий неактив, чтобы он отдохнул и вернулся работать на посту модератора с новыми силами, но не уходил со своего поста. Максимально пытаться оставить модератора на своем посту. Только в случае, если он категорически несколько раз отказывается снять его с поста." },
    { id: uid(), track: "km-zgm", title: "Наказание по 2.1 отменяют дружбой",
      situation: "Рассмотрим ситуацию: вы выдали наказание за 2.1, а потом вам пишут что они друзья и всегда так общались. Ваши действия?",
      answer: "Написать им что данный чат предназначен для общения всех участников Discord-сервера, и некоторым людям может быть неприятно от ихнего общения. Наказание снимать не буду." },
  ];
  let state = {
    track: "km-zgm",
    tab: "bank",
    questions: null,
    attempts: null,
    blobId: null,
    storageMode: "local",
    syncFailed: false,
    connecting: false,
    formOpen: false,
    editingId: null,
    bankSearch: "",
    newAttempt: { step: "setup", candidate: "", selected: [], verdicts: {}, randomCount: 5 },
  };
  // jsonblob и kvdb.io в итоге оказались нестабильны, переехали на jsonbin.io
  const REQUEST_TIMEOUT = 8000;
  const JSONBIN_MASTER_KEY = "$2a$10$9nGLARcNk9H49UQiej5nLOtG3pBSIcg8MkQZB4m3slOxeMl9o78Dy";

  // kvdb только читает старые разошедшиеся ссылки, новые бакеты через него не создаём
  const PROVIDERS = {
    jsonbin: {
      async create(seed) {
        const res = await fetchWithTimeout("https://api.jsonbin.io/v3/b", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_MASTER_KEY },
          body: JSON.stringify(seed),
        });
        if (!res.ok) throw new Error("jsonbin: bin не создан");
        const data = await res.json();
        if (!data.metadata || !data.metadata.id) throw new Error("jsonbin: сервис не вернул id");
        return data.metadata.id;
      },
      async read(id) {
        const res = await fetchWithTimeout("https://api.jsonbin.io/v3/b/" + id + "/latest", {
          headers: { "X-Master-Key": JSONBIN_MASTER_KEY },
        });
        if (!res.ok) throw new Error("jsonbin: чтение не удалось");
        const data = await res.json();
        return data.record || {};
      },
      async write(id, data) {
        const res = await fetchWithTimeout("https://api.jsonbin.io/v3/b/" + id, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_MASTER_KEY },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("jsonbin: запись не удалась");
      },
    },
    kvdb: {
      async create() { throw new Error("kvdb: создание отключено, только чтение старых ссылок"); },
      async read(id) {
        const res = await fetchWithTimeout("https://kvdb.io/" + id + "/data");
        if (!res.ok) throw new Error("kvdb: чтение не удалось");
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      },
      async write(id, data) {
        const res = await fetchWithTimeout("https://kvdb.io/" + id + "/data", {
          method: "POST", body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("kvdb: запись не удалась");
      },
    },
  };
  const CREATE_ORDER = ["jsonbin"];

  function findProvider(name) {
    const p = PROVIDERS[name];
    if (!p) throw new Error("неизвестный провайдер хранилища: " + name);
    return p;
  }

  // старые ссылки хранили голый id бакета kvdb без префикса — считаем их kvdb
  function parseDbParam(raw) {
    if (!raw) return null;
    const idx = raw.indexOf(":");
    if (idx === -1) return { provider: "kvdb", id: raw };
    return { provider: raw.slice(0, idx), id: raw.slice(idx + 1) };
  }

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }
  function mergeDefaults(existing) {
    const have = new Set(existing.map(q => q.track + "::" + q.title));
    const missing = DEFAULT_QUESTIONS.filter(q => !have.has(q.track + "::" + q.title));
    return existing.concat(missing);
  }

  function fetchWithTimeout(url, options) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
  }

  async function fetchSharedData() {
    const raw = getParam("db");
    const parsed = parseDbParam(raw);
    if (parsed) {
      const data = await findProvider(parsed.provider).read(parsed.id);
      return {
        id: parsed.provider + ":" + parsed.id,
        questions: Array.isArray(data.questions) ? data.questions : [],
        attempts: Array.isArray(data.attempts) ? data.attempts : [],
      };
    }

    const seed = { questions: DEFAULT_QUESTIONS, attempts: [] };
    let lastErr;
    for (const name of CREATE_ORDER) {
      try {
        const id = await PROVIDERS[name].create(seed);
        return { id: name + ":" + id, questions: DEFAULT_QUESTIONS.slice(), attempts: [] };
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error("ни один сервис хранилища не ответил");
  }

  // даём провайдеру вторую попытку перед тем, как уходить в локальный режим
  async function connectShared() {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const shared = await fetchSharedData();
        state.blobId = shared.id;
        state.questions = mergeDefaults(shared.questions);
        state.attempts = shared.attempts;
        state.storageMode = "shared";
        state.syncFailed = false;

        if (!getParam("db")) {
          const url = new URL(window.location.href);
          url.searchParams.set("db", shared.id);
          window.history.replaceState({}, "", url.toString());
        }
        if (state.questions.length !== shared.questions.length) await persist();
        return true;
      } catch (e) {
        if (attempt === 1) await new Promise(r => setTimeout(r, 1200));
      }
    }
    state.storageMode = "local";
    loadLocal();
    return false;
  }

  async function initStorage() {
    await connectShared();
    renderShareBox();
    renderStatus();
  }

  function loadLocal() {
    let loaded = [];
    try {
      loaded = JSON.parse(localStorage.getItem("qtool_questions") || "null") || [];
    } catch (e) { loaded = []; }
    state.questions = mergeDefaults(loaded);
    try {
      state.attempts = JSON.parse(localStorage.getItem("qtool_attempts") || "null") || [];
    } catch (e) { state.attempts = []; }
    persistLocal();
  }

  function persistLocal() {
    localStorage.setItem("qtool_questions", JSON.stringify(state.questions));
    localStorage.setItem("qtool_attempts", JSON.stringify(state.attempts));
  }

  // локальная копия пишется всегда — подстраховка на случай, если общее хранилище недоступно
  async function persist() {
    persistLocal();
    if (state.storageMode !== "shared" || !state.blobId) return;
    try {
      const parsed = parseDbParam(state.blobId);
      await findProvider(parsed.provider).write(parsed.id, { questions: state.questions, attempts: state.attempts });
      state.syncFailed = false;
    } catch (e) {
      state.syncFailed = true;
    }
    renderStatus();
  }

  function renderShareBox() {
    const box = document.getElementById("shareBox");
    if (state.storageMode === "shared") {
      box.innerHTML = `
        <code id="shareLink">${esc(window.location.href)}</code>
        <button id="copyBtn">Скопировать</button>
      `;
      document.getElementById("copyBtn").addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const b = document.getElementById("copyBtn");
          const old = b.textContent;
          b.textContent = "Скопировано";
          setTimeout(() => (b.textContent = old), 1200);
        });
      });
    } else {
      box.innerHTML = `
        <code id="shareLink">общее хранилище сейчас недоступно — данные сохраняются только в этом браузере</code>
        <button id="reconnectBtn">${state.connecting ? "Подключаюсь…" : "Подключиться"}</button>
      `;
      const btn = document.getElementById("reconnectBtn");
      if (state.connecting) btn.disabled = true;
      btn.addEventListener("click", async () => {
        state.connecting = true;
        renderShareBox();
        await connectShared();
        state.connecting = false;
        renderShareBox();
        renderStatus();
        render();
      });
    }
  }

  function renderStatus() {
    const pill = document.getElementById("statusPill");
    const el = document.getElementById("statusText");
    const shared = state.storageMode === "shared";
    pill.className = "status " + (shared && !state.syncFailed ? "status-ok" : "status-warn");
    if (shared) {
      el.textContent = state.syncFailed ? "общее хранилище — не синхронизировано" : "общее хранилище";
    } else {
      el.textContent = "локально";
    }
  }
  function renderShell() {
    const tracksEl = document.getElementById("tracks");
    tracksEl.innerHTML = Object.entries(TRACKS).map(([id, t]) =>
      `<button class="track-btn ${state.track === id ? "active" : ""}" data-track="${id}">${esc(t.label)}</button>`
    ).join("");
    tracksEl.querySelectorAll("[data-track]").forEach(b =>
      b.addEventListener("click", () => { state.track = b.dataset.track; state.tab = state.tab; render(); })
    );

    const tabsEl = document.getElementById("tabs");
    tabsEl.innerHTML = TABS.map(t =>
      `<button class="tab-btn ${state.tab === t.id ? "active" : ""}" data-tab="${t.id}">${esc(t.label)}</button>`
    ).join("");
    tabsEl.querySelectorAll("[data-tab]").forEach(b =>
      b.addEventListener("click", () => { state.tab = b.dataset.tab; render(); })
    );
  }
  function renderBank() {
    const content = document.getElementById("content");
    const trackList = state.questions.filter(q => q.track === state.track);
    const term = state.bankSearch.trim().toLowerCase();
    const list = term
      ? trackList.filter(q =>
          q.title.toLowerCase().includes(term) ||
          q.situation.toLowerCase().includes(term) ||
          (q.answer || "").toLowerCase().includes(term))
      : trackList;
    let html = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;gap:12px;flex-wrap:wrap;">
        <div>
          <div class="section-title">Банк вопросов — ${esc(TRACKS[state.track].label)}</div>
          <div class="section-sub">${list.length} ${list.length === 1 ? "вопрос" : "вопросов"}${term ? ` из ${trackList.length}` : ""} в этом треке</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-ghost" id="exportBtn">Экспорт</button>
          <button class="btn btn-ghost" id="importBtn">Импорт</button>
          <input type="file" id="importFile" accept="application/json" style="display:none;" />
          ${!state.formOpen ? `<button class="btn btn-primary" id="addBtn">+ Добавить вопрос</button>` : ""}
        </div>
      </div>
      <input class="field" id="bankSearch" placeholder="Поиск по вопросам и ответам…" value="${esc(state.bankSearch)}" style="margin-bottom:16px;" />
    `;

    if (state.formOpen) {
      const editing = state.editingId ? state.questions.find(q => q.id === state.editingId) : null;
      html += `
        <div class="card">
          <label class="field-label">Заголовок</label>
          <input class="field" id="fTitle" value="${esc(editing ? editing.title : "")}" placeholder="Например: Конфликт двух модераторов" style="margin-bottom:12px;" />
          <label class="field-label">Задание</label>
          <textarea class="field" id="fSituation" rows="4" placeholder="Опишите ситуацию" style="margin-bottom:12px;">${esc(editing ? editing.situation : "")}</textarea>
          <label class="field-label">Ответ</label>
          <textarea class="field" id="fAnswer" rows="3" placeholder="Правильный ответ" style="margin-bottom:14px;">${esc(editing ? editing.answer : "")}</textarea>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-primary" id="fSubmit">${editing ? "Сохранить изменения" : "Добавить в банк"}</button>
            <button class="btn btn-ghost" id="fCancel">Отмена</button>
          </div>
        </div>
      `;
    }

    if (list.length === 0 && !state.formOpen) {
      html += term
        ? `<div class="empty"><div class="empty-title">Ничего не нашлось</div><div class="empty-hint">Попробуйте другой запрос.</div></div>`
        : `<div class="empty"><div class="empty-title">Пока пусто</div><div class="empty-hint">Добавьте первый вопрос — кнопка сверху.</div></div>`;
    } else {
      html += list.map(q => `
        <div class="card">
          <div style="display:flex;justify-content:space-between;gap:12px;">
            <div style="flex:1;min-width:0;">
              <div class="qtitle">${esc(q.title)}</div>
              <div class="qbody">${esc(q.situation)}</div>
              ${q.answer ? `<div class="qanswer"><strong>Ответ:</strong> ${esc(q.answer)}</div>` : ""}
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;">
              <button class="btn-sm" data-edit="${q.id}">Изменить</button>
              <button class="btn-sm" data-del="${q.id}" style="color:var(--bad);">Удалить</button>
            </div>
          </div>
        </div>
      `).join("");
    }

    content.innerHTML = html;

    const searchInput = document.getElementById("bankSearch");
    searchInput.addEventListener("input", () => {
      state.bankSearch = searchInput.value;
      const pos = searchInput.selectionStart;
      renderBank();
      const el = document.getElementById("bankSearch");
      el.focus();
      el.setSelectionRange(pos, pos);
    });

    document.getElementById("exportBtn").addEventListener("click", () => {
      const payload = { questions: state.questions, attempts: state.attempts, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attestation-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    const importFile = document.getElementById("importFile");
    document.getElementById("importBtn").addEventListener("click", () => importFile.click());
    importFile.addEventListener("change", async () => {
      const file = importFile.files[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        const importedQuestions = Array.isArray(data.questions) ? data.questions : [];
        const importedAttempts = Array.isArray(data.attempts) ? data.attempts : [];
        if (!importedQuestions.length && !importedAttempts.length) throw new Error("empty");
        if (!confirm(`Импортировать ${importedQuestions.length} вопросов и ${importedAttempts.length} попыток? Они добавятся к текущим (дубликаты по id пропускаются).`)) return;
        const existingQIds = new Set(state.questions.map(q => q.id));
        importedQuestions.forEach(q => { if (q.id && !existingQIds.has(q.id)) { state.questions.push(q); existingQIds.add(q.id); } });
        const existingAIds = new Set(state.attempts.map(a => a.id));
        importedAttempts.forEach(a => { if (a.id && !existingAIds.has(a.id)) { state.attempts.push(a); existingAIds.add(a.id); } });
        await persist();
        render();
      } catch (e) {
        alert("Не удалось прочитать файл — убедитесь, что это экспорт из этого приложения.");
      } finally {
        importFile.value = "";
      }
    });

    const addBtn = document.getElementById("addBtn");
    if (addBtn) addBtn.addEventListener("click", () => { state.formOpen = true; state.editingId = null; render(); });

    const cancel = document.getElementById("fCancel");
    if (cancel) cancel.addEventListener("click", () => { state.formOpen = false; state.editingId = null; render(); });

    const submit = document.getElementById("fSubmit");
    if (submit) submit.addEventListener("click", async () => {
      const title = document.getElementById("fTitle").value.trim();
      const situation = document.getElementById("fSituation").value.trim();
      const answer = document.getElementById("fAnswer").value.trim();
      if (!title || !situation) return;
      if (state.editingId) {
        const q = state.questions.find(x => x.id === state.editingId);
        q.title = title; q.situation = situation; q.answer = answer;
      } else {
        state.questions.push({ id: uid(), track: state.track, title, situation, answer, createdAt: Date.now() });
      }
      state.formOpen = false; state.editingId = null;
      await persist();
      render();
    });

    content.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => {
      state.formOpen = true; state.editingId = b.dataset.edit; render();
    }));
    content.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", async () => {
      state.questions = state.questions.filter(q => q.id !== b.dataset.del);
      await persist();
      render();
    }));
  }
  function renderNew() {
    const content = document.getElementById("content");
    const list = state.questions.filter(q => q.track === state.track);
    const na = state.newAttempt;

    if (list.length === 0) {
      content.innerHTML = `<div class="empty"><div class="empty-title">В этом треке нет вопросов</div><div class="empty-hint">Сначала добавьте вопросы во вкладке «Банк вопросов».</div></div>`;
      return;
    }

    if (na.step === "fill") {
      content.innerHTML = `
        <div class="section-title">Аттестация: ${esc(na.candidate)}</div>
        <div class="section-sub">${esc(TRACKS[state.track].label)} · ${na.selected.length} вопрос(ов)</div>
        ${na.selected.map((qid, i) => {
          const q = list.find(x => x.id === qid);
          if (!q) return "";
          const verdict = na.verdicts[qid] || "pending";
          return `
            <div class="card log ${verdict}">
              <div class="qtag">ВОПРОС ${i + 1}</div>
              <div class="qtitle">${esc(q.title)}</div>
              <div class="qbody">${esc(q.situation)}</div>
              ${q.answer ? `<div class="qanswer"><strong>Ответ:</strong> ${esc(q.answer)}</div>` : ""}
              <div style="display:flex;gap:8px;margin-top:12px;">
                <button class="btn-sm ${verdict === "correct" ? "btn-verdict-good" : "btn-verdict-off"}" data-verdict="correct" data-q="${qid}">✓ Верно</button>
                <button class="btn-sm ${verdict === "incorrect" ? "btn-verdict-bad" : "btn-verdict-off"}" data-verdict="incorrect" data-q="${qid}">✗ Неверно</button>
              </div>
            </div>
          `;
        }).join("")}
        <div style="display:flex;gap:10px;margin-top:16px;">
          <button class="btn btn-primary" id="saveAttempt" ${na.selected.every(qid => na.verdicts[qid]) ? "" : "disabled"}>Завершить аттестацию</button>
          <button class="btn btn-ghost" id="backSetup">Назад</button>
        </div>
      `;
      content.querySelectorAll("[data-verdict]").forEach(b => b.addEventListener("click", () => {
        na.verdicts[b.dataset.q] = b.dataset.verdict;
        render();
      }));
      document.getElementById("backSetup").addEventListener("click", () => { na.step = "setup"; render(); });
      const saveBtn = document.getElementById("saveAttempt");
      if (saveBtn) saveBtn.addEventListener("click", async () => {
        if (!na.selected.every(qid => na.verdicts[qid])) return;
        const answers = na.selected.map(qid => ({ questionId: qid, verdict: na.verdicts[qid] }));
        const correct = answers.filter(a => a.verdict === "correct").length;
        const attempt = {
          id: uid(), track: state.track, candidate: na.candidate, createdAt: Date.now(),
          status: "completed", completedAt: Date.now(),
          score: correct, total: answers.length, answers,
        };
        state.attempts.unshift(attempt);
        state.newAttempt = { step: "setup", candidate: "", selected: [], verdicts: {}, randomCount: na.randomCount || 5 };
        await persist();
        state.tab = "history";
        render();
      });
      return;
    }

    content.innerHTML = `
      <div class="section-title">Новая аттестация — ${esc(TRACKS[state.track].label)}</div>
      <div class="card">
        <label class="field-label">Кандидат</label>
        <input class="field" id="candName" value="${esc(na.candidate)}" placeholder="Ник кандидата" style="margin-bottom:16px;" />
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:8px;">
          <div class="field-label" style="margin-bottom:0;">Выберите вопросы (${na.selected.length} из ${list.length})</div>
          <div style="display:flex;align-items:center;gap:6px;">
            <input class="field" id="randomCount" type="number" min="1" max="${list.length}" value="${Math.min(na.randomCount || 5, list.length)}" style="width:56px;padding:6px 8px;text-align:center;" />
            <button class="btn-sm" id="randomPick" style="white-space:nowrap;">🎲 Случайные</button>
          </div>
        </div>
        <div class="checklist">
          ${list.map(q => `
            <label class="check-item ${na.selected.includes(q.id) ? "on" : ""}" data-check="${q.id}">
              <input type="checkbox" ${na.selected.includes(q.id) ? "checked" : ""} />
              <div>
                <div class="check-title">${esc(q.title)}</div>
                <div class="check-sub">${esc(q.situation.slice(0, 110))}${q.situation.length > 110 ? "…" : ""}</div>
              </div>
            </label>
          `).join("")}
        </div>
        <button class="btn btn-primary" id="toAnswers" style="margin-top:16px;" ${(!na.candidate.trim() || na.selected.length === 0) ? "disabled" : ""}>Перейти к оценке →</button>
      </div>
    `;
    document.getElementById("candName").addEventListener("input", (e) => {
      na.candidate = e.target.value;
      document.getElementById("toAnswers").disabled = !na.candidate.trim() || na.selected.length === 0;
    });
    document.getElementById("randomCount").addEventListener("input", (e) => {
      na.randomCount = Math.max(1, parseInt(e.target.value, 10) || 1);
    });
    document.getElementById("randomPick").addEventListener("click", () => {
      const n = Math.min(Math.max(1, na.randomCount || 5), list.length);
      const pool = list.map(q => q.id);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      na.selected = pool.slice(0, n);
      render();
    });
    content.querySelectorAll("[data-check]").forEach(el => el.addEventListener("click", (e) => {
      e.preventDefault();
      const id = el.dataset.check;
      if (na.selected.includes(id)) na.selected = na.selected.filter(x => x !== id);
      else na.selected.push(id);
      render();
    }));
    document.getElementById("toAnswers").addEventListener("click", () => {
      if (!na.candidate.trim() || na.selected.length === 0) return;
      na.verdicts = {};
      na.step = "fill";
      render();
    });
  }
  function renderHistory() {
    const content = document.getElementById("content");
    const list = state.attempts.filter(a => a.track === state.track)
      .sort((a, b) => (b.completedAt || b.createdAt) - (a.completedAt || a.createdAt));
    if (list.length === 0) {
      content.innerHTML = `<div class="empty"><div class="empty-title">Пока нет аттестаций</div><div class="empty-hint">История появится после первой созданной аттестации.</div></div>`;
      return;
    }

    const graded = list.filter(a => a.status !== "pending_review" && a.total > 0);
    const avgPct = graded.length ? Math.round(graded.reduce((sum, a) => sum + a.score / a.total, 0) / graded.length * 100) : 0;
    const passed = graded.filter(a => a.score / a.total >= 0.6).length;
    const passRate = graded.length ? Math.round(passed / graded.length * 100) : 0;
    const byCandidate = {};
    list.forEach(a => {
      if (!byCandidate[a.candidate]) byCandidate[a.candidate] = { count: 0, sumPct: 0, graded: 0 };
      byCandidate[a.candidate].count++;
      if (a.status !== "pending_review" && a.total > 0) { byCandidate[a.candidate].sumPct += a.score / a.total; byCandidate[a.candidate].graded++; }
    });
    const topCandidates = Object.entries(byCandidate)
      .map(([name, s]) => ({ name, count: s.count, avgPct: s.graded ? Math.round(s.sumPct / s.graded * 100) : null }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    content.innerHTML = `
      <div class="section-title">История — ${esc(TRACKS[state.track].label)}</div>
      <div style="height:14px;"></div>
      <div class="stats-row">
        <div class="stat-tile"><div class="stat-value">${list.length}</div><div class="stat-label">аттестаций</div></div>
        <div class="stat-tile"><div class="stat-value">${avgPct}%</div><div class="stat-label">средний балл</div></div>
        <div class="stat-tile"><div class="stat-value">${passRate}%</div><div class="stat-label">сдали (≥60%)</div></div>
      </div>
      ${topCandidates.length > 1 ? `
        <div class="section-sub" style="margin-top:16px;margin-bottom:8px;">По кандидатам</div>
        <div class="card" style="padding:6px 20px;">
          ${topCandidates.map(c => `
            <div class="hist-row" style="padding:8px 0;">
              <div class="hist-name" style="font-size:13.5px;">${esc(c.name)}</div>
              <div class="section-sub" style="margin:0;">${c.count} ${c.count === 1 ? "попытка" : "попыток"}${c.avgPct !== null ? ` · ${c.avgPct}%` : ""}</div>
            </div>
          `).join("")}
        </div>
      ` : ""}
      <div style="height:14px;"></div>
      ${list.map(a => `
        <div class="card hist-row" data-attempt-id="${esc(a.id)}" title="ПКМ, чтобы удалить">
          <div>
            <div class="hist-name">${esc(a.candidate)}</div>
            <div class="hist-date">${new Date(a.createdAt).toLocaleDateString("ru-RU")}${a.status === "completed" && a.completedAt ? " · проверено " + new Date(a.completedAt).toLocaleDateString("ru-RU") : ""}</div>
          </div>
          <div>
            ${a.status === "pending_review"
              ? `<span class="badge badge-pending">на проверке</span>`
              : `<span class="badge ${a.score === a.total ? "badge-good" : (a.score / a.total >= 0.6 ? "badge-pending" : "badge-bad")}">${a.score} / ${a.total}</span>`}
          </div>
        </div>
      `).join("")}
    `;
    content.querySelectorAll(".hist-row").forEach(row => {
      row.addEventListener("contextmenu", async (e) => {
        e.preventDefault();
        const id = row.dataset.attemptId;
        const attempt = state.attempts.find(a => a.id === id);
        if (!attempt) return;
        if (!confirm(`Удалить аттестацию «${attempt.candidate}»? Это действие необратимо.`)) return;
        state.attempts = state.attempts.filter(a => a.id !== id);
        await persist();
        renderHistory();
      });
    });
  }
  function render() {
    renderShell();
    if (state.tab === "bank") renderBank();
    else if (state.tab === "new") renderNew();
    else if (state.tab === "history") renderHistory();
  }

  initStorage().then(render);
