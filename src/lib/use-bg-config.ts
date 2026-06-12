/**
 * use-bg-config.ts
 * Calcule les valeurs CSS de positionnement du contenu
 * en fonction de la zone vide définie dans bg-config.json
 */

import bgConfig from './bg-config.json'

export type BgKey = keyof typeof bgConfig.backgrounds

export interface BgZoneCSS {
  // Mobile  (image = 100vw × ratioVw)
  mobile: {
    sectionWidth:    string  // '100vw'
    contentWidth:    string  // ex: '64vw'
    contentMarginL:  string  // ex: '18vw'
    paddingTop:      string  // ex: '26.67vw'
    paddingBottom:   string  // ex: '26.67vw'
  }
  // Desktop (image = 56.25vh × 100vh, centrée)
  desktop: {
    sectionWidth:    string  // ex: '56.25vh'
    contentWidth:    string  // ex: '36vh'
    paddingTop:      string  // ex: '15vh'
    paddingBottom:   string  // ex: '15vh'
  }
}

export function getBgZoneCSS(bgKey: BgKey): BgZoneCSS {
  const cfg = bgConfig.backgrounds[bgKey]
  const { width: imgW, height: imgH } = cfg.image
  const { x, y, width: zW, height: zH } = cfg.emptyZone

  // Ratio hauteur/largeur de l'image (ex: 2048/1152 = 1.7778)
  const hRatio = imgH / imgW  // ex: 1.7778 pour 9:16

  // Ratio largeur/hauteur (ex: 1152/2048 = 0.5625)
  const wRatio = imgW / imgH  // ex: 0.5625 pour 9:16

  // ── MOBILE ──
  // Image affichée : largeur = 100vw, hauteur = hRatio × 100vw
  const imageHeightVw = hRatio * 100  // ex: 177.78vw

  const mobile = {
    sectionWidth:   '100vw',
    contentWidth:   `${zW}vw`,
    contentMarginL: `${x}vw`,
    paddingTop:     `${round(y * hRatio)}vw`,        // y% de imageHeightVw
    paddingBottom:  `${round(y * hRatio)}vw`,
  }

  // ── DESKTOP ──
  // Image affichée : hauteur = 100vh, largeur = wRatio × 100vh
  const imageWidthVh = wRatio * 100  // ex: 56.25vh

  const desktop = {
    sectionWidth:  `${round(imageWidthVh)}vh`,
    contentWidth:  `${round(zW * imageWidthVh / 100)}vh`,  // zW% de imageWidthVh
    paddingTop:    `${y}vh`,                                // y% de 100vh
    paddingBottom: `${y}vh`,
  }

  return { mobile, desktop }
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Génère le bloc CSS complet pour .bs-content-zone et .bs-texture-bg
 * à injecter dynamiquement dans <style>
 */
export function generateBgCSS(bgKey: BgKey): string {
  const cfg = bgConfig.backgrounds[bgKey]
  const { mobile, desktop } = getBgZoneCSS(bgKey)
  const { width: imgW, height: imgH } = cfg.image
  const hRatio = imgH / imgW

  return `
  .bs-texture-bg {
    width: 100%;
    background-image: url('/${bgKey}');
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-color: #FAF7F0;
  }

  /* Mobile : image pleine largeur */
  .bs-content-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: ${mobile.contentWidth};
    margin-left: ${mobile.contentMarginL};
    margin-right: 0;
    padding-top: ${mobile.paddingTop};
    padding-bottom: ${mobile.paddingBottom};
  }

  @media (max-width: 768px) {
    .bs-texture-bg {
      min-height: ${round(hRatio * 100)}vw;
      background-size: 100vw auto;
      background-position: top center;
    }
    .bs-hero, .bs-section, .bs-rsvp, .bs-footer {
      width: 100%;
    }
  }

  /* Desktop : image pleine hauteur, centrée */
  @media (min-width: 769px) {
    .bs-texture-bg {
      min-height: 100vh;
      background-size: auto 100vh;
      background-position: center center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .bs-hero, .bs-section, .bs-rsvp, .bs-footer {
      width: ${desktop.sectionWidth};
    }
    .bs-content-zone {
      width: ${desktop.contentWidth};
      margin: 0 auto;
      padding-top: ${desktop.paddingTop};
      padding-bottom: ${desktop.paddingBottom};
    }
  }
  `
}