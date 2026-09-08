/* Live subscriber counts via the YouTube Data API v3.
   1. Create a key at console.cloud.google.com → APIs & Services → Credentials (enable "YouTube Data API v3").
   2. Restrict the key to your GitHub Pages domain (HTTP referrer) so it can't be abused.
   3. Paste it below and fill in each creator's @handle (from their channel URL).
   Numbers already in the HTML stay as fallbacks if the request fails or the key is empty.
   Instagram / X follower counts have no public API — leave those as "static". */

const YT_API_KEY = "AIzaSyBzZ_qvdJ1qqrMIwhr3YALBlP3CBYKOHR0";

const CREATORS = [
  { id: "hamza",        handle: "hamza97" },
  { id: "mike-mew",     handle: "mewingbymikemew" },
  { id: "jack-hopkins", handle: "JackhopkinsCEO" },
  { id: "sam-harborne", handle: "SamHarborneUncut" },
  { id: "sal-sanchez",  handle: "Salsanchez_" },
  { id: "sol-brah",     handle: "realsolbrah" },
];

const CACHE_KEY = "hv-sub-counts-v2";

/* YouTube video IDs (the part after v= or youtu.be/) of videos you edited — their view counts are summed into the hero stat. */
const LONG_IDS = ["hHQrqHPP1YE","gzoa0yQmETI","JjggBNdb7Ag","YLt1gNHl1aM","vJhMwyXCnVw","w3PufUlrr78","qD3Swn1JmUQ","mJnVU7hWY0w","AcP1mZIZxd0","7GlzOORaUyU","0pS1r_VuiJg","6NKIxjNZg4M","rO6HqfqBY80","mE8sEEmcIjk","r3QCPV84SbM","Ol9RGLf5Q8k","V8t6F6kl5rc","4OmQvjjEkq4","S41d5dNGJR0","hwYZLtvDw8M","PRr-ndjY4Ls","m3w41stqJTE","XfN2CskikOE","0GfL_Zif8GE","cy1EHStTq-g","CvMlGvrn9OE","FBttmRL-VGo","LwsZs5BPy4E","YBSQsMNeiGs","vahu_7-Eh8M","suH5wN1dYKc","MZZ2LGhmVK4","JwM5VoXbeac","3xfFTQklq3w","j0F5QNeIu6o","-6BlKCS1_KM","VSMcBnahBTQ","jelDZ0DrhmY","shU_gV5Xq-Q","AcGAB2hgkiI","gnyKxVdYlFk","lYrP9E1vWg4","PYUuvirONjs","pQ39I32DXdY","DnoIggiRcU4","Wo4JNCMS5hw","Q_vnMGzV59g","VZGZdl-xJfU","SYcgC9JvitY","IGEVzyq68ao","FTNDsLuo8o0","vp9r9I-3ewU","7JSIQ-7fVlY","0BYU9jzjaDk","czcRZrVu6vE","GnLwhRDwVSE","VOtRcCatbxo","j3xlJ7vghxU","z8WlcYfoslk","sKwZmWTJU3c","6lMK8lPhwGo","Nw2BXnUlTMc","AjRB6SkBNj4","9RL86lQHitQ","5z4I1ohe7DQ","VBjHfJWukkU","yRqnobbsuBo","hyaJnsrUxMA","yHCAViq8Wq0","w_DGPLyMdWI","2i-vc52vcm0","VwEKO2XkKL8","K18IddYIPWE","UXOA669hoLk","nOI--Uh67H0","8yvEMvbxvfc","bReNqAlgp2w","t-fpKy6HR5Q","m-V3GlCpOvc","hLofOFus9sE","5j6sZwZ_YUw","5GI708osBKM","ps6LPEZbjPQ","m3pEsjburQU","Ja41xp5dBsM","ZcEGB0YRib4","PrRx4KSUOtA","-yztyjt59K4","a8fe8tSWgec","v0E-JQl3QXE","VBAkhWftpuo","1eC41f8uWpg","QXMDwdx5kfw","gEx3wix0jqQ","MMhUz4NlHrk","UfTH7vh6o2E","eoxK0Cs7sRI","o0k_FxHlBlQ","85_t-0iwAQg","he0EWmZlUi0","jlP19m73RPc","kAiAn3QR4P0","o4TMjuyGPNU","efJY17N7b6Y","wP5PPCeyaBs","MjwrCihm65E","FSMqNG_ORBk","1nit84hme0g","wGj7rOw7GV4","4x1Y2P1zPhA","SzYImP_tLM0","8GkX9gGaYDU","nty7atf_r_w","DL9AQ9kqXnE","9bAghbfV0nI","e_HW198dw9A","xhd0FHSsDI8","Q_cmtYyy9NA","sYDgmyDUuvc","RjORnxtq8zA","keGWLDXzLEY","a-ofRBvxGGE","_dGnmEde-g4","HaAB5jjUdr8","J5v2afNJ_Ng","INNz6skKJko","bIkd1HYUiUU","iGZmx336Mj8","3ZALq4cjisI","GyaqdHLbw58","NhFAIVsjWn4","ALxGi82uh1I","of3zHIFw_5A","KfVXKXeJ09w","5c55M6s3skI","evUdPLSuFyU","RK8hldhZ2EE","Xu7VAs8L3G0","hBq-dYUw_wc","FUVtMpj019k","5hC9qNSgSoM","Pnr-RY1nUCE","Tnk8hEIEVR8","MMCfc1di0J8","b1fh3q_tpuI","m-cd8cFuFCI","VdmHc2EADXs","Ey7Bs3xlYNk","cBCIHpgUFkM","S3isabRv4iw","1hqInUean74","25ub0QgbOVY","1sUKPAWelk8","UO-Y65Ng1pY","ib_X9yG3E98","jHbfqacKHmk","h6e4jgIcKsY"];
const SHORT_IDS = ["vtG6oZFp7vc","PWyarG2_pH4","l9sAg7kJbRM","5BtcJR4T5I8","E_-Gt3K20OE","e7LoE8oGwBA","I2xeWgG1I4A","AUfjWhMgYYY","IwIiPxFlJbU","SaeUNyLD8Ag","fs2xPlX-5M8","t_2NiEtxc6U","q5zOB-H3Z4E","Vt-W9htkQwA","DbmsdgWPPtU","_2zeNP27wck","M02rn_3uH4k","KgWR3f2SLxQ","RXWTqkfd9rQ","wnBo6bN3jNE","sMu2sIK0t2E","lj5BheI6F10","zosnG-k5z4I","FE4CFS5a_VQ","2M548ZRcPPM","plDlz0-oaQc","d428KAhk_SI","H7B_aBkdYfw","TafP0dGlQC8","M9xeAlXK2k0","Nmp1EPEt7YY","XCxOYCMBft8","SzSDLjUr0MY","-lx7RC9oNhk","J8bh88vR-9E","C4cW5R6v45c","46zFHG_GzjE","taLO6RRh-CI","pcKpSyU_pCw","0H5Rix_5brw","SR16oVPfdEo","xwNJ05bJrF8","8ageX_2lepg","aJsEhqtYAQ8","6bj2zDTsU-w","yDtXPC2D-F0","y3UA-UsUiZc","h2CdzREJHBk","59ex3QQceYI","U8PGAl8y4qY","iLRc6_skhp8","EjAnKhrqV74","4MWminYD0Fk","dBNrpeCjcJI","peA-7e5EJcE","hKVfrahq1z4","GU_Nxw4ycXw","IdT2PGzVgRA","tqQUpZCGxBk","EqDOnfo4QLo","k0CEZrsEWQw","CytgNu2jE6k","Sts4SHI22Uw","UL0ywlsPcic","r8l8g8Wt9r0","nkGrrR5pX7g","6yG87JEnqbo","NSflT7fyeMQ","sU8lLL4-3yo","tvPTbXyNwYU","hsjV8P1ZEZk","iMADdc3wBN0","hJ0c95BQ2EA","jDuQKtH0pTI","ShFuacjvf_Y","4LXp1eqs9Wk","KSN0u0JbIMQ","xmsVuCj9zqM","LHl4OBGehhg","y_rlb9ICB9w","ilrHIPoy_W0","2-u08F3hoMI","aJZBKTzqopY","pT485n9M2fI","8Y6RSQbdW6I","n8IfA9cmWWQ","2ydVWO0j2s0","mlktEEcU57g","THOTY9L7Pd8","JdkSCd5jHds","S1AaaAM-kd8","7aFYO27CW2E","MxxQwadcpxs","ReYLvDKiF0k","-11lsFAKl1k","xbiWBj8DEnw","aAPU9B4xERs","sIU9-qpGt2Y","VXYUVlSs8tI","ojLkCVA8w3w","15df_UnWmXo","bKR5qXKoVXg","Ib6vNaziyyY","1sdwxOcTKCQ","w7p9110fdo0","pJp2Gbzve34","CJprqRgc2Js","fnx-kRN4wkg","Bz0AsJNRpfI","m3G67RzqtxY","WpsIMGm2yQU","HYn1FhJe9UE","xfJArHdTY1w","PwRzB4wMnGc","F0aJC-CQzMU","uHdwt9YNCC0","20uj5LS_Z9g","WWgSpF-lWj4","EDn9jzKeLKs","-fhFNe7tYqc","3TUDf_byGYw","sAEFPxlFKZ4","xys_67Hbu5U","P6NXyGwFlQo","NFpWKL7zPz0","EWisnaER_rI","2huSJNHjHxE","3oWp7vyRfSw","UAuHCLnL8-c","SB_M7wTqysY","ef8N8b_NjG4","Kc6lZi-xy3A","wDY0YoTThyU","dkVQdllxiYA","m5FDr9iFkuc","W7nQoI3wje0","4I2p0F0EEc8","sfGrcXQmFcQ"];
const VIDEO_IDS = [...LONG_IDS, ...SHORT_IDS];
const VIEWS_FALLBACK = 0; // shown while the API key is empty or the request fails; 0 keeps the placeholder text
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6h — keeps API quota tiny

