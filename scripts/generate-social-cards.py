from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import textwrap

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "marketing" / "placas"
LOGO = ROOT / "public" / "assets" / "logo-mapa-clasificados-v2.png"

W = H = 1080
INK = "#15342d"
GREEN = "#276d55"
GREEN_DARK = "#164a39"
MINT = "#e8f3ec"
CREAM = "#fffdf8"
YELLOW = "#efb83e"
CORAL = "#e77c63"
MUTED = "#64736e"
WHITE = "#ffffff"

FONT = Path("C:/Windows/Fonts/arial.ttf")
BOLD = Path("C:/Windows/Fonts/arialbd.ttf")


def font(size, bold=False):
    return ImageFont.truetype(str(BOLD if bold else FONT), size=size)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def wrap_text(text, font_obj, max_width):
    words = text.split()
    lines = []
    current = ""
    dummy = Image.new("RGB", (10, 10))
    draw = ImageDraw.Draw(dummy)
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=font_obj)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_text_block(draw, text, x, y, max_width, size, fill, bold=False, line_gap=10):
    f = font(size, bold=bold)
    lines = wrap_text(text, f, max_width)
    for line in lines:
        draw.text((x, y), line, font=f, fill=fill)
        y += f.size + line_gap
    return y


def paste_logo(base, x, y, size=230, opacity=255):
    if not LOGO.exists():
        return
    logo = Image.open(LOGO).convert("RGBA")
    logo.thumbnail((size, size), Image.Resampling.LANCZOS)
    if opacity < 255:
        alpha = logo.getchannel("A").point(lambda p: int(p * opacity / 255))
        logo.putalpha(alpha)
    base.alpha_composite(logo, (x, y))


def brand_header(draw):
    rounded(draw, (70, 70, 130, 130), 18, GREEN)
    draw.text((92, 88), "CS", font=font(22, bold=True), fill=WHITE)
    draw.text((150, 82), "Guía Suárez", font=font(34, bold=True), fill=INK)
    draw.text((150, 120), "Comercios, profesionales y servicios", font=font(20), fill=MUTED)


def footer(draw):
    draw.text((70, 990), "guiasuarez.ar", font=font(34, bold=True), fill=GREEN_DARK)
    rounded(draw, (770, 965, 1010, 1024), 24, MINT, outline="#dce5df")
    draw.text((804, 981), "Publicá gratis", font=font(24, bold=True), fill=GREEN_DARK)


def base_canvas():
    img = Image.new("RGBA", (W, H), CREAM)
    draw = ImageDraw.Draw(img)
    draw.ellipse((620, 130, 1120, 630), fill="#f7d784")
    draw.ellipse((-180, 620, 350, 1150), fill=MINT)
    return img, draw


def card(filename, eyebrow, title, subtitle, badge=None, question_marks=False):
    img, draw = base_canvas()
    brand_header(draw)

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    rounded(sdraw, (70, 205, 690, 760), 42, (22, 74, 57, 22))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    img.alpha_composite(shadow)

    rounded(draw, (70, 190, 690, 745), 42, WHITE, outline="#dce5df", width=2)
    draw.text((115, 245), eyebrow.upper(), font=font(24, bold=True), fill=GREEN)
    y = draw_text_block(draw, title, 115, 302, 520, 66, INK, bold=True, line_gap=8)
    draw_text_block(draw, subtitle, 115, y + 28, 500, 30, MUTED, line_gap=8)

    paste_logo(img, 720, 310, 260)

    if badge:
        rounded(draw, (690, 690, 1010, 780), 32, GREEN_DARK)
        draw.text((730, 716), badge, font=font(32, bold=True), fill=WHITE)

    if question_marks:
        draw.text((770, 210), "?", font=font(118, bold=True), fill=CORAL)
        draw.text((910, 245), "?", font=font(76, bold=True), fill=GREEN_DARK)

    footer(draw)
    img.convert("RGB").save(OUT / filename, quality=94)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    cards = [
        (
            "01-menos-preguntar-mas-encontrar.png",
            "Guía local",
            "Menos preguntar, más encontrar.",
            "Buscá comercios, profesionales y servicios de Coronel Suárez en un solo lugar.",
            "Entrá y buscá",
            False,
        ),
        (
            "02-donde-encuentro-manicura.png",
            "¿Dónde encuentro?",
            "¿Dónde encuentro una manicura?",
            "Probá buscar por rubro en Guía Suárez. Simple, local y rápido.",
            "Belleza y bienestar",
            True,
        ),
        (
            "03-comercios-servicios-coronel-suarez.png",
            "Coronel Suárez",
            "Comercios y servicios cerca tuyo.",
            "Una guía práctica para encontrar opciones locales sin vueltas.",
            "Guía Suárez",
            False,
        ),
        (
            "04-publica-gratis-para-siempre.png",
            "Para comercios",
            "Publicá gratis para siempre.",
            "Sumá tu comercio, profesión o servicio y ayudá a completar la guía local.",
            "Sumá tu actividad",
            False,
        ),
        (
            "05-guarda-guia-suarez.png",
            "Dato útil",
            "Guardá Guía Suárez para cuando la necesites.",
            "Hoy quizás no buscás nada. Mañana podés necesitar un oficio, comercio o profesional.",
            "guiasuarez.ar",
            True,
        ),
    ]

    for args in cards:
        card(*args)

    captions = """# Captions para placas — Guía Suárez

## 01 — Menos preguntar, más encontrar
Cuando necesitás algo en Coronel Suárez, no siempre sabés por dónde empezar.

Guía Suárez reúne comercios, profesionales y servicios locales para que puedas buscar por rubro y encontrar más rápido.

https://guiasuarez.ar

## 02 — ¿Dónde encuentro una manicura?
¿Dónde encuentro una manicura? ¿Un electricista? ¿Un carpintero?

La idea de Guía Suárez es que esas búsquedas estén en un solo lugar.

Entrá y probá: https://guiasuarez.ar

## 03 — Comercios y servicios cerca tuyo
Comercios, profesionales y servicios de Coronel Suárez, organizados por rubro.

Una guía práctica para buscar mejor y perder menos tiempo.

https://guiasuarez.ar

## 04 — Publicá gratis para siempre
Si tenés un comercio, profesión, emprendimiento u oficio, podés sumarte a Guía Suárez.

Publicar es gratis para siempre.

https://guiasuarez.ar

## 05 — Guardá Guía Suárez
Guardá Guía Suárez para cuando la necesites.

Hoy quizás no buscás nada. Mañana podés necesitar un oficio, comercio, profesional o servicio local.

https://guiasuarez.ar
"""
    (OUT / "captions.md").write_text(captions, encoding="utf-8")
    print(f"Placas generadas en {OUT}")


if __name__ == "__main__":
    main()
