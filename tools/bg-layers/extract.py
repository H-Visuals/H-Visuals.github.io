"""Split the hero artwork into a static base + independently animated layers.
Coordinates are in source pixels of assets/frame.png (2172x724)."""
import json, os, math
import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi

SRC = '/root/site/assets/frame.png'
OUT = '/root/site/assets/bg-layers'
os.makedirs(OUT, exist_ok=True)
img = np.array(Image.open(SRC).convert('RGB'))
H, W, _ = img.shape
lum = img.max(axis=2).astype(int)

# name: bbox (x0,y0,x1,y1), pivot (x,y), kind
EL = {
  'pr':        dict(box=(506, 94, 678, 258),  piv=(645, 240)),
  'film-tl':   dict(box=(738, 0, 897, 124),   piv=(765, 112)),
  'play-s':    dict(box=(503, 266, 592, 338), piv=(588, 308)),
  'film-bl':   dict(box=(478, 468, 614, 616), piv=(604, 520)),
  'timeline':  dict(box=(666, 586, 880, 724), piv=(752, 600)),
  'flower-l':  dict(box=(676, 104, 744, 174), piv=(706, 168)),
  'snake-l':   dict(box=(524, 350, 612, 448), piv=(612, 396)),
  'leaves-l1': dict(box=(588, 224, 702, 296), piv=(684, 282)),
  'leaves-l2': dict(box=(626, 474, 770, 622), piv=(724, 500)),
  'ae':        dict(box=(1296, 4, 1452, 146), piv=(1395, 138)),
  'keyframe':  dict(box=(1493, 18, 1634, 142), piv=(1558, 130)),
  'film-r':    dict(box=(1588, 294, 1738, 422), piv=(1598, 378)),
  'snake-r':   dict(box=(1536, 160, 1667, 230), piv=(1542, 206)),
  'flower-r':  dict(box=(1448, 174, 1507, 230), piv=(1466, 226)),
  'leaves-r1': dict(box=(1396, 112, 1482, 212), piv=(1440, 204)),
  'leaves-r2': dict(box=(1404, 418, 1502, 478), piv=(1432, 468)),
}
REEL = dict(c=(1583, 515), r=73)
SCISSORS = dict(box=(1340, 586, 1502, 712), piv=(1416, 652))
DIAMOND = dict(box=(1530, 40, 1592, 120), c=(1561, 80))
MED_C = (1086, 360)

_yy, _xx = np.mgrid[0:H, 0:W]
RING_ZONE = (_xx - MED_C[0]) ** 2 + (_yy - MED_C[1]) ** 2 <= 374 ** 2  # medallion + red ring: never part of a moving cut-out

def obj_mask(box, thr=42, fill=True):
    x0, y0, x1, y1 = box
    m = np.zeros((H, W), bool)
    sub = lum[y0:y1, x0:x1] > thr
    sub = ndi.binary_closing(sub, iterations=2)
    if fill:
        sub = ndi.binary_fill_holes(sub)
    lab, n = ndi.label(sub)
    if n:
        sizes = ndi.sum(sub, lab, range(1, n + 1))
        keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 120])
        sub = keep
    m[y0:y1, x0:x1] = sub
    return m & ~RING_ZONE

def dil(m, r):
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    return cv2.dilate(m.astype(np.uint8), k) > 0

def save_layer(name, mask, box):
    x0, y0, x1, y1 = box
    a = dil(mask, 2).astype(np.float32)
    a = cv2.GaussianBlur(a, (0, 0), 0.9)
    rgba = np.dstack([img, (np.clip(a, 0, 1) * 255).astype(np.uint8)])[y0:y1, x0:x1]
    Image.fromarray(rgba, 'RGBA').save(f'{OUT}/{name}.webp', quality=90, method=6)

meta = {}
erase = np.zeros((H, W), bool)

for name, e in EL.items():
    m = obj_mask(e['box'])
    save_layer(name, m, e['box'])
    erase |= dil(m, 4)
    meta[name] = dict(box=e['box'], piv=e['piv'])

