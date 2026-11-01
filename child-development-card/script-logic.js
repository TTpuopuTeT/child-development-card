/* ============================================================
   script-logic.js — логика работы карты развития
   ------------------------------------------------------------
   - автозаполнение заключений (раздел VII)
   - авто-высота textarea
   - модальные окна (подсказки, дисклеймер)
   - «Другое» для ППк
   - подготовка и вызов печати
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

// ===== ПЕЧАТЬ =====
function prepareAndPrint() {
    // 1) сбрасываем прошлые пометки
    document.querySelectorAll('.hide-on-print').forEach(function (el) { el.classList.remove('hide-on-print'); });

    // 2) невыбранные чекбоксы/радио — прячем их label-обёртку
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(function (input) {
        var container = input.closest('label') || input.closest('li') || input.parentNode;
        if (!container) return;
        if (input.checked) {
            input.setAttribute('checked', 'checked');
        } else {
            container.classList.add('hide-on-print');
        }
    });

    // 3) пустые/заполненные текстовые поля и textarea
    document.querySelectorAll('input[type="text"], textarea').forEach(function (field) {
        if (field.classList.contains('sign-fio') || field.classList.contains('date-dash')) {
            field.setAttribute('value', field.value);
            return;
        }

        var isEmpty = field.value.trim() === '';
        if (!isEmpty) {
            field.setAttribute('value', field.value);
            if (field.tagName.toLowerCase() === 'textarea') field.textContent = field.value;
            return;
        }

        // ПУСТОЕ — решаем, что прятать
        if (field.tagName.toLowerCase() === 'textarea') {
            // заключения раздела VII не трогаем никогда
            if (field.id && field.id.indexOf('_conclusion_') !== -1) return;
            // textarea внутри таблицы — прячем только её саму
            if (field.closest('td') || field.closest('th')) {
                field.classList.add('hide-on-print');
                return;
            }
            var wrap = field.closest('.field');
            (wrap || field).classList.add('hide-on-print');
            return;
        }

        // input[type="text"]
        var inputWrap = field.closest('.field');
        (inputWrap || field).classList.add('hide-on-print');
    });

    // 4) пустые select — прячем .field
    document.querySelectorAll('select').forEach(function (select) {
        var text = select.options[select.selectedIndex].text;
        if (select.value === '' || text.indexOf('выберите') !== -1) {
            var w = select.closest('.field');
            if (w) w.classList.add('hide-on-print');
        }
    });

    // 5) строки таблиц — прячем ТОЛЬКО если ВСЕ поля пустые и нет ни одной галочки/радио
    //    ВАЖНО: строки, где нет полей (только текст) — НЕ прячем
    document.querySelectorAll('tbody tr').forEach(function (row) {
        // есть отмеченная галочка/радио — не трогаем
        if (row.querySelector('input[type="checkbox"]:checked, input[type="radio"]:checked')) return;

        // есть хоть одно непустое поле — не трогаем
        var hasFilled = false;
        row.querySelectorAll('textarea').forEach(function (ta) { if (ta.value && ta.value.trim() !== '') hasFilled = true; });
        if (hasFilled) return;
        row.querySelectorAll('input[type="text"]').forEach(function (inp) { if (inp.value && inp.value.trim() !== '') hasFilled = true; });
        if (hasFilled) return;
        row.querySelectorAll('select').forEach(function (sel) {
            if (sel.value !== '' && sel.options[sel.selectedIndex] && sel.options[sel.selectedIndex].text.indexOf('выберите') === -1) hasFilled = true;
        });
        if (hasFilled) return;

        // нет ни одного поля — не прячем (это просто текстовая строка, как в разделе VIII)
        var anyField = row.querySelector('input, textarea, select');
        if (!anyField) return;

        // все поля пустые — прячем строку
        row.classList.add('hide-on-print');
    });

    // 6) растягиваем textarea по содержимому (для печати)
    document.querySelectorAll('textarea').forEach(function (el) {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    });

    // 7) ждём загрузки QR-картинок, потом печатаем
    var qrImgs = Array.from(document.querySelectorAll('.qr-code img'));
    var pending = qrImgs.filter(function (img) { return !img.complete || img.naturalHeight === 0; });

    if (pending.length === 0) { window.print(); return; }

    var remaining = pending.length;
    var printed = false;
    function doPrint() { if (printed) return; printed = true; window.print(); }

    pending.forEach(function (img) {
        function done() { remaining--; if (remaining <= 0) doPrint(); }
        img.addEventListener('load', done);
        img.addEventListener('error', done);
    });
    setTimeout(doPrint, 4000);
}