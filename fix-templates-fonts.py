#!/usr/bin/env python3
"""
Modifie les 9 templates d'invitation pour :
  1. Ajouter l'import FontOverride et l'injecter dans le JSX (police dynamique)
  2. Retirer le nom des mariés en français dans les 3 templates arabes
     (Bismillah, AlAsala, AlQamar)

Usage:
    1. Place ce fichier à la racine du projet
    2. Exécute: python fix-templates-fonts.py
    3. Vérifie `git diff src/components/templates/` puis commit
"""

import re
import sys
from pathlib import Path

TEMPLATES_DIR = Path('src/components/templates')

# (filename, container className racine, has_french_subtitle?)
TEMPLATES = [
    # French templates
    ('BlancDore.tsx',     'ed-container', False),
    ('NuitEtoilee.tsx',   'ne-container', False),
    ('JardinAndalou.tsx', 'ja-container', False),
    ('Minimaliste.tsx',   'mn-container', False),
    ('RosePoudre.tsx',    'rp-container', False),
    ('MarbreNoir.tsx',    'mb-container', False),
    # Arabic templates (need French names removed)
    ('Bismillah.tsx',     'bs-container', True),
    ('AlAsala.tsx',       'aa-container', True),
    ('AlQamar.tsx',       'aq-container', True),
]

# Selectors par template pour retirer les noms français (sous-titres FR dans templates AR)
FRENCH_NAMES_PATTERNS = {
    'Bismillah.tsx': r'\s*\{\(wedding\.bride_name_ar \|\| wedding\.groom_name_ar\) && \(\s*\n\s*<p className="bs-names-fr">\{wedding\.bride_name\} & \{wedding\.groom_name\}</p>\s*\n\s*\)\}\s*\n',
    'AlAsala.tsx':   r'\s*\{\(wedding\.bride_name_ar \|\| wedding\.groom_name_ar\) && \(\s*\n\s*<p className="aa-names-fr">\{wedding\.bride_name\} & \{wedding\.groom_name\}</p>\s*\n\s*\)\}\s*\n',
    'AlQamar.tsx':   r'\s*\{\(wedding\.bride_name_ar \|\| wedding\.groom_name_ar\) && \(\s*\n\s*<p className="aq-names-fr">\{wedding\.bride_name\} & \{wedding\.groom_name\}</p>\s*\n\s*\)\}\s*\n',
}


def add_font_override_import(content: str) -> tuple[str, bool]:
    """Ajoute l'import FontOverride après les autres imports si pas déjà présent."""
    if 'FontOverride' in content:
        return content, False

    # Cherche le dernier import et insère juste après
    # Pattern : ligne import qui se termine par une newline
    matches = list(re.finditer(r"^import .+?$", content, re.MULTILINE))
    if not matches:
        return content, False

    last_import = matches[-1]
    insert_pos = last_import.end()
    new_import = "\nimport FontOverride from '@/components/common/FontOverride'"
    content = content[:insert_pos] + new_import + content[insert_pos:]
    return content, True


def add_font_override_jsx(content: str, container_class: str) -> tuple[str, bool]:
    """Ajoute <FontOverride .../> juste après le </style> du template."""
    if '<FontOverride' in content:
        return content, False

    # Cherche la première occurrence de </style> (la balise CSS inline du template)
    pattern = re.compile(r'(</style>)')
    match = pattern.search(content)
    if not match:
        return content, False

    insert = (
        '</style>\n'
        f'      <FontOverride font={{wedding.custom_font}} container=".{container_class}" />'
    )
    content = content[:match.start()] + insert + content[match.end():]
    return content, True


def remove_french_names(content: str, filename: str) -> tuple[str, bool]:
    """Retire le sous-titre noms français dans les templates arabes."""
    pattern = FRENCH_NAMES_PATTERNS.get(filename)
    if not pattern:
        return content, False

    new_content, n = re.subn(pattern, '\n', content)
    return new_content, (n > 0)


def fix_template(filename: str, container: str, has_fr_subtitle: bool) -> str:
    path = TEMPLATES_DIR / filename
    if not path.exists():
        return f'⚠  {filename:25s} → FICHIER INTROUVABLE'

    content = path.read_text(encoding='utf-8')
    original = content
    actions = []

    # 1. Import FontOverride
    content, imp_added = add_font_override_import(content)
    if imp_added:
        actions.append('import')

    # 2. JSX <FontOverride .../>
    content, jsx_added = add_font_override_jsx(content, container)
    if jsx_added:
        actions.append('jsx')

    # 3. Retirer noms FR (templates arabes uniquement)
    if has_fr_subtitle:
        content, removed = remove_french_names(content, filename)
        if removed:
            actions.append('noms-fr-retirés')

    if content == original:
        return f'✓  {filename:25s} → déjà à jour'

    path.write_text(content, encoding='utf-8')
    return f'✓  {filename:25s} → {", ".join(actions)}'


def main():
    if not TEMPLATES_DIR.exists():
        print(f'❌ Dossier introuvable: {TEMPLATES_DIR}')
        print('   Lance ce script depuis la racine du projet.')
        sys.exit(1)

    print(f'\n🎨 Application des polices dynamiques sur {len(TEMPLATES)} templates...\n')

    for filename, container, has_fr in TEMPLATES:
        print('  ' + fix_template(filename, container, has_fr))

    print('\n✅ Terminé. Vérifie avec `git diff src/components/templates/` avant de commit.')
    print('💡 N\'oublie pas d\'exécuter aussi la migration SQL pour ajouter la colonne custom_font.')


if __name__ == '__main__':
    main()