/* ============================================================
   script-logic.js — логика работы карты развития
   ------------------------------------------------------------
   - автозаполнение заключений (раздел VII)
   - авто-высота textarea
   - модальные окна (подсказки, дисклеймер)
   - «Другое» для ППк
   - печать с клонированием textarea в div (весь текст целиком)
   ============================================================ */

// ===== АВТОЗАПОЛНЕНИЕ ЗАКЛЮЧЕНИЙ (РАЗДЕЛ VII) =====
var levelDescriptions = {
    articulation: {
        'Низкий':  'недостаточность моторных функций артикуляционного аппарата',
        'Средний': 'моторные функции сформированы не в полном объёме, наблюдается неточность движений',
        'Высокий': 'все движения артикуляционного аппарата выполняются точно, в полном объёме'
    },
    motor: {
        'Низкий':  'напряжённость и нескоординированность движений, ручная неловкость',
        'Средний': 'недостаточная скоординированность движений, колебания темпа',
        'Высокий': 'хорошая согласованность, точность и плавность движений'
    },
    sound: {
        'Низкий':         'звук отсутствует, искажается или систематически заменяется',
        'Средний':        'звук правильный изолированно, но в спонтанной речи искажается',
        'Выше среднего':  'в целом владеет, но иногда допускает неточности',
        'Высокий':        'все звуки произносит чётко в любых речевых ситуациях'
    },
    phonemic: {
        'Низкий':  'процессы фонематического анализа и синтеза не сформированы',
        'Средний': 'при выполнении сложных заданий нуждается в помощи взрослого',
        'Высокий': 'безошибочно различает на слух фонемы, близкие по звучанию'
    },
    vocabulary: {
        'Низкий':  'объём активного словаря заметно ограничен',
        'Средний': 'объём близок к норме, но преобладают существительные и глаголы',
        'Высокий': 'словарь обширен, использует синонимы, антонимы, разные части речи'
    },
    grammar: {
        'Низкий':  'частые грамматические ошибки, не умеет строить сложные предложения',
        'Средний': 'допускает ошибки в согласовании, образовании слов, но структура предложений сохранена',
        'Высокий': 'правильно использует различные синтаксические конструкции, словообразование'
    },
    coherent: {
        'Низкий':       'с трудом поддерживает разговор, пересказывает только с помощью взрослого',
        'Средний':      'может пересказать небольшое произведение, но испытывает трудности в подборе слов',
        'Достаточный':  'испытывает некоторые трудности при переходе от одной части рассказа к другой',
        'Высокий':      'самостоятельно пересказывает, составляет рассказы по картине, из личного опыта'
    },
    orientation: {
        'Низкий':  'слабо ориентируется на собственном теле, в пространстве «от себя»',
        'Средний': 'ориентируется на собственном теле, но затрудняется в макропространстве',
        'Высокий': 'уверенно ориентируется на теле, в пространстве и на плоскости листа'
    }
};

