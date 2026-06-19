/**
 * bg-texture-system.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Système de background texturé générique pour tous les templates Élégance Digitale.
 *
 * UTILISATION dans un template :
 *
 *   import { getBgTextureCSS } from '@/lib/bg-texture-system'
 *
 *   // Dans le composant :
 *   <style>{getBgTextureCSS('bg-texture.jpg', BG_CONFIGS['bg-texture.jpg'])}</style>
 *
 *   // Wrapper unique avec la texture :
 *   <div className="ed-texture-bg">
 *     <section className="ed-hero">
 *       <div className="ed-content-zone">...contenu...</div>
 *     </section>
 *     <section className="ed-section">
 *       <div className="ed-content-zone">...contenu...</div>
 *     </section>
 *   </div>
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MAPPING des images (ajouter vos propres backgrounds ici) :
 *
 *   key        : nom du fichier (ex: 'bg-texture.jpg')
 *   imgW/imgH  : dimensions réelles du fichier en pixels
 *   x, y       : position de la zone vide en % de l'image (coin supérieur gauche)
 *   w, h       : dimensions de la zone vide en % de l'image
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface BgConfig {
  /** Largeur réelle de l'image en pixels */
  imgW: number
  /** Hauteur réelle de l'image en pixels */
  imgH: number
  /** Zone vide : position X en % depuis le bord gauche de l'image */
  x: number
  /** Zone vide : position Y en % depuis le haut de l'image */
  y: number
  /** Zone vide : largeur en % de la largeur totale de l'image */
  w: number
  /** Zone vide : hauteur en % de la hauteur totale de l'image */
  h: number
  /** Couleur de fond de secours si l'image ne charge pas */
  fallbackColor?: string
}

/**
 * Catalogue des backgrounds disponibles.
 * Ajouter une entrée par image ajoutée au projet.
 */
export const BG_CONFIGS: Record<string, BgConfig> = {
  'bg-texture.jpg': {
    imgW: 2304,
    imgH: 3832,
    x: 18,
    y: 15,
    w: 64,
    h: 70,
    fallbackColor: '#FAF7F0',
  },
  'bg-texture2.png': {
    imgW: 800,
    imgH: 1331,
    x: 18,
    y: 15,
    w: 64,
    h: 70,
    fallbackColor: '#F9F6EE',
  },
  'bg-texture4.png': {
    imgW: 800,
    imgH: 1331,
    x: 18,
    y: 15,
    w: 64,
    h: 70,
    fallbackColor: '#B5AFA8',
  },
  'decoration7.png': {
    imgW: 768,
    imgH: 1024,
    x: 15,
    y: 15,
    w: 70,
    h: 70,
    fallbackColor: '#EDE9E2',
  },
  'assets/template1/deco1.png': {
    imgW: 857,
    imgH: 1200,
    x: 15,
    y: 8,
    w: 70,
    h: 79,
    fallbackColor: '#EAE0D1',
  },
  'assets/template2/back2.png': {
    imgW: 857,
    imgH: 1200,
    x: 12,
    y: 12,
    w: 76,
    h: 76,
    fallbackColor: '#F0E5E3',
  },
}

/**
 * Génère le bloc CSS complet pour le système de texture.
 *
 * @param imagePath  Chemin public de l'image (ex: '/bg-texture.jpg')
 * @param cfg        Configuration de la zone vide (depuis BG_CONFIGS)
 * @param prefix     Préfixe CSS du template (ex: 'bs', 'aa', 'aq'…)
 *                   → génère .{prefix}-texture-bg et .{prefix}-content-zone
 */
