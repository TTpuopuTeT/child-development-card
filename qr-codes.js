/* ============================================================
   qr-codes.js — QR-коды для подсказок
   ------------------------------------------------------------
   Генерация через api.qrserver.com.
   При ошибке загрузки или таймауту (4 сек) — fallback на ссылку.
   Диагностика: откройте консоль (F12) — будет лог по каждому QR.
   ============================================================ */
(function () {
    'use strict';

    // ---- Ссылки на Яндекс.Диск (по ключам data-key) ----
    var qrLinks = {
        contact:      'https://disk.yandex.ru/i/Llb52xzpHLp8kA',
        motivation:   'https://disk.yandex.ru/i/523U-rAqxknSvw',
        behavior:     'https://disk.yandex.ru/i/G1hY7brTUPkjLw',
        anxiety:      'https://disk.yandex.ru/i/Lj4zP8DK-xoePg',
        aggression:   'https://disk.yandex.ru/i/2zDjYD-sb6cD9Q',
        excitability: 'https://disk.yandex.ru/i/Wdkgw0JWyrCZjQ',
        selfesteem:   'https://disk.yandex.ru/i/hKooTMamb2SN2g',
        adaptation:   'https://disk.yandex.ru/i/bqhwQOo0zyVXvw',
        perception:   'https://disk.yandex.ru/i/vO8B40hpUl23fg',
        attention:    'https://disk.yandex.ru/i/QfdR9RfG1xsf-w',
        memory:       'https://disk.yandex.ru/i/O9E7kN4E1XJu7Q',
        thinking:     'https://disk.yandex.ru/i/Gs2evFGmeTKuJw'
    };

    var TIMEOUT_MS = 4000; // через сколько показать fallback-ссылку

    // ---- Создать <img> c QR ----
    function makeImg(key, url) {
        var img = document.createElement('img');
        var apiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=H&margin=1&data='
                   + encodeURIComponent(url);
        img.src = apiUrl;
        img.alt = 'QR: ' + key;
        img.setAttribute('width', '90');
        img.setAttribute('height', '90');
        img.setAttribute('loading', 'eager');
        img.setAttribute('decoding', 'sync');
        img.style.cssText = 'width:100%;height:100%;display:block;';

        var finished = false;

        function showFallback(reason) {
            if (finished) return;
            finished = true;
            console.warn('[qr-codes] fallback для "' + key + '": ' + reason);
            var span = document.createElement('span');
            span.style.cssText = 'font-size:8px;word-break:break-all;color:#666;display:block;padding:2px;text-align:center;line-height:1.2;';
            span.textContent = url;
            if (img.parentNode) img.parentNode.replaceChild(span, img);
        }

        img.onload = function () {
            if (finished) return;
            finished = true;
            console.log('[qr-codes] OK: ' + key);
        };

        img.onerror = function () {
            showFallback('ошибка загрузки картинки');
        };

        // страховка на случай «зависания» загрузки
        setTimeout(function () {
            if (!img.complete || img.naturalWidth === 0) {
                showFallback('таймаут ' + TIMEOUT_MS + ' мс');
            }
        }, TIMEOUT_MS);

        return img;
    }

    // ---- Заполнить все .qr-code[data-key] ----
    function populate() {
        var els = document.querySelectorAll('.qr-code[data-key]');
        console.log('[qr-codes] найдено элементов .qr-code[data-key]: ' + els.length);

        if (els.length === 0) {
            console.warn('[qr-codes] не найдено ни одного .qr-code[data-key]. ' +
                'Проверьте, что разметка панели QR загружена до вызова populate(), ' +
                'и что у элементов есть атрибут data-key.');
            return;
        }

        els.forEach(function (el) {
            var key = el.getAttribute('data-key');
            var url = qrLinks[key];
            if (!url) {
                console.warn('[qr-codes] нет ссылки для ключа "' + key + '"');
                return;
            }
            el.innerHTML = '';
            el.appendChild(makeImg(key, url));
        });
    }

    // ---- Точка входа: дождаться DOM ----
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', populate);
    } else {
        // DOM уже готов (defer / скрипт в конце body)
        populate();
    }

    // ---- Публичный API (ручной перезапуск, если понадобится) ----
    window.qrCodes = { populate: populate, links: qrLinks };
})();