// ===== АВТО-ВЫСОТА TEXTAREA =====
function autoResizeTextarea(el) {
    if (!el || el.offsetParent === null) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

document.addEventListener('input', function (e) {
    if (e.target && e.target.tagName === 'TEXTAREA') autoResizeTextarea(e.target);
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('textarea').forEach(autoResizeTextarea);
});

// ===== АВТОЗАПОЛНЕНИЕ ЗАКЛЮЧЕНИЙ =====
document.addEventListener('change', function (e) {
    if (e.target.classList.contains('level-radio') && e.target.checked) {
        var targetId = e.target.getAttribute('data-target');
        var level    = e.target.getAttribute('data-level');
        if (targetId && level) {
            var targetTextarea = document.getElementById(targetId);
            if (targetTextarea) {
                var key = e.target.name.split('_')[0];
                var descObj = levelDescriptions[key];
                targetTextarea.value = (descObj && descObj[level]) ? descObj[level] : level;
                autoResizeTextarea(targetTextarea);
            }
        }
    }
});

// ===== МОДАЛЬНЫЕ ОКНА =====
function openInfo(key) {
    var data = (typeof infoData !== 'undefined') ? infoData[key] : null;
    if (!data) return;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDescription').innerHTML = data.text;
    document.getElementById('infoModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeInfo() {
    document.getElementById('infoModal').classList.remove('active');
    document.body.style.overflow = '';
}
document.getElementById('infoModal').addEventListener('click', function (e) { if (e.target === this) closeInfo(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeInfo(); });

// ===== ДИСКЛЕЙМЕР =====
function openDisclaimer() {
    document.getElementById('disclaimerModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeDisclaimer() {
    document.getElementById('disclaimerModal').classList.remove('active');
    document.body.style.overflow = '';
}
document.getElementById('disclaimerModal').addEventListener('click', function (e) { if (e.target === this) closeDisclaimer(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDisclaimer(); });

// ===== «ДРУГОЕ» ДЛЯ ППк =====
document.addEventListener('DOMContentLoaded', function () {
    var pt = document.querySelector('.psycho-other-toggle');
    var lt = document.querySelector('.logoped-other-toggle');
    var dt = document.querySelector('.defect-other-toggle');
    if (pt) pt.addEventListener('change', function () {
        document.getElementById('psycho-other-field').classList.toggle('visible', this.checked);
    });
    if (lt) lt.addEventListener('change', function () {
        document.getElementById('logoped-other-field').classList.toggle('visible', this.checked);
    });
    if (dt) dt.addEventListener('change', function () {
        document.getElementById('defect-other-field').classList.toggle('visible', this.checked);
    });
});

// ===== ПЕЧАТЬ: клонирование textarea в div =====
function prepareAndPrint() {
    // 0) чистим прошлые клоны и пометки
    document.querySelectorAll('.hide-on-print').forEach(function (el) { el.classList.remove('hide-on-print'); });
    document.querySelectorAll('.print-textarea').forEach(function (el) { el.remove(); });
    document.querySelectorAll('textarea').forEach(function (el) {
        el.dataset.wasHidden = '';
    });

    // 1) невыбранные чекбоксы/радио — прячем их label-обёртку
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(function (input) {
        var container = input.closest('label') || input.closest('li') || input.parentNode;
        if (!container) return;
        if (input.checked) {
            input.setAttribute('checked', 'checked');
        } else {
            container.classList.add('hide-on-print');
        }
    });

    // 2) текстовые input — прячем пустые .field
    document.querySelectorAll('input[type="text"]').forEach(function (field) {
        if (field.classList.contains('sign-fio') || field.classList.contains('date-dash')) {
            field.setAttribute('value', field.value);
            return;
        }
        var isEmpty = field.value.trim() === '';
        var wrap = field.closest('.field');
        if (isEmpty) {
            (wrap || field).classList.add('hide-on-print');
        } else {
            field.setAttribute('value', field.value);
        }
    });

    // 3) пустые select — прячем .field
    document.querySelectorAll('select').forEach(function (select) {
        var text = select.options[select.selectedIndex].text;
        if (select.value === '' || text.indexOf('выберите') !== -1) {
            var w = select.closest('.field');
            if (w) w.classList.add('hide-on-print');
        }
    });

    // 4) КЛЮЧЕВОЕ: клонируем ВСЕ непустые textarea в <div class="print-textarea">
    document.querySelectorAll('textarea').forEach(function (ta) {
        var isEmpty = ta.value.trim() === '';
        var isConclusion = ta.id && ta.id.indexOf('_conclusion_') !== -1;

        if (isEmpty) {
            // пустое — прячем (как раньше)
            if (isConclusion) {
                // заключения не трогаем — они и так пустые и не нужны в печати,
                // но если вдруг понадобятся — их просто не будет видно
            } else if (ta.closest('td') || ta.closest('th')) {
                ta.classList.add('hide-on-print');
            } else {
                var wrap = ta.closest('.field');
                (wrap || ta).classList.add('hide-on-print');
            }
            return;
        }

        // непустое — создаём div-клон с тем же текстом
        var div = document.createElement('div');
        div.className = 'print-textarea';
        div.textContent = ta.value;

        // копируем размерные классы
        if (ta.classList.contains('long-field')) div.style.minHeight = '70px';
        if (ta.classList.contains('dash-placeholder-xl')) div.style.minWidth = '300px';
        if (ta.classList.contains('dash-placeholder-long')) div.style.minWidth = '200px';

        // вставляем div сразу после textarea
        ta.parentNode.insertBefore(div, ta.nextSibling);

        // скрываем оригинальную textarea на время печати
        ta.dataset.wasHidden = '1';
        ta.classList.add('hide-on-print');
    });

    // 5) строки таблиц — прячем ТОЛЬКО если все поля пустые и нет галочек/радио
    document.querySelectorAll('tbody tr').forEach(function (row) {
        if (row.querySelector('input[type="checkbox"]:checked, input[type="radio"]:checked')) return;

        var hasFilled = false;

        // есть непустая textarea (не скрытая)
        row.querySelectorAll('textarea').forEach(function (ta) {
            if (!ta.classList.contains('hide-on-print') && ta.value && ta.value.trim() !== '') hasFilled = true;
        });
        if (hasFilled) return;

        // есть div-клон с текстом
        row.querySelectorAll('.print-textarea').forEach(function (d) {
            if (d.textContent && d.textContent.trim() !== '') hasFilled = true;
        });
        if (hasFilled) return;

        // есть непустой input[type=text]
        row.querySelectorAll('input[type="text"]').forEach(function (inp) {
            if (inp.value && inp.value.trim() !== '') hasFilled = true;
        });
        if (hasFilled) return;

        // есть выбранный select
        row.querySelectorAll('select').forEach(function (sel) {
            if (sel.value !== '' && sel.options[sel.selectedIndex] && sel.options[sel.selectedIndex].text.indexOf('выберите') === -1) hasFilled = true;
        });
        if (hasFilled) return;

        // нет ни одного поля — не прячем
        var anyField = row.querySelector('input, textarea, select, .print-textarea');
        if (!anyField) return;

        // все поля пустые — прячем строку
        row.classList.add('hide-on-print');
    });

    // 6) функция восстановления после печати
    function restore() {
        document.querySelectorAll('.print-textarea').forEach(function (el) { el.remove(); });
        document.querySelectorAll('textarea').forEach(function (el) {
            if (el.dataset.wasHidden === '1') {
                el.classList.remove('hide-on-print');
                el.dataset.wasHidden = '';
            }
        });
    }

    // 7) ждём загрузки QR-картинок, потом печатаем
    var qrImgs = Array.from(document.querySelectorAll('.qr-code img'));
    var pending = qrImgs.filter(function (img) { return !img.complete || img.naturalHeight === 0; });

    if (pending.length === 0) {
        window.print();
        setTimeout(restore, 200);
        return;
    }

    var remaining = pending.length;
    var printed = false;
    function doPrint() {
        if (printed) return;
        printed = true;
        window.print();
        setTimeout(restore, 200);
    }

    pending.forEach(function (img) {
        function done() { remaining--; if (remaining <= 0) doPrint(); }
        img.addEventListener('load', done);
        img.addEventListener('error', done);
    });
    setTimeout(doPrint, 4000);
}
