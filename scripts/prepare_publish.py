from pathlib import Path
from shutil import copy2
import re,json,hashlib
root=Path(__file__).resolve().parents[1]
public=root/'out'
public.mkdir(exist_ok=True)
files=set()
for p in root.glob('*.html'):
    text=p.read_text(encoding='utf-8')
    files.add(p.name)
    files.update(re.findall(r'(?:src|href)=[\"\'](assets/[^\"\'?]+)',text))
for rel in list(files):
    if rel.endswith('.css'):
        css=(root/rel).read_text(encoding='utf-8')
        for match in re.findall(r'url\([\"\']?([^\)\"\']+)',css):
            if not match.startswith(('http','data:','%','#')):
                files.add((Path(rel).parent/match).as_posix())
for rel in files:
    src=root/rel
    dst=public/rel
    dst.parent.mkdir(parents=True,exist_ok=True)
    copy2(src,dst)
# Refresh cached pages and assets together when publishing a new snapshot.
revision=hashlib.sha256(b''.join((root/rel).read_bytes() for rel in sorted(files))).hexdigest()[:12]
for page in public.glob('*.html'):
    page.write_text(page.read_text(encoding='utf-8').replace('?v=restored',f'?v={revision}'),encoding='utf-8')
manifest=root/'.openai/hosting.json'
data=json.loads(manifest.read_text(encoding='utf-8'))
data['static']={'directory':'out'}
manifest.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
print(f'Prepared {len(files)} public files')
