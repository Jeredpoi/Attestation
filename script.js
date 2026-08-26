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
    { id: uid(), track: "km-zgm", title: "Согласование Выговора",
      situation: "Твой куратор выявил нарушение модератора (нахамил игроку в личных сообщениях) и просит согласовать Выговор. ГМ сейчас недоступен. Соглашаешься сам, или ждёшь, пока освободится ГМ?",
      answer: "Согласование нужно с ЗГМ-ГМ — то есть достаточно одобрения любого из них. Ты как ЗГМ сам входишь в число согласующих, можешь дать добро, не дожидаясь ГМа." },
    { id: uid(), track: "km-zgm", title: "Снятие модератора с должности",
      situation: "Модератор твоей команды регулярно игнорирует репорты и грубит игрокам. Можешь ли снять его с должности сам?",
      answer: "Да — снятие с должности доступно с ЗГМ+, можешь сделать это сам, без дополнительного согласования с ГМ." },
    { id: uid(), track: "km-zgm", title: "Жалоба на равного по должности",
      situation: "В личные сообщения пишет игрок с жалобой на другого ЗГМ. Что ты делаешь с этой жалобой?",
      answer: "Жалобу на КМ/ЗГМ рассматривает ГМ. Сам её не решаешь — задача передать/перенаправить жалобу ГМ." },
    { id: uid(), track: "km-zgm", title: "Повторное нарушение — оформляешь ЧСМ сам",
      situation: "Модератор второй раз за месяц допускает ту же ошибку, за которую уже получал Выговор. Можешь ли выдать ему ЧСМ сам?",
      answer: "Да — ЧСМ выдаёт ЗГМ+, тебе доступно. Оформляешь по процедуре: форма в беседе CHIEF MODERATORS FORMS + бан модератору в беседе FLOOD своего сервера по шаблону «ЧСМ | Причина»." },
    { id: uid(), track: "km-zgm", title: "Мут в канале репортов",
      situation: "В канале репортов пользователь начинает спамить не по теме. Какую команду применяешь — /mute или /rmute?",
      answer: "/rmute — отдельная команда «мут репорта», доступная с КМ+, тебе как ЗГМ тоже доступна и точнее решает именно эту ситуацию, чем обычный /mute." },
    { id: uid(), track: "km-zgm", title: "Обжалование бана",
      situation: "Игрок подал апелляцию на бан, который выдал М из твоей команды. Можешь ли рассмотреть это обжалование сам?",
      answer: "Да — обжалование БАНа рассматривается с уровня ЗГМ+, и это наказание нижестоящего модератора, так что рассматриваешь сам." },
    { id: uid(), track: "km-zgm", title: "Приближение порога по п.2",
      situation: "Игрок за 7 дней получил уже 4 блокировки чата (порог для полной блокировки по п.2 — более пяти). Формально порог ещё не пройден, но тенденция очевидна. Что делаешь?",
      answer: "Формально по п.2 наказывать ещё рано (нужно >5). Но если поведение само по себе подпадает под другой пункт (например, систематическая неадекватность — п.1), можно рассмотреть его отдельно — нужно видеть тенденцию, а не действовать формально-механически." },
    { id: uid(), track: "km-zgm", title: "Публичный конфликт в команде",
      situation: "Новый ММ прямо в общем чате модерации спорит с другим модератором из-за принятого решения, разгорается конфликт на виду у остальных. Что делаешь в первую очередь?",
      answer: "Сначала останавливаю публичный спор — он подрывает авторитет команды. Перевожу разбирательство в личку/отдельный канал, разбираюсь в сути и при необходимости фиксирую ситуацию для дальнейших шагов." },
    { id: uid(), track: "zgm-gm", title: "Утрата доверия к куратору",
      situation: "Один из твоих КМ регулярно проваливает согласование наказаний — выдаёт неточные Выговоры даже после замечаний. Снимаешь куратора сам сейчас, или сначала пробуешь другое?",
      answer: "Снятие с должности в твоих руках (правило 2.13 — ГМ формирует команду и снимает по утрате доверия). Но управленческая логика — сначала понять, разовая это ошибка или системная, попробовать скорректировать через обратную связь, и снимать только при реально утраченном доверии." },
    { id: uid(), track: "zgm-gm", title: "Отчёт сервера под угрозой срыва",
      situation: "Известно, что серверы без отчётов теряют ГМа с должности. У тебя есть риск не сдать отчёт в срок из-за технического сбоя на стороне Ромы. Что делаешь заранее, а не постфактум?",
      answer: "Ответственность за отчётность — на ГМ как держателе процесса. Правильная линия: заранее предупредить руководство о проблеме, зафиксировать причину, найти альтернативный способ сдать отчёт до дедлайна." },
    { id: uid(), track: "zgm-gm", title: "ЧСМ — полный цикл",
      situation: "Опиши по шагам, что должно произойти для корректного оформления ЧСМ модератору, и куда он может обжаловать это решение.",
      answer: "Выдаёт ЗГМ+. Оформление: 1) форма в беседе CHIEF MODERATORS FORMS, 2) бан модератору в беседе FLOOD своего сервера по шаблону «ЧСМ | Причина». Обжаловать можно через репорт в DS или на форуме — рассматривает КГМ+." },
    { id: uid(), track: "zgm-gm", title: "Перевод куратора — не единоличное решение",
      situation: "Твой КМ просит перевод на другое направление. Кто должен согласовать этот перевод, прежде чем ты сможешь его оформить?",
      answer: "Перевод КМ/ЗГМ не решается одним ГМ. Нужно: согласование ЗРМ, согласие 2 ГМов, и ГМ-инициатор согласует всё сам." },
    { id: uid(), track: "zgm-gm", title: "Восстановление бывшего ЗГМ",
      situation: "Бывший ЗГМ, ушедший по собственному желанию месяц назад, просится обратно. Можешь ли восстановить его единолично?",
      answer: "Нет — восстановление ЗГМ/ГМ индивидуально и происходит с согласованием ЗРМа, одним ГМ не решается." },
    { id: uid(), track: "zgm-gm", title: "Модератор — он же администратор сервера",
      situation: "Модератор Беседы Игроков, который одновременно является действующим администратором сервера, грубо нарушил правила беседы. Можешь ли наказать его напрямую, как обычного модератора?",
      answer: "Нет — информация о нарушении с доказательствами передаётся руководству сервера. Модераторы не вправе самостоятельно наказывать администраторов." },
    { id: uid(), track: "zgm-gm", title: "Формирование команды",
      situation: "Нужно закрыть вакансию КМ. Один кандидат формально дольше в команде, но пассивен; другой недавно на М, но проявляет инициативу и качественно ведёт репорты. Кого назначаешь и почему это решение — твоя зона ответственности?",
      answer: "Ты вправе формировать команду на своё усмотрение и назначать на должности — решение в твоей компетенции (правило 2.13). Минимальные требования повышения всё равно должны соблюдаться как база, а дальше выбор — по качеству работы." },
    { id: uid(), track: "zgm-gm", title: "Жалоба на решение самого ГМ",
      situation: "Игрок хочет пожаловаться на твоё собственное решение. Куда уходит эта жалоба и что это говорит о твоём месте в иерархии?",
      answer: "Жалоба на ГМ рассматривается КГМ+. Даже ГМ подотчётен вышестоящему уровню и не является финальной инстанцией на своём сервере." },

    { id: uid(), track: "km-zgm", title: "Оголённая веб-камера в войсе",
      situation: "Модератор твоей команды заходит в голосовой канал с включённой веб-камерой — и в кадре оголённый человек. Что делаешь?",
      answer: "Немедленно останавливаю показ (кик из войса/отключение видео), фиксирую нарушение по п. о возрастном/шок-контенте — наказание от мута 90 минут до перманентной блокировки в зависимости от тяжести, собираю доказательства для отчёта." },
    { id: uid(), track: "km-zgm", title: "Пять видов ЧСМ",
      situation: "Назови минимум пять видов ЧСМ, за которые предусмотрен разный срок или отсутствие права на снятие.",
      answer: "Неадекватное поведение (6 месяцев / год), обман руководства (год), обход ЧС (без права на снятие), упоминание родни (6 месяцев / год), слив (без права на снятие), обман в возрасте (6 месяцев), слив информации (без права на снятие)." },
    { id: uid(), track: "km-zgm", title: "Spotify-интеграция с оскорбляющей музыкой",
      situation: "Твой модератор сидит в Discord с интеграцией Spotify, которая транслирует оскорбительную музыку в статусе/активности. Что делаешь?",
      answer: "Зову его в личный разговор в Discord, прошу отключить интеграцию. Если не отключит — выдаю предупреждение за халатное отношение к должности." },
    { id: uid(), track: "km-zgm", title: "Модератор продаёт Discord Nitro",
      situation: "Узнаёшь, что твой модератор продаёт Discord Nitro. Как реагируешь?",
      answer: "Ничего не делаю, если он не рекламирует это на ресурсах проекта и не скамит покупателей. Если рекламирует или обманывает — снимаю с должности по причине посторонней рекламы." },
    { id: uid(), track: "km-zgm", title: "Качества кандидата на ЗГМ",
      situation: "Какие качества ты бы искал в кандидате на должность ЗГМ и почему они важны для этого уровня ответственности?",
      answer: "Стрессоустойчивость, общительность, целеустремлённость — ЗГМ работает с конфликтами, командой и решениями, которые нельзя откладывать, поэтому эти качества напрямую влияют на качество работы." },
    { id: uid(), track: "km-zgm", title: "Совмещение с должностью агента поддержки",
      situation: "Может ли модератор одновременно быть агентом поддержки проекта?",
      answer: "Нет. Модератор не может совмещать роль с админом, техническим специалистом, лидером или агентом поддержки. Совместимо: актёр, тестировщик, СС, модератор БИ." },

    { id: uid(), track: "zgm-gm", title: "Оскорбление без доказательств",
      situation: "Ты был в игровой комнате, тебя оскорбил зашедший человек, но у тебя нет записи (фрапса), а по логам в комнату заходил только твой модератор. Что делаешь?",
      answer: "Формально ничего не делаю — нет доказательств вины конкретного человека. Но беру модератора на личный контроль: зову в Discord, провожу беседу." },
    { id: uid(), track: "zgm-gm", title: "Ошибка при назначении модератора",
      situation: "Ты назначил модератора, но выяснилось, что у него есть строгий предупреждение на другом сервере проекта. Что делаешь?",
      answer: "Снимаю его с должности без ЧСМ — это моя ошибка при отборе, а не вина модератора." },
    { id: uid(), track: "zgm-gm", title: "Кандидат нахамил на проверке",
      situation: "Кандидат на собеседовании/проверке грубо тебя послал. Что делаешь?",
      answer: "Кикаю его из беседы и выдаю ЧСМ за неадекватное поведение." },
    { id: uid(), track: "zgm-gm", title: "Сигнал от тех.специалиста",
      situation: "Технический специалист сообщает, что твой модератор продавал игровую валюту за реальные деньги. Что делаешь?",
      answer: "Отстраняю модератора до завершения разбирательства. При подтверждении — снимаю с должности за нарушение правил проекта, без права на вынос." },
    { id: uid(), track: "zgm-gm", title: "Сигнал от ГА",
      situation: "Главный администратор сообщает, что твой модератор оскорбил игрока. Что делаешь?",
      answer: "Аналогично сигналу от тех.специалиста: отстраняю до разбирательства, при подтверждении — снимаю за нарушение правил проекта без права на вынос. Источник сообщения не меняет процедуру, если он авторитетный." },
    { id: uid(), track: "zgm-gm", title: "Доказательства vs авторитетный источник",
      situation: "Почему в одном случае (нет записи, по логам заходил только твой модератор) ты не наказываешь, а в другом (сигнал от тех.специалиста или ГА) — сразу отстраняешь? В чём разница?",
      answer: "Разница в уровне доказательности источника. Голые логи без записи не доказывают вину конкретного человека — наказывать нельзя, максимум личный контроль. А сообщение от технического специалиста или ГА — уже подтверждённая информация от уполномоченного источника, достаточная для немедленного отстранения до разбирательства." },
    { id: uid(), track: "zgm-gm", title: "Куратор случайно выдал роль",
      situation: "Твой куратор случайно выдал роль СМ случайному человеку. Что делаешь?",
      answer: "Снимаю роль, наказываю получившего роль по п.2.11 (деструктивные действия по отношению к проекту), и сам снимаю куратора с должности за халатное отношение — снятие с должности в моей компетенции как ГМа." },
    { id: uid(), track: "zgm-gm", title: "Обязанности ГМа",
      situation: "Перечисли основные обязанности ГМа.",
      answer: "Слежка за сервером/беседой игроков; слежка за работой модерации Discord/Беседы игроков; подготовка куратора на должность ЗГМа; работа с составом модерации; пополнение состава модерации." },
    { id: uid(), track: "zgm-gm", title: "Спавн репортами",
      situation: "В репорты одновременно прилетает несколько обращений от одного человека (спавн репортами). Как выстраиваешь обработку?",
      answer: "Отвечаю подробно и с вердиктом на первые два репорта. Остальные закрываю с пометкой, что ответ уже дан в предыдущем обращении — кроме последнего, который беру на отдельное рассмотрение в течение 7 дней." },
    { id: uid(), track: "zgm-gm", title: "ЗРМ снимает модератора напрямую",
      situation: "ЗРМ (заместитель руководителя модераторов) просит снять твоего модератора. Твои действия?",
      answer: "Пытаюсь узнать причину. Но если ЗРМу нужно снять модератора — он вправе сделать это сам, напрямую, без обязательного согласования с тобой." },
    { id: uid(), track: "zgm-gm", title: "Сроки ЧСМ при неустойке",
      situation: "От чего зависит срок ЧСМ, если модератора снимают из-за неустойки (не справился с обязанностями), и какие пороги действуют?",
      answer: "Чем меньше модератор фактически отработал перед снятием, тем дольше ЧСМ: неделя и более отработанного срока — 30 дней; 2-7 дней — 60 дней; первые 24 часа после назначения — 90 дней." },
    { id: uid(), track: "zgm-gm", title: "Применение сроков ЧСМ на практике",
      situation: "Модератора сняли через 4 дня после назначения — фактически он отработал в диапазоне 2-7 дней. Какой ЧСМ ему полагается?",
      answer: "60 дней — по правилу диапазон «2-7 дней отработанного срока» даёт ЧСМ на 60 дней." },
    { id: uid(), track: "zgm-gm", title: "Сроки снятия видов наказаний",
      situation: "Через какое время и каким образом снимаются устное предупреждение, предупреждение, два предупреждения, мут, бан и перманентная блокировка?",
      answer: "Устное предупреждение — автоматически через 2 дня. Предупреждение — спецкомандой через 14 дней по репорту. Два предупреждения — только через месяц по репорту. Мут не обжалуется. Бан обжалуется через репорт. Перманентная блокировка — через 365 дней." },
    { id: uid(), track: "zgm-gm", title: "Сроки повышения по всей цепочке",
      situation: "Назови минимальные сроки для переходов: ММ→М, М→СМ, СМ→КМ, КМ→ЗГМ.",
      answer: "ММ→М — 7 дней (5 при особом случае/исключении). М→СМ — 15 дней (10 при исключении). СМ→КМ — 15 дней без исключений. КМ→ЗГМ — 15 дней без исключений." },
    { id: uid(), track: "zgm-gm", title: "Условия и срок перевода",
      situation: "При каких условиях у модератора вообще открывается возможность перевода на другую должность/направление, и на какой срок оформляется перевод?",
      answer: "Перевод возможен только если в составе 1-2 человека. Оформляется на 7 дней. Для КМ/ЗГМ дополнительно нужно согласование ЗРМ, согласие 2 ГМов и согласование ГМа-инициатора." },
    { id: uid(), track: "zgm-gm", title: "Реклама: Discord vs Беседа Игроков",
      situation: "Чем отличаются лимиты на рекламу в новостях Discord и в Беседе Игроков (ВК) по количеству публикаций в сутки?",
      answer: "В Discord: с 6:00 до 23:00, интервал 2 часа, максимум в сутки — 1 от отдела модерации и 1 от отдела администрации. В Беседе Игроков (ВК): тот же временной промежуток и интервал, но максимум — 3 от отдела модерации и 6 от отдела администрации." },
    { id: uid(), track: "zgm-gm", title: "Численность модерации БИ",
      situation: "Сколько модераторов каждого уровня (ГМ, СМ, М) может одновременно числиться в Беседе Игроков одного сервера?",
      answer: "ГМ — 1, СМ — 3, М — 6." },
    { id: uid(), track: "zgm-gm", title: "Предупреждение/Выговор в Беседе Игроков",
      situation: "В Беседе Игроков модератор допустил нарушение, требующее Предупреждения по системе наказаний модерации. Может ли куратор выдать его самостоятельно, или нужен ЗГМ/ГМ, как и в Discord?",
      answer: "Та же логика, что и в Discord: Предупреждение и Выговор куратор выдаёт только по согласованию с ЗГМ-ГМ. Площадка (Discord/ВК) не меняет уровень полномочий." },
    { id: uid(), track: "zgm-gm", title: "Обжалование наказаний в Беседе Игроков",
      situation: "Игрок хочет обжаловать наказание, выданное модератором в Беседе Игроков (ВК). Куда он обращается, и кто это рассматривает?",
      answer: "Любое наказание, выданное модератором в Беседе Игроков, обжалуется на форуме этого сервера в разделе «Обжалования» — рассматривает ЗРМ+. Жалобу именно на модератора можно подать в личные сообщения ГМу или на форуме в разделе «Жалобы на Администрацию»." },
    { id: uid(), track: "zgm-gm", title: "Проверка кандидата в модераторы БИ",
      situation: "Какие минимальные требования ты проверяешь у кандидата в модераторы Беседы Игроков перед одобрением заявки?",
      answer: "Возраст от 14 лет; отсутствие активных ЧС (кроме случаев ухода по ПСЖ); отсутствие активного ЧСМ; кандидат не занимает такую же должность более чем на 2 серверах одновременно." },
    { id: uid(), track: "zgm-gm", title: "Совместительство на двух серверах",
      situation: "Действующий модератор твоей команды просит взять его по совместительству модератором ещё и на другом сервере проекта. Разрешаешь?",
      answer: "Нет — по правилу 2.09 модератор может занимать данную должность только на одном сервере проекта одновременно." },
    { id: uid(), track: "zgm-gm", title: "Разглашение внутренней информации",
      situation: "Модератор в переписке с игроком рассказал детали внутреннего обсуждения модерации — например, кто как голосовал по наказанию. Это нарушение?",
      answer: "Да — правило 2.11 запрещает модератору распространять информацию, касающуюся его деятельности." },
    { id: uid(), track: "zgm-gm", title: "Уход ММ до повышения",
      situation: "ММ, ещё не дослужившийся до должности М, уходит по собственному желанию. Какие для него последствия?",
      answer: "Он может быть занесён в чёрный список модераторов сроком до 90 дней." },
    { id: uid(), track: "zgm-gm", title: "Жалоба выше твоего уровня",
      situation: "Игрок хочет пожаловаться на ЗРМ или РМ. Что ты ему говоришь?",
      answer: "Направляю на форум — жалобы такого уровня рассматриваются не через тебя, а через раздел жалоб на форуме проекта." },
    { id: uid(), track: "zgm-gm", title: "ГБАН: Discord vs ВК",
      situation: "Чем отличается, с какого уровня рассматривается обжалование глобального бана в Discord и в ВК?",
      answer: "Обжалование ГБАН в Discord рассматривается с уровня КГМ+, а в ВК — с уровня ЗРМ+." },
    { id: uid(), track: "zgm-gm", title: "Администратор как модератор БИ",
      situation: "Действующий Главный Администратор сервера просит назначить его по совместительству модератором Беседы Игроков. Разрешаешь?",
      answer: "Нет — модератором БИ может быть действующий администратор не выше Старшего Администратора; Главный Администратор в этот порог не входит. К тому же Главный Администратор вправе в принципе запретить своему составу занимать такие должности." },
    { id: uid(), track: "zgm-gm", title: "Команды только уровня ГМ",
      situation: "Какие модераторские команды в Discord доступны только с уровня ГМ, а не уже с ЗГМ?",
      answer: "/gban и /gunban (глобальная блокировка пользователя), /private gban и /private gunban (глобальная блокировка приватных комнат) — доступны с ГМ+. Назначение/снятие с должности (/post set, /post remove) доступны уже с ЗГМ+." },

    { id: uid(), track: "km-zgm", title: "Ошибочная квалификация нарушения модератором",
      situation: "Игрок продаёт игровую валюту за донат-баланс. Твой модератор расценил это как обмен на реальные деньги (п.8) и выдал глобальную блокировку. Согласен с решением?",
      answer: "Нет — внутриигровые ценности за донат-баланс это п.22 (разрешено, в рамках лимита объявлений), а не п.8 (который про реальные деньги). Модератор ошибся — как ЗГМ пересматриваю и снимаю неправомерную глобальную блокировку." },
    { id: uid(), track: "km-zgm", title: "Обход лимита через альтернативный аккаунт",
      situation: "Игрок использует второй аккаунт, чтобы обойти лимит в 2 объявления в сутки. Модератор хочет выдать за это простой мут. Поддерживаешь такое решение?",
      answer: "Нет — обход лимита через второй аккаунт для повторного размещения того же объявления расценивается строже простого спама, наказание должно быть жёстче мута (вплоть до блокировки). Корректирую решение модератора." },
    { id: uid(), track: "km-zgm", title: "Сторонний файл под видом читов",
      situation: "Модератор сообщает, что игрок скинул в беседу подозрительный исполняемый файл под видом читов. Модератор хочет выдать за это простой мут. Согласен?",
      answer: "Нет — распространение сторонних файлов наказывается глобальной блокировкой, а не мутом. Нужно скорректировать решение модератора." },
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
    newAttempt: { step: "setup", candidate: "", selected: [], verdicts: {}, randomCount: 5 },
  };
  // jsonblob перестал слать CORS-заголовки, kvdb.io и extendsclass.com
  // оказались нестабильны (500-е и обрывы CORS-preflight) — переехали на
  // jsonbin.io: платформа специально для таких клиентских приложений,
  // с master-ключом и стабильным CORS
  const REQUEST_TIMEOUT = 8000;
  const JSONBIN_MASTER_KEY = "$2a$10$9nGLARcNk9H49UQiej5nLOtG3pBSIcg8MkQZB4m3slOxeMl9o78Dy";

  // kvdb оставлен только на чтение — по старым ссылкам, которые уже
  // разошлись, чтобы они не сломались; новые хранилища через него не создаём
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

  // если выбранный провайдер недоступен, даём вторую попытку перед тем
  // как уходить в локальный режим — за это время он мог отойти
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

  // локальная копия пишется всегда — это подстраховка на случай,
  // если запрос к общему хранилищу вдруг не пройдёт
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
    const list = state.questions.filter(q => q.track === state.track);
    let html = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
        <div>
          <div class="section-title">Банк вопросов — ${esc(TRACKS[state.track].label)}</div>
          <div class="section-sub">${list.length} ${list.length === 1 ? "вопрос" : "вопросов"} в этом треке</div>
        </div>
        ${!state.formOpen ? `<button class="btn btn-primary" id="addBtn">+ Добавить вопрос</button>` : ""}
      </div>
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
      html += `<div class="empty"><div class="empty-title">Пока пусто</div><div class="empty-hint">Добавьте первый вопрос — кнопка сверху.</div></div>`;
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
    content.innerHTML = `
      <div class="section-title">История — ${esc(TRACKS[state.track].label)}</div>
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
