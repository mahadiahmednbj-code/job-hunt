# Runs every hour on GitHub. Saves the latest jobs to jobs.json.
# Free sources without a key: Arbeitnow, Remote OK, Jobicy, We Work Remotely, The Muse.
# Optional sources (need a free key saved in GitHub Secrets): Adzuna, Jooble.
import json, os, re, time, html, datetime, urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

UA = {"User-Agent": "Mozilla/5.0 (compatible; JobHuntBot/1.0; +https://mahadiahmednbj-code.github.io)"}

def get(url, data=None, raw=False):
    h = dict(UA)
    body = None
    if data is not None:
        h["Content-Type"] = "application/json"
        body = json.dumps(data).encode()
    b = urllib.request.urlopen(urllib.request.Request(url, data=body, headers=h), timeout=40).read()
    return b if raw else json.loads(b)

def clean(s, n=170):
    s = re.sub(r"<[^>]+>", " ", html.unescape(s or ""))
    s = re.sub(r"\s+", " ", s).strip()
    return s[:n] + ("…" if len(s) > n else "")

def lst(v):
    return ", ".join(v) if isinstance(v, list) else (v or "")

def uniq(L):
    seen, out = set(), []
    for j in L:
        if j.get("u") and j["u"] not in seen and j.get("t"):
            seen.add(j["u"]); out.append(j)
    return out

try:
    old = json.load(open("jobs.json", encoding="utf-8"))
except Exception:
    old = {}
od, op, opl = old.get("direct", []), old.get("posts", []), old.get("pool", [])
S = {
    "arb1": [j for j in od if j.get("src") == "Arbeitnow"],
    "rok": [j for j in od if j.get("src") == "RemoteOK"],
    "wwr": [j for j in od if j.get("src") == "WeWorkRemotely"],
    "jobi": [j for j in op if j.get("src") == "Jobicy"],
    "joo": [j for j in op if str(j.get("src", "")).startswith("Jooble")],
    "adz": [j for j in op if j.get("src") == "Adzuna"],
    "arb": [j for j in opl if j.get("src") == "Arbeitnow"],
    "jpool": [j for j in opl if str(j.get("src", "")).startswith("Jooble")],
    "muse": [j for j in op if j.get("src") == "The Muse"],
    "mpool": [j for j in opl if j.get("src") == "The Muse"],
}
now = int(time.time())
t_adz, t_joo = old.get("t_adz", 0), old.get("t_joo", 0)
SIX = 6 * 3600

def arbeit(page):
    r = []
    for x in get("https://www.arbeitnow.com/api/job-board-api?page=%d" % page)["data"]:
        dt = ""
        try:
            dt = datetime.datetime.fromtimestamp(int(x.get("created_at"))).strftime("%Y-%m-%dT%H:%M:%S")
        except Exception:
            pass
        r.append({"t": html.unescape(x.get("title") or ""), "c": x.get("company_name") or "", "l": (x.get("location") or "") + (" (Remote)" if x.get("remote") else ""),
                  "cat": ", ".join((x.get("tags") or [])[:3]), "s": "", "u": x.get("url"), "y": ", ".join(x.get("job_types") or []),
                  "d": clean(x.get("description")), "dt": dt, "src": "Arbeitnow"})
    return r

# --- Arbeitnow (page 1 -> Direct Apply, pages 2-4 -> Client Hunter) ---
try:
    a1 = arbeit(1); time.sleep(2)
    rest = []
    for p in (2, 3, 4):
        rest += arbeit(p); time.sleep(2)
    S["arb1"], S["arb"] = a1, rest
except Exception as e:
    print("Arbeitnow failed:", e)

