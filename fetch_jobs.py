# Runs every hour on GitHub. Saves the latest jobs to jobs.json.
import json, re, time, html, datetime, urllib.request
UA = {"User-Agent": "Mozilla/5.0 (compatible; JobHuntBot/1.0; +https://mahadiahmednbj-code.github.io)"}

def get(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40))

def clean(s, n=170):
    s = re.sub(r"<[^>]+>", " ", html.unescape(s or ""))
    s = re.sub(r"\s+", " ", s).strip()
    return s[:n] + ("…" if len(s) > n else "")

def lst(v):
    return ", ".join(v) if isinstance(v, list) else (v or "")

try:
    old = json.load(open("jobs.json", encoding="utf-8"))
except Exception:
    old = {}
out = {"updated": int(time.time()), "direct": old.get("direct", []), "posts": old.get("posts", []), "pool": old.get("pool", [])}

def arbeit(page):
    d = get("https://www.arbeitnow.com/api/job-board-api?page=%d" % page)["data"]
    r = []
    for x in d:
        dt = ""
        try:
            dt = datetime.datetime.fromtimestamp(int(x.get("created_at"))).strftime("%Y-%m-%dT%H:%M:%S")
        except Exception:
            pass
        r.append({"t": html.unescape(x.get("title") or ""), "c": x.get("company_name") or "", "l": (x.get("location") or "") + (" (Remote)" if x.get("remote") else ""),
                  "cat": ", ".join((x.get("tags") or [])[:3]), "s": "", "u": x.get("url"), "y": ", ".join(x.get("job_types") or []),
                  "d": clean(x.get("description")), "dt": dt, "src": "Arbeitnow"})
    return r

direct, pool = [], []
try:
    direct += arbeit(1)
    time.sleep(2)
    for p in (2, 3, 4):
        pool += arbeit(p)
        time.sleep(2)
except Exception as e:
    print("Arbeitnow failed:", e)

try:
    data = get("https://remoteok.com/api")
    for x in data:
        if not isinstance(x, dict) or not x.get("position"):
            continue
        s = ""
        if x.get("salary_min"):
            s = "$%s - $%s" % (x.get("salary_min"), x.get("salary_max") or x.get("salary_min"))
        u = x.get("url") or ""
        if u.startswith("/"):
            u = "https://remoteok.com" + u
        direct.append({"t": html.unescape(x["position"]), "c": x.get("company") or "", "l": x.get("location") or "Worldwide", "cat": ", ".join((x.get("tags") or [])[:3]),
                       "s": s, "u": u, "y": "", "d": clean(x.get("description")), "dt": (x.get("date") or "")[:19], "src": "RemoteOK"})
except Exception as e:
    print("RemoteOK failed:", e)

posts = []
try:
    time.sleep(2)
    for x in get("https://jobicy.com/api/v2/remote-jobs?count=100").get("jobs", []):
        s = ""
        if x.get("salaryMin"):
            s = "%s - %s %s/%s" % (x.get("salaryMin"), x.get("salaryMax") or x.get("salaryMin"), x.get("salaryCurrency") or "", x.get("salaryPeriod") or "")
        posts.append({"t": html.unescape(x.get("jobTitle") or ""), "c": html.unescape(x.get("companyName") or ""), "l": lst(x.get("jobGeo")), "cat": lst(x.get("jobIndustry")),
                      "s": s, "u": x.get("url"), "y": lst(x.get("jobType")), "d": clean(x.get("jobExcerpt") or x.get("jobDescription")), "dt": x.get("pubDate") or "", "src": "Jobicy"})
except Exception as e:
    print("Jobicy failed:", e)

# keep the old list for a source that failed this time
if any(j["src"] == "Arbeitnow" for j in direct) or any(j["src"] == "RemoteOK" for j in direct):
    out["direct"] = direct
if posts:
    out["posts"] = posts
if pool:
    out["pool"] = pool
json.dump(out, open("jobs.json", "w", encoding="utf-8"), ensure_ascii=False)
print("done", len(out["direct"]), len(out["posts"]), len(out["pool"]))
