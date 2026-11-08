import json, re
M = json.load(open('/root/layers/meta.json'))
W, H, L = M['W'], M['H'], M['layers']
V = 'v5'  # cache-bust folder query

# per element: duration s, delay s, dx, dy (source px), rotation deg
P = {
 'pr':(12.8,-2.2,4.5,-6.0,2.24), 'film-tl':(15.8,-6.8,-4.5,4.5,-2.52), 'play-s':(9.8,-3.8,3.0,4.5,3.36), 'film-bl':(14.2,-9.0,-4.5,-4.5,-2.1),
 'timeline':(17.2,-5.2,4.5,-3.0,1.68), 'flower-l':(8.2,-1.5,3.0,-3.0,4.2), 'snake-l':(11.2,-6.0,-3.0,3.0,-3.5), 'leaves-l1':(9.0,-4.5,2.25,2.25,2.8),
 'leaves-l2':(12.0,-8.2,-2.25,3.0,-2.24), 'ae':(13.5,-3.0,-4.5,4.5,-2.24), 'keyframe':(15.0,-7.5,3.0,4.5,2.8), 'film-r':(12.0,-9.8,4.5,-4.5,2.52),
 'snake-r':(10.5,-0.8,3.0,-3.0,3.5), 'flower-r':(7.5,-5.2,-3.0,3.0,-4.2), 'leaves-r1':(9.8,-6.8,-2.25,2.25,-2.8), 'leaves-r2':(12.8,-3.0,2.25,-3.0,2.52),
 'reel':(16.5,-4.5,3.0,-3.0,0.0), 'scissors':(14.2,-10.5,-3.0,-3.0,1.68),
}
def pos(box, piv):
    x0, y0, x1, y1 = box; w, h = x1 - x0, y1 - y0
    return (f"left:{x0/W*100:.4f}%;top:{y0/H*100:.4f}%;width:{w/W*100:.4f}%;height:{h/H*100:.4f}%;"
            f"transform-origin:{(piv[0]-x0)/w*100:.2f}% {(piv[1]-y0)/h*100:.2f}%")
def sub(box, piv, parent):
    # child positioned inside parent's box
    px0, py0, px1, py1 = parent; pw, ph = px1 - px0, py1 - py0
    x0, y0, x1, y1 = box; w, h = x1 - x0, y1 - y0
    return (f"left:{(x0-px0)/pw*100:.4f}%;top:{(y0-py0)/ph*100:.4f}%;width:{w/pw*100:.4f}%;height:{h/ph*100:.4f}%;"
            f"transform-origin:{(piv[0]-x0)/w*100:.2f}% {(piv[1]-y0)/h*100:.2f}%")
def anim(n):
    d, dl, dx, dy, r = P[n]
    return f"--dx:{dx};--dy:{dy};--r:{r};animation-duration:{d}s;animation-delay:{dl}s"

src = lambda n: f'assets/bg-layers/{n}.webp?{V}'
html = ['<div class="bg" aria-hidden="true"><div class="bg-art">',
        f'  <img class="bg-base" src="assets/bg-layers/base.webp?{V}" srcset="assets/bg-layers/base-1200.webp?{V} 1200w, assets/bg-layers/base.webp?{V} 2172w" sizes="(max-aspect-ratio: 12/5) 240vh, 100vw" alt="" fetchpriority="high">',
        f'  <div class="ly ly-med" style="{pos(L["medallion"]["box"], L["medallion"]["piv"])}"><img src="{src("medallion")}" alt=""></div>']
order = ['leaves-l1','leaves-l2','leaves-r1','leaves-r2','flower-l','flower-r','snake-l','snake-r',
         'pr','film-tl','play-s','film-bl','timeline','ae','film-r']
for n in order:
    html.append(f'  <div class="ly drift" style="{pos(L[n]["box"], L[n]["piv"])};{anim(n)}"><img src="{src(n)}" alt=""></div>')
kf = L['keyframe']; dm = L['diamond']
html.append(f'  <div class="ly drift" style="{pos(kf["box"], kf["piv"])};{anim("keyframe")}"><img src="{src("keyframe")}" alt="">'
            f'<div class="ly ly-diamond" style="{sub(dm["box"], dm["piv"], kf["box"])}"><img src="{src("diamond")}" alt=""></div></div>')
rl = L['reel']
html.append(f'  <div class="ly drift" style="{pos(rl["box"], rl["piv"])};{anim("reel")}"><div class="ly ly-reel" style="left:0;top:0;width:100%;height:100%;transform-origin:{(rl["piv"][0]-rl["box"][0])/(rl["box"][2]-rl["box"][0])*100:.2f}% {(rl["piv"][1]-rl["box"][1])/(rl["box"][3]-rl["box"][1])*100:.2f}%"><img src="{src("reel")}" alt=""></div></div>')
sc = L['scissors']; b = sc['box']; o = f'{(sc["piv"][0]-b[0])/(b[2]-b[0])*100:.2f}% {(sc["piv"][1]-b[1])/(b[3]-b[1])*100:.2f}%'
html.append(f'  <div class="ly drift" style="{pos(b, sc["piv"])};{anim("scissors")}">'
            f'<div class="ly ly-blade-b" style="left:0;top:0;width:100%;height:100%;transform-origin:{o}"><img src="{src("scissor-b")}" alt=""></div>'
            f'<div class="ly ly-blade-a" style="left:0;top:0;width:100%;height:100%;transform-origin:{o}"><img src="{src("scissor-a")}" alt=""></div></div>')