# --- Remote OK ---
try:
    r = []
    for x in get("https://remoteok.com/api"):
        if not isinstance(x, dict) or not x.get("position"):
            continue
        s = "$%s - $%s" % (x["salary_min"], x.get("salary_max") or x["salary_min"]) if x.get("salary_min") else ""
        u = x.get("url") or ""
        if u.startswith("/"):
            u = "https://remoteok.com" + u
        r.append({"t": html.unescape(x["position"]), "c": x.get("company") or "", "l": x.get("location") or "Worldwide", "cat": ", ".join((x.get("tags") or [])[:3]),
                  "s": s, "u": u, "y": "", "d": clean(x.get("description")), "dt": (x.get("date") or "")[:19], "src": "RemoteOK"})
    if r:
        S["rok"] = r
except Exception as e:
    print("RemoteOK failed:", e)

# --- We Work Remotely (public RSS feeds; links must credit We Work Remotely) ---
WWR = ["remote-jobs.rss", "categories/remote-programming-jobs.rss", "categories/remote-design-jobs.rss", "categories/remote-customer-support-jobs.rss",
       "categories/remote-management-and-finance-jobs.rss", "categories/remote-devops-sysadmin-jobs.rss", "categories/all-other-remote-jobs.rss"]
try:
    r = []
    for f in WWR:
        try:
            root = ET.fromstring(get("https://weworkremotely.com/" + f, raw=True))
        except Exception as e:
            print("WWR feed failed:", f, e); continue
        for it in root.iter("item"):
            g = lambda k: (it.findtext(k) or "").strip()
            t, c = html.unescape(g("title")), ""
            if ": " in t:
                c, t = t.split(": ", 1)
            dt = ""
            try:
                dt = parsedate_to_datetime(g("pubDate")).strftime("%Y-%m-%dT%H:%M:%S")
            except Exception:
                pass
            r.append({"t": t, "c": c, "l": g("region") or "Remote", "cat": g("category"), "s": "", "u": g("link"), "y": g("type"),
                      "d": clean(g("description")), "dt": dt, "src": "WeWorkRemotely"})
        time.sleep(2)
    if r:
        S["wwr"] = uniq(r)
except Exception as e:
    print("WWR failed:", e)

# --- Jobicy (at most once an hour) ---
try:
    time.sleep(2)
    r = []
    for x in get("https://jobicy.com/api/v2/remote-jobs?count=100").get("jobs", []):
        s = "%s - %s %s/%s" % (x["salaryMin"], x.get("salaryMax") or x["salaryMin"], x.get("salaryCurrency") or "", x.get("salaryPeriod") or "") if x.get("salaryMin") else ""
        r.append({"t": html.unescape(x.get("jobTitle") or ""), "c": html.unescape(x.get("companyName") or ""), "l": lst(x.get("jobGeo")), "cat": lst(x.get("jobIndustry")),
                  "s": s, "u": x.get("url"), "y": lst(x.get("jobType")), "d": clean(x.get("jobExcerpt") or x.get("jobDescription")), "dt": x.get("pubDate") or "", "src": "Jobicy"})
    if r:
        S["jobi"] = r
except Exception as e:
    print("Jobicy failed:", e)

# --- The Muse (public API, no key; every job links back to The Muse) ---
def muse(page, remote=True):
    u = "https://www.themuse.com/api/public/jobs?page=%d" % page + ("&location=" + urllib.parse.quote("Flexible / Remote") if remote else "")
    r = []
    for x in get(u).get("results", []):
        locs = ", ".join(l.get("name", "") for l in (x.get("locations") or [])[:2]) or "Flexible / Remote"
        r.append({"t": html.unescape(x.get("name") or ""), "c": (x.get("company") or {}).get("name", ""), "l": locs,
                  "cat": ", ".join(c.get("name", "") for c in (x.get("categories") or [])[:2]), "s": "", "u": (x.get("refs") or {}).get("landing_page"),
                  "y": ((x.get("levels") or [{}])[0] or {}).get("name", ""), "d": clean(x.get("contents")), "dt": (x.get("publication_date") or "")[:19], "src": "The Muse"})
    return r

