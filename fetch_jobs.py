# Runs every hour on GitHub. Saves the latest jobs to jobs.json.
import json, time, urllib.request
UA = {"User-Agent": "JobHuntBot/1.0 (https://mahadiahmednbj-code.github.io)"}
def get(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))
try:
    old = json.load(open("jobs.json", encoding="utf-8"))
except Exception:
    old = {}
now = int(time.time())
out = {"updated": now, "remotive": old.get("remotive", []), "remotive_t": old.get("remotive_t", 0), "arbeitnow": old.get("arbeitnow", [])}
try:
    d = get("https://www.arbeitnow.com/api/job-board-api")["data"][:100]
    out["arbeitnow"] = [{"t": x.get("title"), "c": x.get("company_name"), "l": (x.get("location") or "") + (" (Remote)" if x.get("remote") else ""),
        "cat": ", ".join((x.get("tags") or [])[:3]), "s": "", "u": x.get("url"), "y": ", ".join(x.get("job_types") or []), "src": "Arbeitnow"} for x in d]
except Exception as e:
    print("Arbeitnow failed:", e)
# Remotive asks for at most 4 requests a day, so it is fetched only every 6 hours.
if now - out["remotive_t"] >= 6 * 3600:
    try:
        d = get("https://remotive.com/api/remote-jobs")["jobs"][:200]
        out["remotive"] = [{"t": x.get("title"), "c": x.get("company_name"), "l": x.get("candidate_required_location"), "cat": x.get("category"),
            "s": x.get("salary") or "", "u": x.get("url"), "y": (x.get("job_type") or "").replace("_", " "), "src": "Remotive"} for x in d]
        out["remotive_t"] = now
    except Exception as e:
        print("Remotive failed:", e)
json.dump(out, open("jobs.json", "w", encoding="utf-8"), ensure_ascii=False)
print("done", len(out["arbeitnow"]), len(out["remotive"]))