function fmt(n) {
  n = Number(n);
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return Math.round(n / 1e3) + "K";
  return String(n);
}

function fmtViews(n) {
  n = Number(n);
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M+";
  if (n >= 1e3) return Math.round(n / 1e3) + "K+";
  return String(n);
}

const DELIVERED_BASELINE = 50; // videos delivered that aren't linked above

function paintDelivered() {
  const n = Math.floor((DELIVERED_BASELINE + VIDEO_IDS.length) / 10) * 10 + "+";
  document.querySelectorAll("[data-count-delivered]").forEach(el => { el.textContent = n; });
}

function paint(counts) {
  let total = 0;
  for (const c of CREATORS) {
    const n = counts[c.id];
    if (!n) continue;
    total += n;
    document.querySelectorAll(`[data-count="${c.id}"]`).forEach(el => { el.textContent = fmt(n) + " subscribers"; });
  }
  const totalEl = document.querySelector("[data-count-total]");
  if (totalEl && total) totalEl.textContent = fmt(total) + "+";
  const viewsEl = document.querySelector("[data-count-views]");
  if (viewsEl && counts.__views) viewsEl.textContent = fmtViews(counts.__views);
  for (const [id, t] of Object.entries(counts.__titles || {})) {
    const d = typeof t === "string" ? { title: t, client: "" } : t;
    document.querySelectorAll(`[data-video="${id}"]`).forEach(a => {
      const ti = a.querySelector(".title"), cl = a.querySelector(".client");
      if (ti) ti.textContent = d.title;
      if (cl) cl.textContent = d.client;
    });
  }
}