try:
    time.sleep(2)
    first = muse(1)
    remote = bool(first)
    if not first:
        first = muse(1, False)
    more = []
    for p in (2, 3):
        time.sleep(2)
        more += muse(p, remote)
    if first:
        S["muse"], S["mpool"] = first, more
except Exception as e:
    print("The Muse failed:", e)

# --- Adzuna (free key, about 1000 calls a month, so only every 6 hours) ---
AID, AKEY = os.environ.get("ADZUNA_ID", "").strip(), os.environ.get("ADZUNA_KEY", "").strip()
if AID and AKEY and now - t_adz >= SIX:
    CUR = {"us": "USD", "gb": "GBP", "ca": "CAD", "au": "AUD", "in": "INR"}
    r = []
    for cc, cur in CUR.items():
        try:
            u = "https://api.adzuna.com/v1/api/jobs/%s/search/1?app_id=%s&app_key=%s&results_per_page=50&what_or=%s&content-type=application/json" % (
                cc, AID, AKEY, urllib.parse.quote("remote freelance contract"))
            for x in get(u).get("results", []):
                s = ""
                if x.get("salary_min"):
                    s = "%d - %d %s" % (x["salary_min"], x.get("salary_max") or x["salary_min"], cur) + (" (estimated)" if str(x.get("salary_is_predicted")) == "1" else "")
                r.append({"t": clean(x.get("title"), 120), "c": (x.get("company") or {}).get("display_name", ""), "l": (x.get("location") or {}).get("display_name", ""),
                          "cat": (x.get("category") or {}).get("label", ""), "s": s, "u": x.get("redirect_url"), "y": (x.get("contract_type") or x.get("contract_time") or "").replace("_", " "),
                          "d": clean(x.get("description")), "dt": (x.get("created") or "")[:19], "src": "Adzuna"})
        except Exception as e:
            print("Adzuna", cc, "failed:", e)
        time.sleep(2)
    if r:
        S["adz"], t_adz = uniq(r), now

# --- Jooble (free key from jooble.org/api/about, every 6 hours) ---
JKEY = os.environ.get("JOOBLE_KEY", "").strip()
if JKEY and now - t_joo >= SIX:
    def jooble(kw):
        r = []
        for x in get("https://jooble.org/api/" + JKEY, {"keywords": kw, "page": "1"}).get("jobs", []):
            srcname = (x.get("source") or "").strip()
            r.append({"t": clean(x.get("title"), 120), "c": x.get("company") or "", "l": x.get("location") or "", "cat": kw, "s": x.get("salary") or "", "u": x.get("link"),
                      "y": x.get("type") or "", "d": clean(x.get("snippet")), "dt": (x.get("updated") or "")[:19],
                      "src": "Jooble" + (" · " + srcname if srcname and srcname.lower() != "jooble" else "")})
        return r
    try:
        S["joo"] = uniq(jooble("freelance remote"))
        pool = []
        for kw in ["video editor", "graphic designer", "web developer", "digital marketing", "content writer", "virtual assistant", "data analyst", "customer support"]:
            time.sleep(2)
            try:
                pool += jooble(kw)
            except Exception as e:
                print("Jooble", kw, "failed:", e)
        if pool:
            S["jpool"] = uniq(pool)
        t_joo = now
    except Exception as e:
        print("Jooble failed:", e)

out = {"updated": now, "t_adz": t_adz, "t_joo": t_joo,
       "direct": uniq(S["arb1"] + S["rok"] + S["wwr"]), "posts": uniq(S["jobi"] + S["muse"] + S["joo"] + S["adz"]), "pool": uniq(S["arb"] + S["mpool"] + S["jpool"])}
json.dump(out, open("jobs.json", "w", encoding="utf-8"), ensure_ascii=False)
print("done: direct", len(out["direct"]), "posts", len(out["posts"]), "pool", len(out["pool"]))
