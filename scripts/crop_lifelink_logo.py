from pathlib import Path

from PIL import Image


SOURCE = Path('/home/ubuntu/webdev-static-assets/lifelink-official-logo.jpg')
OUTPUT = Path('/home/ubuntu/webdev-static-assets/lifelink-official-logo-lockup.jpg')


def main() -> None:
    with Image.open(SOURCE) as source:
        # The crop preserves the complete supplied icon, wordmark, and tagline,
        # removing only non-brand whitespace around the lockup.
        cropped = source.crop((135, 145, 885, 395))
        cropped.save(OUTPUT, format='JPEG', quality=95, optimize=True)


if __name__ == '__main__':
    main()