export function getBgTextureCSS(
  imagePath: string,
  cfg: BgConfig,
  prefix: string = 'ed'
): string {
  const r = cfg.imgH / cfg.imgW          // ratio h/w  ex: 1.7778 pour 9:16
  const wRatio = cfg.imgW / cfg.imgH     // ratio w/h  ex: 0.5625 pour 9:16

  // ── MOBILE : image occupe 100vw, hauteur = r × 100vw ──
  const imgHeightVw = r * 100                          // ex: 177.78vw
  const mobileContentW = cfg.w                         // ex: 64vw
  const mobileMarginL = cfg.x                          // ex: 18vw
  const mobilePaddingY = round(cfg.y * r)              // ex: 26.67vw

  // ── DESKTOP : image occupe 100vh, largeur = wRatio × 100vh ──
  const imgWidthVh = round(wRatio * 100)               // ex: 56.25vh
  const desktopContentW = round(cfg.w * wRatio)        // ex: 36vh
  const desktopMarginH = round(cfg.x * wRatio)        // ex: 10.125vh
  const desktopPaddingY = cfg.y                        // ex: 15vh

  const bg = cfg.fallbackColor ?? '#FFFFFF'

  return `
  /* ═══════════════════════════════════════════════════
     SYSTÈME TEXTURE — généré par bg-texture-system.ts
     Image : ${imagePath} (${cfg.imgW}×${cfg.imgH})
     Zone vide : X=${cfg.x}%, Y=${cfg.y}%, W=${cfg.w}%, H=${cfg.h}%
     Préfixe : .${prefix}-*
  ═══════════════════════════════════════════════════ */

  /* Wrapper unique : fond texturé fixe */
  .${prefix}-texture-bg {
    width: 100%;
    background-image: url('${imagePath}');
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-color: ${bg};
  }

  /* ── MOBILE (≤ 768px) : image pleine largeur ── */
  @media (max-width: 768px) {
    .${prefix}-texture-bg {
      min-height: ${round(imgHeightVw)}vw;
      background-size: 100vw auto;
      background-position: top left;
    }
    /* Zone de contenu calée sur la zone vide du background */
    .${prefix}-content-zone {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
      width: ${mobileContentW}vw;
      margin-left: ${mobileMarginL}vw;
      margin-right: auto;
      padding-top: ${mobilePaddingY}vw;
      padding-bottom: ${mobilePaddingY}vw;
    }
  }

  /* ── DESKTOP (> 768px) : image pleine hauteur, centrée ── */
  @media (min-width: 769px) {
    .${prefix}-texture-bg {
      min-height: 100vh;
      background-size: auto 100vh;
      background-position: 50% 0%;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: scroll;
      scrollbar-gutter: stable;
    }
    /* Sections pleine largeur de l'image */
    .${prefix}-texture-bg > * {
      width: ${imgWidthVh}vh;
    }
    /* Zone de contenu calée sur la zone vide du background */
    .${prefix}-content-zone {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
      width: ${desktopContentW}vh;
      margin-left: ${desktopMarginH}vh;
      margin-right: ${desktopMarginH}vh;
      padding-top: ${desktopPaddingY}vh;
      padding-bottom: ${desktopPaddingY}vh;
    }
  }
`
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Helper pratique : retourne le CSS pour le background par défaut (bg-texture.jpg)
 * avec un préfixe donné.
 *
 * @example
 *   // Dans AlAsala.tsx :
 *   <style>{getDefaultBgCSS('aa')}</style>
 */
export function getDefaultBgCSS(prefix: string): string {
  return getBgTextureCSS('/bg-texture.jpg', BG_CONFIGS['bg-texture.jpg'], prefix)
}

/**
 * Helper : retourne le CSS pour un background choisi dynamiquement
 * (ex: depuis wedding.background_image).
 *
 * @example
 *   const bgKey = wedding.background_image ?? 'bg-texture.jpg'
 *   <style>{getBgCSSForKey(bgKey, 'bs')}</style>
 */
export function getBgCSSForKey(key: string, prefix: string): string {
  const cfg = BG_CONFIGS[key] ?? BG_CONFIGS['bg-texture.jpg']
  return getBgTextureCSS(`/${key}`, cfg, prefix)
}