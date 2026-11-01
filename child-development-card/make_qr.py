# -*- coding: utf-8 -*-
import os
import qrcode

links = {
    "contact":      "https://disk.yandex.ru/i/Llb52xzpHLp8kA",
    "motivation":   "https://disk.yandex.ru/i/523U-rAqxknSvw",
    "behavior":     "https://disk.yandex.ru/i/G1hY7brTUPkjLw",
    "anxiety":      "https://disk.yandex.ru/i/Lj4zP8DK-xoePg",
    "aggression":   "https://disk.yandex.ru/i/2zDjYD-sb6cD9Q",
    "excitability": "https://disk.yandex.ru/i/Wdkgw0JWyrCZjQ",
    "selfesteem":   "https://disk.yandex.ru/i/hKooTMamb2SN2g",
    "adaptation":   "https://disk.yandex.ru/i/bqhwQOo0zyVXvw",
    "perception":   "https://disk.yandex.ru/i/vO8B40hpUl23fg",
    "attention":    "https://disk.yandex.ru/i/QfdR9RfG1xsf-w",
    "memory":       "https://disk.yandex.ru/i/O9E7kN4E1XJu7Q",
    "thinking":     "https://disk.yandex.ru/i/Gs2evFGmeTKuJw",
}

out_dir = "qr"
os.makedirs(out_dir, exist_ok=True)

for key, url in links.items():
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=1,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    filepath = os.path.join(out_dir, f"{key}.png")
    img.save(filepath)
    print(f"OK: {filepath}")

print("\nГотово! Все 12 QR сохранены в папку 'qr/'.")