const TITLES = {};

async function fetchViews() {
  if (!VIDEO_IDS.length) return 0;
  let sum = 0;
  for (let i = 0; i < VIDEO_IDS.length; i += 50) {
    const ids = VIDEO_IDS.slice(i, i + 50).join(",");
    const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${ids}&key=${YT_API_KEY}`);
    const j = await r.json();
    for (const v of j.items || []) {
      sum += Number(v.statistics?.viewCount || 0);
      if (v.snippet) TITLES[v.id] = { title: v.snippet.title || "", client: v.snippet.channelTitle || "" };
    }
  }
  return sum;
}

async function fetchCounts() {
  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
  if (cached && Date.now() - cached.t < CACHE_TTL) { paint(cached.counts); return; }
  if (!YT_API_KEY) { if (VIEWS_FALLBACK) paint({ __views: VIEWS_FALLBACK }); return; }
  const counts = {};
  try { counts.__views = await fetchViews(); counts.__titles = TITLES; } catch (e) { /* keep fallback */ }
  await Promise.all(CREATORS.filter(c => c.handle).map(async c => {
    try {
      const r = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=${encodeURIComponent(c.handle)}&key=${YT_API_KEY}`);
      const j = await r.json();
      const n = j.items?.[0]?.statistics?.subscriberCount;
      if (n) counts[c.id] = Number(n);
    } catch (e) { /* keep fallback */ }
  }));
  if (Object.keys(counts).length) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), counts }));
    paint(counts);
  }
}

paintDelivered();
fetchCounts();