# film reel: circle
cx, cy = REEL['c']; r = REEL['r']
yy, xx = np.mgrid[0:H, 0:W]
reel = (xx - cx) ** 2 + (yy - cy) ** 2 <= r * r
rbox = (cx - r - 3, cy - r - 3, cx + r + 4, cy + r + 4)
save_layer('reel', reel & (lum > 30) | ((xx - cx) ** 2 + (yy - cy) ** 2 <= (r - 4) ** 2), rbox)
erase |= dil(reel, 3)
meta['reel'] = dict(box=rbox, piv=REEL['c'])

# scissors: two blades split by polygons
sm = obj_mask(SCISSORS['box'], thr=60, fill=False)
bladeA_poly = np.array([(1342, 656), (1358, 646), (1398, 642), (1404, 637), (1468, 628), (1494, 632),
                        (1498, 648), (1470, 654), (1424, 664), (1408, 668), (1398, 684), (1376, 696),
                        (1350, 694), (1340, 674)], np.int32)
pa = np.zeros((H, W), np.uint8); cv2.fillPoly(pa, [bladeA_poly], 1)
A = sm & (pa > 0)
A = ndi.binary_fill_holes(A) if False else A
# blade A ring hole is background; fill ring holes so the hole shows its own (black) pixels
B = sm & ~(pa > 0)
save_layer('scissor-a', A | (ndi.binary_fill_holes(A) & (pa > 0)), SCISSORS['box'])
save_layer('scissor-b', B | ndi.binary_fill_holes(B), SCISSORS['box'])
erase |= dil(sm | ndi.binary_fill_holes(sm), 4)
meta['scissors'] = dict(box=SCISSORS['box'], piv=SCISSORS['piv'])

# keyframe inner diamond (sits on top of the keyframe layer, pulses >= 1x so it never reveals what is under it)
dx0, dy0, dx1, dy1 = DIAMOND['box']
sub = img[dy0:dy1, dx0:dx1].astype(int)
orange = (sub[..., 0] > 150) & (sub[..., 1] > 60) & (sub[..., 2] < 80)
dm = np.zeros((H, W), bool); dm[dy0:dy1, dx0:dx1] = ndi.binary_fill_holes(ndi.binary_closing(orange, iterations=2))
lab, n = ndi.label(dm); sizes = ndi.sum(dm, lab, range(1, n + 1)); dm = lab == (int(np.argmax(sizes)) + 1)
save_layer('diamond', dm, DIAMOND['box'])
meta['diamond'] = dict(box=DIAMOND['box'], piv=DIAMOND['c'])

# medallion: inside the wavy outer edge of the red ring
mx, my = MED_C
angs = np.deg2rad(np.arange(0, 360, 0.5))
rad = []
for t in angs:
    last = 300
    for rr in range(300, 380):
        x = int(round(mx + rr * math.cos(t))); y = int(round(my + rr * math.sin(t)))
        if not (0 <= x < W and 0 <= y < H):
            break
        p = img[y, x]
        if p[0] > 110 and p[1] < 80 and p[2] < 70:
            last = rr
        elif rr - last > 3:
            break
    rad.append(last)
rad = np.array(rad, float)
rad = ndi.median_filter(rad, size=9, mode='wrap')
rad = np.clip(rad, 318, 352) + 1
poly = np.array([(mx + r_ * math.cos(t), my + r_ * math.sin(t)) for r_, t in zip(rad, angs)], np.int32)
mm = np.zeros((H, W), np.uint8); cv2.fillPoly(mm, [poly], 1)
mbox = (mx - 360, max(0, my - 360), mx + 361, min(H, my + 361))
save_layer('medallion', mm > 0, mbox)
meta['medallion'] = dict(box=mbox, piv=MED_C)

# base: everything that moves is inpainted out (medallion stays: it only ever scales UP, so nothing under it shows)
base = cv2.inpaint(img, (erase & ~(mm > 0)).astype(np.uint8) * 255, 7, cv2.INPAINT_TELEA)
Image.fromarray(base).save(f'{OUT}/base.webp', quality=88, method=6)
Image.fromarray(base).resize((1200, 400), Image.LANCZOS).save(f'{OUT}/base-1200.webp', quality=88, method=6)
Image.fromarray(base).save('/root/layers/base_preview.png')

json.dump(dict(W=W, H=H, layers=meta), open('/root/layers/meta.json', 'w'), indent=1)
print('ok', {k: os.path.getsize(f'{OUT}/{k}.webp') for k in list(meta) if k != 'scissors'})