html.append('</div></div>')
HTML = '\n'.join(html)

CSS = """.bg{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;overflow:hidden;pointer-events:none;background:#000;
  --bgh:max(80vh,33.34vw); /* rendered artwork height; lower 80vh = more zoomed out */
  --u:calc(var(--bgh) / 724); /* one source pixel of the 2172x724 artwork */
  --mx:50%;--mr:calc(var(--bgh) * .4392)} /* medallion at (1086,360) r=318 */
/* the artwork box: base image + animated cut-out layers, all positioned in % of the 2172x724 artwork */
.bg-art{position:absolute;left:50%;top:50%;height:var(--bgh);width:calc(var(--bgh) * 3);transform:translate(-50%,-50%);
  -webkit-mask-image:linear-gradient(to bottom,transparent,#000 9%,#000 91%,transparent);mask-image:linear-gradient(to bottom,transparent,#000 9%,#000 91%,transparent)}
.bg-base{position:absolute;inset:0;width:100%;height:100%;display:block}
.ly{position:absolute;will-change:transform}
.ly img{display:block;width:100%;height:100%}
.bg::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at var(--mx) 50%,rgba(0,0,0,calc(1 - var(--bg-brightness))) calc(var(--mr) * .92),rgba(0,0,0,calc(1 - var(--bg-brightness-outer))) calc(var(--mr) * 1.25))}
/* medallion: slow zoom in/out only (never below 1x, so nothing behind it is revealed) */
.ly-med{animation:med-pulse 11s ease-in-out infinite alternate}
@keyframes med-pulse{from{transform:scale(1)}to{transform:scale(1.035)}}
/* everything around it: slow, out-of-sync hovering like leaves on a branch (each layer has its own --dx/--dy/--r, duration, delay) */
.drift{animation:drift 16s ease-in-out infinite}
@keyframes drift{
  0%,100%{transform:translate(0,0) rotate(0deg)}
  33%{transform:translate(calc(var(--u) * var(--dx)),calc(var(--u) * var(--dy) * -.6)) rotate(calc(var(--r) * 1deg))}
  66%{transform:translate(calc(var(--u) * var(--dx) * -.5),calc(var(--u) * var(--dy))) rotate(calc(var(--r) * -.7deg))}
}
.ly-reel{animation:spin 65s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.ly-blade-a{animation:blade-a 5.5s ease-in-out infinite alternate}
.ly-blade-b{animation:blade-b 5.5s ease-in-out infinite alternate}
@keyframes blade-a{from{transform:rotate(0deg)}to{transform:rotate(-6deg)}}
@keyframes blade-b{from{transform:rotate(0deg)}to{transform:rotate(6deg)}}
.ly-diamond{animation:diamond 4.5s ease-in-out infinite alternate}
@keyframes diamond{from{transform:scale(1) rotate(0deg)}to{transform:scale(1.14) rotate(8deg)}}
@media (prefers-reduced-motion:reduce){.ly,.ly-med,.drift{animation:none!important}}
"""

idx = open('/root/site/index.html').read()
a = idx.index('<!-- Background artwork'); b2 = idx.index('<nav', a)
idx = idx[:a] + '<!-- Background artwork: static base (assets/bg-layers/base.webp = frame.png with the moving parts removed) + cut-out layers that drift independently. Generated by tools/bg-layers/build.py -->\n' + HTML + '\n\n' + idx[b2:]
idx = re.sub(r'<link rel="preload" as="image" href="assets/bg-v3.webp"[^>]*>',
             f'<link rel="preload" as="image" href="assets/bg-layers/base.webp?{V}" imagesrcset="assets/bg-layers/base-1200.webp?{V} 1200w, assets/bg-layers/base.webp?{V} 2172w" imagesizes="(max-aspect-ratio: 12/5) 240vh, 100vw" fetchpriority="high">', idx)
idx = re.sub(r'style\.css\?v=\d+', 'style.css?v=15', idx)
open('/root/site/index.html', 'w').write(idx)

css = open('/root/site/style.css').read()
a = css.index('/* Background artwork'); END = '@media (prefers-reduced-motion:reduce){.ly,.ly-med,.drift{animation:none!important}}'
b2 = css.index(END) + len(END) + 1
css = css[:a] + '/* Background artwork */\n' + CSS + css[b2:]
open('/root/site/style.css', 'w').write(css)
print('built')
